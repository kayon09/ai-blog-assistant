-- ============================================================
-- AI写作助手 数据库初始化脚本 v2
-- 修复：RLS WITH CHECK(C-3)、email 唯一约束(H-4)、外键(M-4)、
--       nullable 对齐(M-5)、trigger_level 语义化(L-3)
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. users — 用户配额与订阅信息
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id       TEXT UNIQUE NOT NULL,          -- Clerk 用户 ID
  email          TEXT NOT NULL UNIQUE,           -- 修复 H-4：加 UNIQUE 约束
  plan_tier      TEXT NOT NULL DEFAULT 'free'
                 CHECK (plan_tier IN ('free', 'pro', 'team')),
  token_used     INTEGER NOT NULL DEFAULT 0,
  token_quota    INTEGER NOT NULL DEFAULT 30000, -- Free: 30000 tokens/月
  quota_reset_at TIMESTAMPTZ NOT NULL DEFAULT (date_trunc('month', NOW()) + INTERVAL '1 month'),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_clerk_id_idx ON users(clerk_id);

-- ============================================================
-- 2. articles — 文章实体
-- 修复 M-4：user_id 通过 clerk_id 建立外键
-- 修复 M-5：title/content 允许 NULL（草稿阶段可为空）
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE, -- 修复 M-4
  title       TEXT,                              -- 草稿阶段可为空（nullable，对齐 TypeScript 类型）
  outline     JSONB,
  content     TEXT,                              -- 草稿阶段可为空（nullable，对齐 TypeScript 类型）
  status      TEXT NOT NULL DEFAULT 'draft'
              CHECK (status IN ('draft', 'completed')),
  word_count  INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS articles_user_id_idx ON articles(user_id);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status);

-- ============================================================
-- 3. usage_logs — Token 用量追踪
-- ============================================================
CREATE TABLE IF NOT EXISTS usage_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  article_id    UUID REFERENCES articles(id) ON DELETE SET NULL,
  operation     TEXT NOT NULL
                CHECK (operation IN (
                  'generate_titles',
                  'generate_outline',
                  'expand_section',
                  'polish',
                  'seo'
                )),
  input_tokens  INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens  INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
  model         TEXT NOT NULL DEFAULT 'glm-4.5-air',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS usage_logs_user_id_idx ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS usage_logs_created_at_idx ON usage_logs(created_at);

-- ============================================================
-- 4. moderation_logs — 内容合规拦截日志
-- 修复 L-3：trigger_level 改为文本枚举，语义自解释
-- ============================================================
CREATE TABLE IF NOT EXISTS moderation_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       TEXT NOT NULL,
  input_hash    TEXT NOT NULL,                   -- 原始输入的 SHA256（不存明文）
  trigger_level TEXT NOT NULL
                CHECK (trigger_level IN (
                  'local_filter',                -- Level 1：本地敏感词库命中
                  'claude_rejection'             -- Level 2：GLM 模型拒答
                )),
  rule_id       TEXT,                            -- 触发的规则 ID（local_filter 时有值）
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS moderation_logs_user_id_idx ON moderation_logs(user_id);
CREATE INDEX IF NOT EXISTS moderation_logs_created_at_idx ON moderation_logs(created_at);

-- ============================================================
-- Row Level Security（RLS）
-- 修复 C-3：全部补充 FOR 子句 + WITH CHECK
-- ============================================================

-- users 表
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_self" ON users
  FOR SELECT USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "users_insert_self" ON users
  FOR INSERT WITH CHECK (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "users_update_self" ON users
  FOR UPDATE
  USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- articles 表
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "articles_select_self" ON articles
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "articles_insert_self" ON articles
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "articles_update_self" ON articles
  FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "articles_delete_self" ON articles
  FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- usage_logs：用户只读，禁止客户端写入（仅 service role 可写）
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_logs_select_self" ON usage_logs
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "usage_logs_no_insert" ON usage_logs
  FOR INSERT WITH CHECK (false);    -- 客户端完全禁止写入

CREATE POLICY "usage_logs_no_update" ON usage_logs
  FOR UPDATE WITH CHECK (false);

CREATE POLICY "usage_logs_no_delete" ON usage_logs
  FOR DELETE USING (false);

-- moderation_logs：仅 service role 可访问，用户完全不可见
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "moderation_logs_deny_all" ON moderation_logs
  USING (false);

-- ============================================================
-- 自动更新 updated_at 的触发器
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 原子性 Token 用量累加 RPC（服务端调用，绕过 RLS）
-- ============================================================
CREATE OR REPLACE FUNCTION increment_token_used(p_clerk_id TEXT, p_tokens INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET token_used = token_used + p_tokens
  WHERE clerk_id = p_clerk_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


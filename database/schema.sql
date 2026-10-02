-- AI Career Advisor - PostgreSQL schema
-- The MVP runs on in-memory storage (see backend/app/storage.py).
-- Wire this up when you get to Phase 5 of the roadmap.

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    extracted_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE user_skills (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    proficiency INTEGER NOT NULL DEFAULT 100 CHECK (proficiency BETWEEN 0 AND 100),
    PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE career_roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE career_skills (
    career_id INTEGER REFERENCES career_roles(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    importance INTEGER NOT NULL DEFAULT 1 CHECK (importance BETWEEN 1 AND 5),
    PRIMARY KEY (career_id, skill_id)
);

CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    career_id INTEGER REFERENCES career_roles(id) ON DELETE CASCADE,
    plan JSONB NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resumes_user ON resumes(user_id);
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_roadmaps_user ON roadmaps(user_id);

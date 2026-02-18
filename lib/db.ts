import { sql } from '@vercel/postgres'

// ============================================================
// SCHEMA INITIALIZATION
// ============================================================

export async function initializeDatabase() {
  // AEX ID counter — starts at 10000
  await sql`
    CREATE TABLE IF NOT EXISTS aex_id_counter (
      id INTEGER PRIMARY KEY DEFAULT 1,
      next_id INTEGER NOT NULL DEFAULT 10000
    )
  `
  await sql`
    INSERT INTO aex_id_counter (id, next_id)
    VALUES (1, 10000)
    ON CONFLICT (id) DO NOTHING
  `

  // Users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      aex_id INTEGER UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      stripe_customer_id VARCHAR(255),
      aex_opt_in BOOLEAN NOT NULL DEFAULT true,
      status VARCHAR(20) NOT NULL DEFAULT 'provisional',
      course_paid BOOLEAN NOT NULL DEFAULT false,
      current_session VARCHAR(10) DEFAULT '1',
      course_completed BOOLEAN NOT NULL DEFAULT false,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  // Conversation history — stores messages per user
  await sql`
    CREATE TABLE IF NOT EXISTS conversation_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      messages JSONB NOT NULL DEFAULT '[]',
      shown_artifacts JSONB NOT NULL DEFAULT '[]',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  // HEX attestations — empty until course completion
  await sql`
    CREATE TABLE IF NOT EXISTS hex_attestations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      domain VARCHAR(255) NOT NULL,
      attestation_type VARCHAR(100) NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      confidence REAL NOT NULL DEFAULT 0.0,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  // Password reset tokens
  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

// ============================================================
// AEX ID ASSIGNMENT
// ============================================================

export async function getNextAexId(): Promise<number> {
  const result = await sql`
    UPDATE aex_id_counter
    SET next_id = next_id + 1
    WHERE id = 1
    RETURNING next_id - 1 AS assigned_id
  `
  return result.rows[0].assigned_id
}

// ============================================================
// USER QUERIES
// ============================================================

export async function createUser(email: string, passwordHash: string, aexId: number) {
  const result = await sql`
    INSERT INTO users (aex_id, email, password_hash, aex_opt_in, status)
    VALUES (${aexId}, ${email}, ${passwordHash}, true, 'provisional')
    RETURNING id, aex_id, email, status, course_paid, current_session, course_completed
  `
  // Create empty conversation history row
  await sql`
    INSERT INTO conversation_history (user_id, messages, shown_artifacts)
    VALUES (${result.rows[0].id}, '[]'::jsonb, '[]'::jsonb)
  `
  return result.rows[0]
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT id, aex_id, email, password_hash, stripe_customer_id,
            aex_opt_in, status, course_paid, current_session,
            course_completed, completed_at, created_at
    FROM users WHERE email = ${email}
  `
  return result.rows[0] || null
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT id, aex_id, email, stripe_customer_id,
            aex_opt_in, status, course_paid, current_session,
            course_completed, completed_at, created_at
    FROM users WHERE id = ${id}
  `
  return result.rows[0] || null
}

export async function markCoursePaid(userId: number, stripeCustomerId: string) {
  await sql`
    UPDATE users
    SET course_paid = true, stripe_customer_id = ${stripeCustomerId}, updated_at = NOW()
    WHERE id = ${userId}
  `
}

export async function markCourseCompleted(userId: number) {
  await sql`
    UPDATE users
    SET course_completed = true, status = 'active', completed_at = NOW(), updated_at = NOW()
    WHERE id = ${userId}
  `
}

export async function updateUserSession(userId: number, session: string) {
  await sql`
    UPDATE users SET current_session = ${session}, updated_at = NOW()
    WHERE id = ${userId}
  `
}

export async function updatePassword(userId: number, passwordHash: string) {
  await sql`
    UPDATE users SET password_hash = ${passwordHash}, updated_at = NOW()
    WHERE id = ${userId}
  `
}

// ============================================================
// CONVERSATION HISTORY
// ============================================================

export async function getConversationHistory(userId: number) {
  const result = await sql`
    SELECT messages, shown_artifacts FROM conversation_history
    WHERE user_id = ${userId}
  `
  return result.rows[0] || { messages: [], shown_artifacts: [] }
}

export async function saveConversationHistory(
  userId: number,
  messages: any[],
  shownArtifacts: string[]
) {
  await sql`
    UPDATE conversation_history
    SET messages = ${JSON.stringify(messages)}::jsonb,
        shown_artifacts = ${JSON.stringify(shownArtifacts)}::jsonb,
        updated_at = NOW()
    WHERE user_id = ${userId}
  `
}

// ============================================================
// HEX ATTESTATIONS
// ============================================================

export async function createHexAttestation(
  userId: number,
  domain: string,
  attestationType: string,
  confidence: number,
  metadata: Record<string, any> = {}
) {
  await sql`
    INSERT INTO hex_attestations (user_id, domain, attestation_type, confidence, metadata)
    VALUES (${userId}, ${domain}, ${attestationType}, ${confidence}, ${JSON.stringify(metadata)}::jsonb)
  `
}

export async function getHexAttestations(userId: number) {
  const result = await sql`
    SELECT domain, attestation_type, count, confidence, metadata, created_at
    FROM hex_attestations WHERE user_id = ${userId}
    ORDER BY created_at ASC
  `
  return result.rows
}

// ============================================================
// PASSWORD RESET TOKENS
// ============================================================

export async function createResetToken(userId: number, token: string, expiresAt: Date) {
  // Invalidate any existing tokens for this user
  await sql`
    UPDATE password_reset_tokens SET used = true WHERE user_id = ${userId} AND used = false
  `
  await sql`
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
  `
}

export async function getValidResetToken(token: string) {
  const result = await sql`
    SELECT prt.id, prt.user_id, prt.expires_at, u.email
    FROM password_reset_tokens prt
    JOIN users u ON u.id = prt.user_id
    WHERE prt.token = ${token} AND prt.used = false AND prt.expires_at > NOW()
  `
  return result.rows[0] || null
}

export async function markTokenUsed(tokenId: number) {
  await sql`
    UPDATE password_reset_tokens SET used = true WHERE id = ${tokenId}
  `
}

// ============================================================
// CLEANUP: Prune unpaid accounts older than 30 days
// Run periodically or call manually from an admin route
// ============================================================

export async function pruneUnpaidAccounts(olderThanDays: number = 30) {
  const result = await sql`
    DELETE FROM users
    WHERE course_paid = false
      AND created_at < NOW() - INTERVAL '1 day' * ${olderThanDays}
    RETURNING id, email
  `
  return result.rows
}

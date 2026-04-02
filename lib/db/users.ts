import { sql } from './client'

export async function createProvisionalUser(email: string): Promise<number> {
  const result = await sql`
    INSERT INTO users (email, status)
    VALUES (${email}, 'provisional')
    -- no-op update required to make RETURNING fire on conflict
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING aex_id
  `
  return result.rows[0].aex_id
}

export async function createEnrollment(aex_id: number, course: string): Promise<void> {
  await sql`
    INSERT INTO enrollments (aex_id, course)
    VALUES (${aex_id}, ${course})
    ON CONFLICT (aex_id, course) DO NOTHING
  `
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  return result.rows[0] ?? null
}

export async function getEnrollment(aex_id: number, course: string) {
  const result = await sql`
    SELECT * FROM enrollments WHERE aex_id = ${aex_id} AND course = ${course}
  `
  return result.rows[0] ?? null
}

export async function activateUser(aex_id: number, password_hash: string): Promise<void> {
  await sql`
    UPDATE users SET status = 'active', password_hash = ${password_hash}
    WHERE aex_id = ${aex_id}
  `
}

export async function markCourseComplete(aex_id: number, course: string): Promise<void> {
  await sql`
    UPDATE enrollments SET completed_at = NOW()
    WHERE aex_id = ${aex_id} AND course = ${course}
    -- completed_at is the hook for future AEXgora DEX credential issuance
  `
}

export async function saveConversation(
  aex_id: number,
  course: string,
  messages: { role: string; text: string }[]
): Promise<void> {
  await sql`
    INSERT INTO conversations (aex_id, course, messages, updated_at)
    VALUES (${aex_id}, ${course}, ${JSON.stringify(messages)}::jsonb, NOW())
    ON CONFLICT (aex_id, course)
    DO UPDATE SET messages = ${JSON.stringify(messages)}::jsonb, updated_at = NOW()
  `
}
// Note: explicit ::jsonb cast required — @vercel/postgres does not auto-serialize
// objects to JSONB. Pre-stringifying without the cast double-encodes.
// loadConversation needs no cast — JSONB deserializes automatically on read.

export async function loadConversation(
  aex_id: number,
  course: string
): Promise<{ role: string; text: string }[] | null> {
  const result = await sql`
    SELECT messages FROM conversations WHERE aex_id = ${aex_id} AND course = ${course}
  `
  if (!result.rows[0]) return null
  return result.rows[0].messages
}

export async function createEnrollmentFromStripe(
  email: string,
  course: string
): Promise<number> {
  // Creates or retrieves user, creates enrollment
  // Idempotent — safe to call multiple times for same email/course
  const existing = await sql`
    SELECT aex_id FROM users WHERE email = ${email}
  `
  if (existing.rows[0]) {
    const aex_id = existing.rows[0].aex_id
    await sql`
      INSERT INTO enrollments (aex_id, course)
      VALUES (${aex_id}, ${course})
      ON CONFLICT (aex_id, course) DO NOTHING
    `
    return aex_id
  }

  const aex_id = await createProvisionalUser(email)
  await createEnrollment(aex_id, course)
  return aex_id
}

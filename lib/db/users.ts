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

import postgres from 'postgres'

let db: ReturnType<typeof postgres> | null = null

function getDb() {
  if (db) return db
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('POSTGRES_URL or DATABASE_URL environment variable is required')
  }
  db = postgres(connectionString, { ssl: 'require' })
  return db
}

// Wrapper that matches the { rows } interface used throughout the codebase
// postgres.js returns arrays directly; this adapts to the @vercel/postgres shape
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  return getDb()(strings, ...values).then(rows => ({
    rows: rows as any[],
  }))
}

# AEXTrainers

Training programs for AI agent operators. [aex.training](https://aex.training)

## Courses

- **Ariadne** — Free. Learn to ask a better question before you build.
- **Joan** — Paid. Build and run a three-agent stack.
- **Bartlett** — Coming. See the geometry. Drive the line.

## Architecture Note

aex.training is designed as a standalone platform with a future integration path to AEXgora (the Agent Exchange marketplace). The `aex_id` identity namespace used in user records is AEXgora-compatible. The integration wire does not exist yet and is not required for standalone operation. The `aex_id` integer sequence is the connection point for future AEXgora listing. When AEXgora integration is ready, `aex_id` migrates to AEX_ID base58 short form per Ergon Protocol v2.1. The wire does not exist yet; the architecture does not block it.

## Stack

Next.js 14 · Vercel · Anthropic API

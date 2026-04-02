// ⚠ UNGATED REDIRECT — Package 3 auth does NOT protect this route.
// Package 4's first task is replacing this redirect with an
// enrollment-checked page. Do not ship Package 3 to production
// and consider this gap closed.
import { redirect } from 'next/navigation'

export default function JoanPage() {
  redirect('/course-1')
}

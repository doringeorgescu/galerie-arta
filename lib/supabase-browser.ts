import { createBrowserClient } from '@supabase/ssr'

// Fallback values ensure the browser client works even when NEXT_PUBLIC_ vars
// are inlined as empty strings during local prebuilt compilation.
// These are intentionally public (anon key has no elevated permissions).
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://nykdhkxsqhxrbmzbezft.supabase.co'

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55a2Roa3hzcWh4cmJtemJlemZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMDA2NjUsImV4cCI6MjA5NDU3NjY2NX0.f14D3VtwCvYNRqGWm7VZOVkfPzwW6zhpEFh_nxcxqMY'

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

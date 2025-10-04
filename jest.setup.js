// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

// Mock environment variables for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000/api'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://nbcnhobkvkelndczcvfo.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY25ob2JrdmtlbG5kY3pjdmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE0OTQsImV4cCI6MjA3Mzc5NzQ5NH0.QnsMnFMAqnrh_iXz5Bbong3GMnEN2J2lhLgKF4wEoGg'

# 🚀 Cockpit Implementation - Start Here

**Last Updated:** 2025-10-02
**Current Status:** Ready to Begin Phase 0

---

## 📖 Quick Overview

We're transforming OmniSignalAI-web into a **dual-purpose cockpit**:
- ✅ **Public website** - Marketing content for visitors
- ✅ **Internal dashboard** - AI-powered content management for marketing team

**Important:** Backend team (omnidraft) is building blog generation pipeline **in parallel**. We need to coordinate.

---

## 📚 Documentation Structure

### 1. **COCKPIT-IMPLEMENTATION-PLAN.md** (Main Blueprint)
   - 3 phases, 20+ tasks
   - Complete technical specifications
   - Code examples for each task
   - Testing requirements
   - 1,759 lines of detailed guidance

### 2. **BACKEND-FRONTEND-COORDINATION.md** (Coordination Guide)
   - What backend is building
   - API availability timeline
   - Integration strategy
   - Sync points and milestones

### 3. **This File (START-HERE.md)** (Quick Start)
   - What to do right now
   - Decision points
   - Next steps

---

## 🎯 Current Situation

### ✅ What's Ready Now
- **Backend API:** Running on http://localhost:8000
- **Supabase:** Configured and ready
- **Blog CRUD endpoints:** Already live (`/api/v1/blog/posts`)
- **Auth endpoints:** Already live (`/api/auth/*`)

### 🚧 What's Being Built (Backend)
- **AI Generation Pipeline:** Week 4-6 (multi-agent blog writing)
- **Review Workflows:** Week 7-9 (human-in-the-loop approvals)
- **Video Generation:** Week 10-12 (media enhancement)

### ⏳ What We're Building (Frontend)
- **Phase 0 (1-2 sessions):** Foundation - API client, auth setup
- **Phase 1 (2-3 sessions):** Auth UI, dual content system
- **Phase 2 (3-4 sessions):** Dashboard, content manager, AI wizard
- **Phase 3 (1 session):** Lead forms integration

---

## 🤔 Key Decision Points

### Decision 1: Start Immediately or Wait for Backend?
**Recommendation:** **START IMMEDIATELY** ✅

**Why:**
- Phase 0 uses existing endpoints (no dependencies)
- Phase 1 uses existing blog CRUD (no dependencies)
- Phase 2 can use fallback until backend generation ready
- We can iterate and test while backend builds

**Alternative:** Wait for backend Week 6 (not recommended - wastes time)

---

### Decision 2: AI Wizard Strategy
**Two Options:**

#### Option A: Build with Fallback (Recommended) ✅
```typescript
// Start with simple AI call, upgrade to pipeline later
const generateContent = async (params) => {
  if (BACKEND_PIPELINE_AVAILABLE) {
    return await blogService.generateContentPipeline(params) // Backend Week 6
  }
  // Fallback: direct AI call (works now)
  return await aiService.generateText(params)
}
```

**Pros:**
- Start building UI immediately
- Test user experience early
- Seamless upgrade when backend ready

**Cons:**
- Need to swap implementation later (minimal work)

#### Option B: Wait for Backend Pipeline
**Pros:** Only implement once
**Cons:** Delays Phase 2 by 4-6 weeks

---

### Decision 3: Coordination Frequency
**Options:**
- **Daily standups** (overkill)
- **Weekly syncs** (recommended) ✅
- **Ad-hoc only** (risky)

**Recommendation:** Weekly Monday sync + Slack for urgent items

---

## 🏁 Immediate Next Steps

### Step 1: Choose Your Path

#### Path A: Full Speed Ahead (Recommended) ✅
```bash
# Start Phase 0 NOW
cd /home/prodij/OmniSignalAI-web
git checkout -b feature/cockpit-phase-0
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js axios
```

**Timeline:**
- Today: Task 0.1-0.3 (dependencies, env, Supabase client)
- Tomorrow: Task 0.4-0.6 (API client, services, tests)
- Next week: Phase 1 (auth UI, dual content)

#### Path B: Coordinate First
```bash
# Set up coordination meeting
# Review backend API specs
# Align on contracts
# Then start Phase 0
```

**Timeline:**
- This week: Coordination meetings
- Next week: Start Phase 0
- Week 3: Phase 1

---

### Step 2: Validate Backend Connection

Before starting Phase 0, confirm backend is accessible:

```bash
# Test backend is running
curl http://localhost:8000/health

# Test blog endpoint
curl http://localhost:8000/api/v1/blog/posts

# Test auth endpoint
curl http://localhost:8000/api/auth/status
```

**Expected Results:**
- ✅ Backend responds with 200 OK
- ✅ Blog endpoint returns posts (or empty array)
- ✅ Auth endpoint returns status

If any fail, check:
```bash
docker ps | grep omnidraft-backend
# Should show omnidraft-backend container running
```

---

### Step 3: Environment Setup

Create `.env.local`:
```bash
cp .env.example .env.local
```

Add these critical values:
```env
# Backend Connection
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Supabase (from omnidraft)
NEXT_PUBLIC_SUPABASE_URL=https://nbcnhobkvkelndczcvfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY25ob2JrdmtlbG5kY3pjdmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE0OTQsImV4cCI6MjA3Mzc5NzQ5NH0.QnsMnFMAqnrh_iXz5Bbong3GMnEN2J2lhLgKF4wEoGg

# Feature Flags
NEXT_PUBLIC_ENABLE_COCKPIT=true
NEXT_PUBLIC_ENABLE_API_CONTENT=true
```

---

### Step 4: Create First Task Branch

```bash
git checkout -b feature/cockpit-phase-0-foundation
```

**Today's Tasks (2-3 hours):**
1. ✅ Install dependencies (Task 0.1)
2. ✅ Configure .env.local (Task 0.2)
3. ✅ Create Supabase client (Task 0.3)
4. ✅ Create API client with interceptors (Task 0.4)

**Tomorrow's Tasks (2-3 hours):**
5. ✅ Build service layer (Task 0.5)
6. ✅ Integration tests (Task 0.6)
7. ✅ Commit and push

---

## 🧪 Testing Your Progress

After each task, validate:

### After Task 0.3 (Supabase Client)
```typescript
// Create test file: lib/supabase/__test__.ts
import { createClient } from './client'

const supabase = createClient()
console.log('Supabase client created:', !!supabase)
```

### After Task 0.4 (API Client)
```typescript
// Create test file: lib/api/__test__.ts
import { apiClient } from './client'

const test = async () => {
  const response = await apiClient.get('/health')
  console.log('Backend health:', response.data)
}
test()
```

### After Task 0.5 (Services)
```typescript
// Create test file: lib/api/__test__.ts
import { blogService } from './services/blog'

const test = async () => {
  const posts = await blogService.getPosts({ page: 1, page_size: 5 })
  console.log('Posts fetched:', posts.posts.length)
}
test()
```

### After Task 0.6 (Integration Tests)
```bash
npm test -- __tests__/api/blog-service.test.ts
```

**Expected:** All tests pass ✅

---

## 📊 Progress Tracking

### Phase 0 Checklist
- [ ] Task 0.1: Dependencies installed
- [ ] Task 0.2: Environment configured
- [ ] Task 0.3: Supabase client created
- [ ] Task 0.4: API client with interceptors
- [ ] Task 0.5: Service layer (blog, auth)
- [ ] Task 0.6: Integration tests passing

### Completion Criteria
- ✅ Can authenticate with Supabase
- ✅ Can fetch blog posts from API
- ✅ API client auto-refreshes tokens
- ✅ All integration tests pass
- ✅ No TypeScript errors

---

## 🚨 Common Issues & Solutions

### Issue 1: Backend Not Responding
**Symptom:** `ECONNREFUSED` or timeout errors

**Solutions:**
```bash
# Check backend is running
docker ps | grep omnidraft

# If not running, start it
cd /home/prodij/omnidraft/main
docker-compose up -d

# Check logs
docker logs omnidraft-backend -f
```

### Issue 2: Supabase Auth Errors
**Symptom:** 401 Unauthorized, invalid JWT

**Solutions:**
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` matches omnidraft
- Check Supabase project is active: https://app.supabase.com
- Clear browser cookies and localStorage

### Issue 3: CORS Errors
**Symptom:** Browser blocks requests to localhost:8000

**Solutions:**
- Backend already has CORS configured for localhost:5000
- Check browser console for specific CORS error
- Verify `CORS_ORIGINS` in backend includes `http://localhost:5000`

### Issue 4: TypeScript Type Errors
**Symptom:** Type mismatches on API responses

**Solutions:**
- Check backend schema matches frontend interfaces
- Use `unknown` type and validate responses
- Request OpenAPI spec from backend team

---

## 🎓 Learning Resources

### Supabase Auth Helpers
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Session Management](https://supabase.com/docs/guides/auth/sessions)

### Next.js 14 App Router
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### Testing
- [Jest Integration Tests](https://jestjs.io/docs/tutorial-react)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🤝 Getting Help

### Backend Questions
- Check omnidraft API docs: http://localhost:8000/docs
- Review backend plan: `/home/prodij/omnidraft/main/BLOG-CONTENT-GENERATION-IMPLEMENTATION-PLAN.md`
- Tag backend team in coordination channel

### Frontend Questions
- Review implementation plan: `COCKPIT-IMPLEMENTATION-PLAN.md`
- Check design system: `lib/design-system/`
- Review existing code patterns

### Coordination Questions
- Review: `BACKEND-FRONTEND-COORDINATION.md`
- Schedule sync meeting
- Post in `#cockpit-integration` channel

---

## 🎬 Ready to Start?

### Recommended: Full Speed Path

```bash
# 1. Create branch
git checkout -b feature/cockpit-phase-0

# 2. Install dependencies
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js axios

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with Supabase credentials

# 4. Start implementing
# Follow COCKPIT-IMPLEMENTATION-PLAN.md Task 0.3 onwards

# 5. Run dev server
npm run dev
```

### Alternative: Coordination First Path

```bash
# 1. Review all documentation
cat COCKPIT-IMPLEMENTATION-PLAN.md
cat BACKEND-FRONTEND-COORDINATION.md

# 2. Test backend connectivity
curl http://localhost:8000/health

# 3. Schedule coordination meeting
# Discuss API contracts, timelines, integration strategy

# 4. Then proceed with implementation
```

---

## 📅 Timeline Summary

### This Week (Week 1)
- **Monday-Tuesday:** Phase 0 implementation (foundation)
- **Wednesday:** Phase 0 testing and validation
- **Thursday:** Coordination sync with backend team
- **Friday:** Phase 1 planning

### Next Week (Week 2)
- **Monday-Wednesday:** Phase 1 implementation (auth + dual content)
- **Thursday:** Phase 1 testing
- **Friday:** Demo and review

### Week 3-4
- Phase 2 planning and implementation (dashboard)

### Week 5+
- Remaining phases based on backend coordination

---

## ✅ Final Checklist Before Starting

- [ ] Read this document (START-HERE.md)
- [ ] Read COCKPIT-IMPLEMENTATION-PLAN.md (main blueprint)
- [ ] Read BACKEND-FRONTEND-COORDINATION.md (coordination guide)
- [ ] Verify backend is running (`docker ps`)
- [ ] Test backend API (`curl http://localhost:8000/health`)
- [ ] Choose your path (Full Speed vs Coordination First)
- [ ] Create feature branch
- [ ] Begin Phase 0 Task 0.1

---

**🚀 You're ready to begin! Start with Phase 0, Task 0.1 in COCKPIT-IMPLEMENTATION-PLAN.md**

**Questions? Review the coordination doc or schedule a sync meeting.**

---

**Last Updated:** 2025-10-02
**Next Review:** After Phase 0 Complete

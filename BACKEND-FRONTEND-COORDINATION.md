# Backend-Frontend Coordination Plan
**Version:** 1.0
**Date:** 2025-10-02
**Purpose:** Coordinate parallel development between omnidraft backend and OmniSignalAI-web frontend

---

## 🔄 Parallel Development Status

### Backend Team (omnidraft)
**Working On:** Blog Content Generation System
**Plan:** `/home/prodij/omnidraft/main/BLOG-CONTENT-GENERATION-IMPLEMENTATION-PLAN.md`
**Duration:** 12 weeks (48 sessions)

**Key Features Being Built:**
- Multi-agent blog content generation pipeline
- Human-in-the-loop (HITL) review workflows
- Enhanced image generation for blogs
- Video generation integration
- Quality assurance framework

### Frontend Team (OmniSignalAI-web)
**Working On:** Cockpit Dashboard Integration
**Plan:** `COCKPIT-IMPLEMENTATION-PLAN.md`
**Duration:** 8-12 sessions (across 3 phases)

**Key Features Being Built:**
- Supabase authentication integration
- Dual content system (file-based + API)
- Dashboard for content management
- AI content wizard
- Lead forms integration

---

## 🔌 API Contract Alignment

### Currently Available Endpoints (✅ Ready to Use)

| Endpoint | Method | Purpose | Status | Frontend Usage |
|----------|--------|---------|--------|----------------|
| `/api/auth/*` | POST | Magic link, OAuth | ✅ Live | Phase 0 - Auth setup |
| `/api/v1/blog/posts` | GET | List blog posts | ✅ Live | Phase 1 - Dual content |
| `/api/v1/blog/posts/{slug}` | GET | Get single post | ✅ Live | Phase 1 - Dual content |
| `/api/v1/blog/posts` | POST | Create blog post | ✅ Live | Phase 2 - Content wizard |
| `/api/v1/blog/posts/{id}` | PUT | Update blog post | ✅ Live | Phase 2 - Post editor |
| `/api/v1/blog/posts/{id}` | DELETE | Delete blog post | ✅ Live | Phase 2 - Content manager |
| `/api/v1/blog/posts/{id}/publish` | POST | Publish draft | ✅ Live | Phase 2 - Content manager |

### Under Development (🚧 Backend Building)

| Endpoint | Method | Purpose | Backend ETA | Frontend Needs |
|----------|--------|---------|-------------|----------------|
| `/api/v1/blog/generate` | POST | Start AI generation pipeline | Week 4-6 | Phase 2 - AI wizard |
| `/api/v1/blog/generate/{job_id}` | GET | Get generation status | Week 4-6 | Phase 2 - Status polling |
| `/api/v1/blog/generate/{job_id}/cancel` | POST | Cancel generation | Week 4-6 | Phase 2 - Cancel button |
| `/api/v1/blog/reviews` | GET | Get pending reviews | Week 7-9 | Phase 2+ - Review queue |
| `/api/v1/blog/reviews/{id}/approve` | POST | Approve review | Week 7-9 | Phase 2+ - Approval flow |
| `/api/v1/blog/reviews/{id}/reject` | POST | Reject review | Week 7-9 | Phase 2+ - Rejection flow |
| `/api/v1/media/video/generate` | POST | Generate video | Week 10-12 | Future - Video support |

---

## 📋 Coordination Strategy

### Phase 0 (Frontend) - Start Immediately ✅
**Duration:** 1-2 sessions
**Backend Dependency:** NONE - uses existing endpoints

**Tasks:**
1. Install Supabase + axios dependencies
2. Configure environment variables
3. Create authenticated API client
4. Build service layer for existing endpoints
5. Integration tests with current API

**Backend Coordination:** None required - uses live endpoints

---

### Phase 1 (Frontend) - After Phase 0 Complete
**Duration:** 2-3 sessions
**Backend Dependency:** Blog CRUD endpoints (✅ already live)

**Tasks:**
1. Authentication UI (login, callback)
2. Auth middleware
3. Dual content resolver (file + API)
4. Update blog pages to use resolver
5. Integration tests

**Backend Coordination:**
- ✅ Endpoints already available
- **Sync Point:** Validate blog post schema matches expectations
- **Action:** Backend team to provide OpenAPI/Swagger spec for blog endpoints

---

### Phase 2 (Frontend) - Parallel with Backend Week 4-6
**Duration:** 3-4 sessions
**Backend Dependency:** Generation pipeline endpoints (🚧 in development)

**Tasks:**
1. Dashboard layout
2. Content manager (uses existing CRUD)
3. AI content wizard (needs new generation endpoint)
4. Post editor
5. Integration tests

**Backend Coordination:**
- **Option A (Recommended):** Build wizard UI with mock/placeholder for generation, swap to real API when ready
- **Option B:** Wait for backend generation endpoints before building wizard
- **Sync Point Week 4:** Backend provides generation endpoint contract
- **Sync Point Week 6:** Frontend integrates real generation API

**Implementation Strategy:**
```typescript
// Phase 2 - Initial (uses fallback)
const generateContent = async (params) => {
  if (process.env.NEXT_PUBLIC_ENABLE_AI_GENERATION === 'true') {
    // Try new generation pipeline
    return await blogService.generateContent(params)
  }
  // Fallback: direct AI call (like current implementation)
  return await aiService.generateText(params)
}

// Phase 2 - Final (after backend Week 6)
const generateContent = async (params) => {
  // Use backend pipeline exclusively
  const job = await blogService.startGeneration(params)
  return await blogService.pollGenerationStatus(job.id)
}
```

---

### Phase 3 (Frontend) - After Phase 2 Complete
**Duration:** 1 session
**Backend Dependency:** Leads endpoint (✅ already live)

**Tasks:**
1. Update contact forms to POST to `/api/v1/leads`
2. Form validation and success states

**Backend Coordination:** None - endpoint exists

---

## 🔄 Review & Approval Workflow (Future Phase)

**Backend ETA:** Week 7-9
**Frontend Implementation:** After Phase 3 complete

### New Components Needed:
1. **Review Queue Dashboard** (`/dashboard/reviews`)
   - Lists pending content reviews
   - Shows review status and history

2. **Review Interface** (`/dashboard/reviews/[id]`)
   - Side-by-side content comparison
   - Inline editing with suggestions
   - Approve/Reject buttons

3. **Notification System**
   - Real-time alerts for new reviews
   - WebSocket or polling for updates

**Coordination Required:**
- Backend to provide WebSocket events schema
- Frontend to implement real-time listeners
- Shared review status state machine

---

## 🎯 Integration Milestones

### Week 1-2: Foundation (Frontend Only)
- [ ] Frontend Phase 0 complete
- [ ] API client configured
- [ ] Integration tests passing
- [ ] **Deliverable:** Can authenticate and fetch blog posts from API

### Week 3-4: Auth & Content (Frontend + Backend Sync)
- [ ] Frontend Phase 1 complete
- [ ] Dual content system working
- [ ] Backend provides blog schema documentation
- [ ] **Deliverable:** Authenticated users see API content, public sees static

### Week 5-7: Dashboard MVP (Parallel Development)
- [ ] Frontend Phase 2 (dashboard) 80% complete
- [ ] Backend Week 4-6 (generation pipeline) complete
- [ ] Integration of generation API
- [ ] **Deliverable:** Dashboard can manage content, wizard uses real AI pipeline

### Week 8: Forms & Polish (Frontend Final)
- [ ] Frontend Phase 3 complete
- [ ] Lead forms integrated
- [ ] All integration tests passing
- [ ] **Deliverable:** Full cockpit functional with current backend features

### Week 9-12: Advanced Features (Backend + Frontend)
- [ ] Backend review workflows complete
- [ ] Frontend review UI implemented
- [ ] Video generation integration (if ready)
- [ ] **Deliverable:** Full HITL workflow with human review

---

## 📡 Communication Channels

### Sync Points
1. **Weekly Sync** - Monday morning
   - Backend team shares API progress
   - Frontend team shares integration blockers
   - Align on upcoming week's coordination needs

2. **Ad-hoc Coordination** - As needed
   - Slack/Discord channel: `#cockpit-integration`
   - Tag relevant team members for urgent questions

### Documentation Requirements

**Backend Team Must Provide:**
- [ ] OpenAPI/Swagger specification for blog endpoints
- [ ] Example request/response payloads for new endpoints
- [ ] WebSocket event schema (for review notifications)
- [ ] Database schema changes (for context)

**Frontend Team Must Provide:**
- [ ] Component interface requirements
- [ ] State management patterns for real-time updates
- [ ] Error handling expectations
- [ ] Loading state designs

---

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests:** Each agent, service, route tested independently
- **Integration Tests:** Full pipeline tests (research → write → SEO)
- **API Tests:** Endpoint validation with real requests

### Frontend Testing
- **Integration Tests:** Real API calls (no mocks) to localhost:8000
- **E2E Tests:** Full user workflows (login → generate → publish)
- **Compatibility Tests:** Ensure static content still works

### Joint Testing
- **Contract Tests:** Frontend expectations match backend responses
- **Load Tests:** Dashboard performance with real data volume
- **Security Tests:** Auth flows and permission boundaries

---

## 🚨 Risk Mitigation

### Risk 1: Backend API Changes Breaking Frontend
**Mitigation:**
- Use feature flags to enable/disable new integrations
- Version API endpoints (`/api/v1/`, `/api/v2/`)
- Frontend maintains fallback to existing behavior

### Risk 2: Frontend Blocking on Backend Features
**Mitigation:**
- Frontend implements mock/placeholder for unavailable APIs
- Use TypeScript interfaces to define contracts early
- Backend provides stubs/mocks for frontend development

### Risk 3: Schema Mismatches
**Mitigation:**
- Shared TypeScript types generated from backend schemas
- Regular validation of request/response shapes
- Automated contract testing

### Risk 4: Parallel Development Conflicts
**Mitigation:**
- Clear ownership boundaries (backend owns API, frontend owns UI)
- Git branch strategy: `feature/backend-*` and `feature/frontend-*`
- Regular merges to avoid large conflicts

---

## 📊 Progress Tracking

### Backend Progress (omnidraft team updates)
- [ ] Week 1-3: Core blog models and basic CRUD ✅ (Already done)
- [ ] Week 4-6: AI generation pipeline 🚧
- [ ] Week 7-9: HITL review workflows 📅
- [ ] Week 10-12: Video generation 📅

### Frontend Progress (web team updates)
- [ ] Phase 0: Foundation (Week 1-2)
- [ ] Phase 1: Auth & Dual Content (Week 3-4)
- [ ] Phase 2: Dashboard (Week 5-7)
- [ ] Phase 3: Forms (Week 8)
- [ ] Future: Review UI (Week 9+)

### Integration Status
- [ ] Auth integration complete
- [ ] Blog CRUD integration complete
- [ ] Generation pipeline integration complete
- [ ] Review workflow integration complete
- [ ] Video generation integration complete

---

## 🔧 Technical Decisions Log

### Decision 1: API Authentication
**Date:** 2025-10-02
**Decision:** Use Supabase JWT tokens in Authorization header
**Rationale:** Backend already uses Supabase auth, frontend matches pattern
**Impact:** Frontend auth middleware uses same session management

### Decision 2: Content Resolution Strategy
**Date:** 2025-10-02
**Decision:** Dual content system (file-based + API) with feature flag
**Rationale:** Gradual migration, no breaking changes, fallback available
**Impact:** Frontend resolver tries API first, falls back to static files

### Decision 3: Real-time Updates
**Date:** TBD (when backend implements)
**Options:** WebSocket vs Polling
**Pending:** Backend team to decide and document

### Decision 4: Error Handling
**Date:** 2025-10-02
**Decision:** Frontend gracefully degrades on API errors
**Rationale:** Website must remain functional even if backend is down
**Impact:** Dual content system provides resilience

---

## 🎬 Getting Started (Frontend Team)

### Immediate Actions (This Session)
1. ✅ Read this coordination plan
2. ✅ Review backend blog implementation plan
3. ✅ Start Phase 0 implementation (no backend dependencies)

### This Week
1. Complete Phase 0 (foundation setup)
2. Request OpenAPI spec from backend team
3. Validate blog post schema with real API
4. Plan Phase 1 implementation

### Next Week (Coordination Meeting)
1. Demo Phase 0 working (authenticated API calls)
2. Review backend generation pipeline design
3. Agree on wizard integration approach (mock vs wait)
4. Set Phase 2 start date

---

## 📚 Reference Documents

### Backend Resources
- `/home/prodij/omnidraft/main/BLOG-CONTENT-GENERATION-IMPLEMENTATION-PLAN.md`
- `/home/prodij/omnidraft/main/CONTENT-GENERATION-SYSTEM.md`
- `/home/prodij/omnidraft/main/plan-website.md`
- Backend API Docs: http://localhost:8000/docs

### Frontend Resources
- `COCKPIT-IMPLEMENTATION-PLAN.md` (this repo)
- `AI_AGENT_INTEGRATION_PLAN.md` (this repo)
- `CLAUDE.md` (this repo - project guidelines)

### Shared Resources
- Supabase Dashboard: https://app.supabase.com/project/nbcnhobkvkelndczcvfo
- API Contract (TBD - backend to provide)
- Integration test suite (TBD - joint development)

---

**Last Updated:** 2025-10-02
**Next Review:** After Phase 0 Complete
**Coordination Lead:** TBD

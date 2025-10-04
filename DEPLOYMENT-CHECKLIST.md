# Content Cockpit - Deployment Checklist

## ✅ Completed Implementation

### Phase 0: Foundation & API Client Setup
- [x] Modern Supabase Auth Integration (@supabase/ssr)
- [x] Production-ready API client (JWT, token refresh, retry logic)
- [x] Blog service (CRUD operations)
- [x] Auth service (magic link, OAuth, session management)
- [x] Integration tests (19 tests passing)
- [x] Type safety (zero TypeScript errors)

### Phase 1: Auth UI & Dual Content System
- [x] Magic link login page
- [x] OAuth callback route
- [x] Session middleware (route protection)
- [x] Dual content resolver (API-first, static fallback)
- [x] Blog pages integration
- [x] Integration tests (19 tests passing)

### Phase 2: Content Cockpit Dashboard
- [x] Design system extensions (Select, Textarea, Table)
- [x] Dashboard layout with navigation
- [x] Overview page with statistics
- [x] Content manager (list, publish, edit, delete)
- [x] AI content wizard
- [x] Post editor
- [x] Integration tests (10 test cases)

## 🚀 Deployment Steps

### 1. Environment Configuration

**Frontend (.env.local)**
```env
# Supabase (from omnidraft backend)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Feature Flags
NEXT_PUBLIC_ENABLE_API_CONTENT=true
```

**Backend (omnidraft)**
- Ensure backend is running on port 8000
- Supabase configured and migrations applied
- Blog endpoints available at `/api/v1/blog/*`

### 2. Pre-Deployment Checks

```bash
# Type check
npm run type-check

# Run tests
npm test

# Build for production
npm run build

# Test production build locally
npm start
```

### 3. First-Time Setup

1. **Start backend**
   ```bash
   cd /home/prodij/omnidraft
   docker-compose up -d
   ```

2. **Start frontend**
   ```bash
   cd /home/prodij/OmniSignalAI-web
   npm run dev
   ```

3. **Create first user**
   - Navigate to http://localhost:3000/login
   - Enter email and request magic link
   - Check email and click link
   - You'll be redirected to /dashboard

4. **Test content creation**
   - Go to /dashboard/generate
   - Fill out AI wizard form
   - Generate content
   - Edit and publish

### 4. Production Deployment

#### Option A: Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_API_BASE_URL
# - NEXT_PUBLIC_ENABLE_API_CONTENT
```

#### Option B: Docker (Full Stack)
```bash
# Frontend
npm run docker:prod

# Backend (omnidraft)
cd /home/prodij/omnidraft
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Post-Deployment Verification

- [ ] Login page loads (/login)
- [ ] Magic link email received
- [ ] Dashboard accessible after login (/dashboard)
- [ ] Statistics display correctly
- [ ] Content manager shows posts
- [ ] Can create new draft post
- [ ] Can edit existing post
- [ ] Can publish draft
- [ ] Can delete post
- [ ] Public blog shows published posts
- [ ] Unauthenticated users see static content
- [ ] Authenticated users see API content

## 🔧 Configuration Reference

### Middleware Protection
Routes protected by middleware:
- `/dashboard/*` - Requires authentication
- `/login` - Redirects if already authenticated

### API Endpoints Used
```
GET    /api/v1/blog/posts          # List posts
GET    /api/v1/blog/posts/:slug    # Get by slug
GET    /api/v1/blog/posts/:id      # Get by ID
POST   /api/v1/blog/posts          # Create post
PUT    /api/v1/blog/posts/:id      # Update post
DELETE /api/v1/blog/posts/:id      # Delete post
POST   /api/v1/blog/posts/:id/publish  # Publish post
```

### Content Sources
1. **API Content** (when authenticated + feature flag enabled)
   - Source: omnidraft backend
   - Real-time updates
   - Full CRUD operations

2. **Static Content** (fallback)
   - Source: .velite output
   - MDX files from content/blog/
   - Read-only, build-time generated

## 📊 Monitoring

### Key Metrics to Track
- Login success rate
- Content creation rate
- Publish rate (draft → published)
- API response times
- Error rates

### Logging
- Content resolver logs source (API vs static)
- API client logs retries and errors
- Dashboard actions logged to console

## 🐛 Troubleshooting

### Issue: "Not authenticated" errors
**Solution:** Check Supabase session in browser cookies. Clear cookies and re-login.

### Issue: Dashboard shows 0 posts
**Solutions:**
1. Check backend is running: `curl http://localhost:8000/health`
2. Check API base URL in .env.local
3. Check feature flag: `NEXT_PUBLIC_ENABLE_API_CONTENT=true`
4. Check browser console for API errors

### Issue: Content resolver always uses static
**Solutions:**
1. Verify feature flag is set
2. Check authentication status
3. Look for console logs: `[Content Resolver] Using static content`

### Issue: Type errors after changes
**Solution:** Run `npm run type-check` and fix errors before deployment

## 📝 Notes

### Current Limitations
- Integration tests require manual authentication (documented in test files)
- AI generation endpoint may not be fully implemented in backend yet
- Phase 3 (lead forms) is optional and not yet implemented

### Future Enhancements
- Add content scheduling
- Add bulk operations
- Add content analytics
- Add image upload for blog posts
- Add collaborative editing
- Add content versioning

## 🎯 Success Criteria

Deployment is successful when:
- [x] All builds pass without errors
- [x] Type check passes (zero errors)
- [ ] Dashboard accessible to authenticated users
- [ ] Content CRUD operations work
- [ ] Published posts visible on public blog
- [ ] Dual content system working (API + static fallback)

## 📞 Support

If issues arise:
1. Check logs: `docker-compose logs -f` (backend)
2. Check browser console (frontend)
3. Verify environment variables
4. Test API endpoints directly with curl/Postman
5. Check this checklist

---

**Status:** Ready for deployment
**Last Updated:** 2025-10-02
**Version:** 1.0.0

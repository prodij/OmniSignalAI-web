# Content Cockpit - User Testing Plan

## 🎯 Testing Objectives

**Primary Goals:**
1. Verify all features work as expected
2. Ensure intuitive navigation and user experience
3. Validate error handling and edge cases
4. Test the complete content creation workflow
5. Verify dual content system works correctly

**Success Criteria:**
- User can complete all tasks without documentation
- No critical bugs or errors encountered
- Intuitive UI requires minimal explanation
- Content flows smoothly from creation to publication

## 👥 Test Participants

**Ideal Testers:**
1. **Marketing Team Member** - Primary user, will use daily
2. **Content Creator** - Writes blog posts regularly
3. **Non-Technical User** - Tests intuitiveness
4. **Technical User** - Can identify bugs/edge cases

**Minimum:** 1-2 testers from different backgrounds

## 🛠️ Pre-Test Setup

### 1. Environment Preparation

**Backend (omnidraft):**
```bash
# Start the backend
cd /home/prodij/omnidraft
docker-compose up -d

# Verify it's running
curl http://localhost:8000/health
# Should return: {"status":"healthy",...}
```

**Frontend:**
```bash
# Start the frontend
cd /home/prodij/OmniSignalAI-web
npm run dev

# Should be running on http://localhost:3000
```

### 2. Test Data Preparation

**Create some sample content in the backend:**
- 2-3 published posts (for content manager to show)
- 1-2 draft posts (to test publishing)
- 1 post ready for editing

**Note:** You can use the AI wizard during testing to generate these, or create them manually via the backend.

### 3. Test User Setup

**Option A: Use your own email**
- Tester uses their real email
- Receives magic link emails
- Can test full auth flow

**Option B: Test email account**
- Create a test email account (e.g., testuser@yourdomain.com)
- Configure in your email system
- Use for testing

## 📋 Test Scenarios

### Scenario 1: First-Time User Experience (15-20 minutes)

**Objective:** Test the complete onboarding flow from landing to first post published.

**Instructions to Tester:**
> "Imagine you're a marketing team member who's heard about this new Content Cockpit. You need to create and publish a blog post about 'AI in Marketing Automation'. Navigate through the platform naturally and try to accomplish this goal."

**Expected User Journey:**
1. Open browser → Navigate to `http://localhost:3000`
2. Notice website is the marketing site (optional: browse around)
3. Navigate to `/login` (or find login link)
4. Enter email → Request magic link
5. Check email → Click link
6. Land on `/dashboard` → See overview page
7. Explore statistics cards
8. Click "Generate New Content" or navigate to Generate tab
9. Fill out AI wizard form:
   - Topic: "AI in Marketing Automation"
   - Keywords: "AI, marketing, automation, ROI"
   - Tone: Professional
   - Audience: Marketing professionals
   - Type: Blog Post
10. Submit → Wait for generation
11. Review generated content
12. Click "Edit Draft"
13. Make minor edits to content
14. Save changes
15. Navigate back to Content Manager
16. Find the draft in the list
17. Click "Publish"
18. See status change to "Published"
19. Click "View" to see on public blog
20. Success! ✅

**What to Observe:**
- [ ] Can tester find login without help?
- [ ] Is magic link email received promptly?
- [ ] Is dashboard overview clear and informative?
- [ ] Is navigation intuitive (tabs make sense)?
- [ ] Can tester find AI wizard without help?
- [ ] Is form clear about what each field does?
- [ ] Are loading states visible and reassuring?
- [ ] Is generated content preview helpful?
- [ ] Can tester navigate to editor smoothly?
- [ ] Is editor interface understandable?
- [ ] Can tester save without confusion?
- [ ] Can tester find and publish draft easily?
- [ ] Does "View" button work as expected?

**Potential Issues to Watch For:**
- ⚠️ Confusion about where to start
- ⚠️ Magic link delay or not received
- ⚠️ Form validation errors confusing
- ⚠️ Loading states too fast to notice (looks broken)
- ⚠️ Not clear that content was saved
- ⚠️ Can't find newly created draft
- ⚠️ Publish button not obvious
- ⚠️ Unclear if publish worked

---

### Scenario 2: Content Management Workflow (10-15 minutes)

**Objective:** Test listing, filtering, editing, and deleting content.

**Instructions to Tester:**
> "You have several blog posts in various states. Browse through them, edit one draft, publish it, and delete an old post you no longer need."

**Expected User Journey:**
1. Navigate to `/dashboard/content`
2. See table of all posts
3. Notice status badges (Draft, Published, Archived)
4. Scan through the list
5. Click "Edit" on a draft post
6. Land on editor
7. Make changes to title and content
8. Save changes
9. Return to content manager (back button or nav)
10. Find a different draft
11. Click "Publish"
12. Confirm status changes
13. Find a post to delete
14. Click "Delete"
15. Confirm deletion in dialog
16. See post removed from list
17. Success! ✅

**What to Observe:**
- [ ] Is table layout clear and scannable?
- [ ] Are status badges obvious and color-coded well?
- [ ] Can tester identify drafts vs published easily?
- [ ] Are action buttons clearly labeled?
- [ ] Is edit navigation smooth?
- [ ] Does "Save" provide feedback?
- [ ] Can tester navigate back easily?
- [ ] Is publish action clear and confirmable?
- [ ] Does delete require confirmation?
- [ ] Are updates reflected immediately?

**Potential Issues to Watch For:**
- ⚠️ Table overwhelming with too many columns
- ⚠️ Status badges not clear
- ⚠️ Action buttons too small or confusing
- ⚠️ No confirmation before destructive actions
- ⚠️ Changes not visible after save
- ⚠️ Can't figure out how to get back to list

---

### Scenario 3: Advanced Editing Workflow (10 minutes)

**Objective:** Test in-depth editing features and validation.

**Instructions to Tester:**
> "Open an existing post for editing. Try changing the title, slug, excerpt, and content. Try to save invalid data. Test the unsaved changes detection."

**Expected User Journey:**
1. Navigate to content manager
2. Click "Edit" on any post
3. Change title to something new
4. Change slug to match
5. Update excerpt
6. Modify content (add/remove sections)
7. Try to navigate away → Notice "unsaved changes" warning
8. Go back and save
9. Try to save with empty title → See validation error
10. Fix error and save successfully
11. Try invalid slug format → See validation error
12. Fix and save
13. Preview published post (if published)
14. Success! ✅

**What to Observe:**
- [ ] Are all fields clearly labeled?
- [ ] Is validation feedback immediate and helpful?
- [ ] Does unsaved changes warning work?
- [ ] Are error messages clear and actionable?
- [ ] Does preview work correctly?
- [ ] Is MDX content editor usable?

**Potential Issues to Watch For:**
- ⚠️ Validation too aggressive or too lenient
- ⚠️ Error messages cryptic
- ⚠️ Unsaved changes warning doesn't trigger
- ⚠️ Can't figure out MDX format
- ⚠️ Preview doesn't match editor content

---

### Scenario 4: Dual Content System Verification (5 minutes)

**Objective:** Verify that authenticated users see API content and public users see static content.

**Instructions to Tester:**
> "While logged in, view the blog. Then sign out and view the blog again. Notice any differences."

**Expected User Journey:**
1. While logged into dashboard, navigate to `/blog`
2. See blog posts (from API)
3. Notice browser console logs: `[Content Resolver] Fetching posts from API`
4. Sign out from dashboard
5. Navigate to `/blog` again
6. See blog posts (from static files)
7. Notice console logs: `[Content Resolver] Using static content`
8. Posts should look the same (content matches)
9. Success! ✅

**What to Observe:**
- [ ] Blog loads for authenticated users
- [ ] Blog loads for unauthenticated users
- [ ] Content appears the same (unified interface)
- [ ] Console logs show correct source
- [ ] No errors in console
- [ ] Performance is acceptable for both

**Potential Issues to Watch For:**
- ⚠️ Error when loading blog while authenticated
- ⚠️ Content differs between sources
- ⚠️ Missing posts in one source
- ⚠️ Console errors about authentication

---

### Scenario 5: Error Handling & Edge Cases (10 minutes)

**Objective:** Test how the system handles errors and edge cases.

**Instructions to Tester:**
> "Try to break things! Submit forms with invalid data, try to access posts that don't exist, test with slow network, etc."

**Test Cases:**

**A. Invalid Form Submissions**
1. AI Wizard with empty topic → Should show error
2. Editor with title < 5 chars → Should show error
3. Editor with invalid slug (spaces, caps) → Should show error
4. Editor with empty content → Should show error

**B. Network Issues** (if possible)
1. Disconnect from network mid-action
2. Should see error message
3. Should be able to retry

**C. Invalid URLs**
1. Navigate to `/dashboard/content/invalid-id/edit`
2. Should show error or redirect
3. Navigate to `/blog/non-existent-slug`
4. Should show 404

**D. Concurrent Actions**
1. Click publish multiple times rapidly
2. Should only publish once
3. Loading state should prevent duplicate clicks

**What to Observe:**
- [ ] All validation messages are clear
- [ ] Error states are handled gracefully
- [ ] User can recover from errors
- [ ] No unhandled exceptions in console
- [ ] Loading states prevent duplicate submissions

**Potential Issues to Watch For:**
- ⚠️ Cryptic error messages
- ⚠️ App crashes on invalid input
- ⚠️ No way to recover from error state
- ⚠️ Duplicate submissions possible
- ⚠️ Console full of errors

---

### Scenario 6: Mobile Responsiveness (5-10 minutes)

**Objective:** Test mobile experience and responsive design.

**Instructions to Tester:**
> "Resize your browser to mobile size (or use actual mobile device). Navigate through the dashboard and create/edit content."

**Expected User Journey:**
1. Resize browser to ~375px width (iPhone size)
2. Navigate to login → Should be usable on mobile
3. Login and access dashboard
4. Check navigation → Should collapse to mobile menu
5. View statistics → Should stack vertically
6. Open content manager → Table should be scrollable
7. Edit a post → Form fields should be full-width
8. Try AI wizard on mobile
9. Success! ✅

**What to Observe:**
- [ ] All pages are usable on mobile
- [ ] Navigation adapts to mobile (hamburger or similar)
- [ ] Tables scroll horizontally on mobile
- [ ] Forms are easy to fill on mobile
- [ ] Buttons are large enough to tap
- [ ] Text is readable (not too small)

**Potential Issues to Watch For:**
- ⚠️ Horizontal scroll on mobile
- ⚠️ Text too small to read
- ⚠️ Buttons too small to tap accurately
- ⚠️ Forms unusable (inputs too narrow)
- ⚠️ Navigation broken on mobile

---

## 📊 Testing Checklist

### Core Features

**Authentication:**
- [ ] Can request magic link
- [ ] Email received within 1 minute
- [ ] Magic link works (redirects to dashboard)
- [ ] Dashboard requires authentication
- [ ] Sign out works
- [ ] Redirected to login when accessing dashboard after sign out

**Dashboard Overview:**
- [ ] Statistics load and display correctly
- [ ] All stat cards show accurate numbers
- [ ] Quick action links work
- [ ] Navigation highlights current page
- [ ] User email displayed correctly
- [ ] Responsive on mobile

**Content Manager:**
- [ ] Posts list loads
- [ ] Status badges display correctly (draft, published, archived)
- [ ] Pagination works (if >20 posts)
- [ ] Publish button appears for drafts only
- [ ] View button appears for published only
- [ ] Edit button works for all posts
- [ ] Delete confirmation dialog appears
- [ ] Delete removes post from list
- [ ] Real-time updates after actions

**AI Content Wizard:**
- [ ] Form fields all work
- [ ] Validation messages clear
- [ ] Loading state during generation
- [ ] Generated content previews correctly
- [ ] "Edit Draft" navigates to editor
- [ ] "Generate Another" resets form
- [ ] Error handling if AI fails
- [ ] Draft saved even if AI partially fails

**Post Editor:**
- [ ] Loads existing post correctly
- [ ] Title field editable
- [ ] Slug field editable with validation
- [ ] Excerpt field editable
- [ ] Content field editable (large textarea)
- [ ] Form validation works
- [ ] Unsaved changes detection works
- [ ] Save button works
- [ ] Cancel navigates back
- [ ] Preview button works (published posts)
- [ ] Loading states during save

**Dual Content System:**
- [ ] Authenticated users see API content
- [ ] Unauthenticated users see static content
- [ ] Both render correctly
- [ ] Console logs show correct source
- [ ] Fallback works if API down

### Error Handling

- [ ] Invalid login shows error
- [ ] Network errors handled gracefully
- [ ] 404s show appropriate message
- [ ] Invalid IDs handled
- [ ] Form validation prevents bad data
- [ ] Delete confirmation prevents accidents
- [ ] All errors show user-friendly messages

### Performance

- [ ] Dashboard loads in < 1s
- [ ] Content table loads in < 1s
- [ ] Editor loads in < 500ms
- [ ] Form submissions feel instant (<2s)
- [ ] No noticeable lag during navigation
- [ ] Images/assets load quickly

### UI/UX

- [ ] Design is consistent throughout
- [ ] Navigation is intuitive
- [ ] Buttons are clearly labeled
- [ ] Loading states are visible
- [ ] Success feedback is clear
- [ ] Error messages are helpful
- [ ] No broken layouts
- [ ] Colors/contrast are accessible
- [ ] Icons enhance understanding

## 🐛 Bug Reporting Template

**For Each Issue Found:**

```markdown
### Bug: [Short Description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Navigate to...
2. Click on...
3. Enter...
4. Observe...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happened

**Screenshots/Console Errors:**
[Attach if available]

**Environment:**
- Browser: Chrome 120 / Firefox 115 / Safari 17
- Device: Desktop / Mobile (iPhone/Android)
- Screen size: 1920x1080 / 375x667
- User type: Authenticated / Unauthenticated
```

## 📝 Feedback Collection

### Quantitative Metrics

**For Each Scenario:**
- Time to complete: _____ minutes
- Number of errors encountered: _____
- Number of times help needed: _____
- Overall difficulty (1-5): _____
  - 1 = Very Easy
  - 2 = Easy
  - 3 = Moderate
  - 4 = Difficult
  - 5 = Very Difficult

### Qualitative Feedback

**Questions for Tester:**

1. **First Impressions**
   - What was your initial reaction to the dashboard?
   - Did the navigation make sense immediately?
   - Was anything confusing or unclear?

2. **Content Creation**
   - How intuitive was the AI wizard?
   - Were the form fields clear?
   - Did the generated content meet expectations?

3. **Content Management**
   - How easy was it to find and edit posts?
   - Were the action buttons clear (Publish, Edit, Delete)?
   - Did you feel confident making changes?

4. **Overall Experience**
   - What did you like most?
   - What frustrated you most?
   - What would you change?
   - Would you use this daily? Why or why not?

5. **Missing Features**
   - What features did you expect but didn't find?
   - What would make your workflow easier?

## 🎯 Success Criteria

**Test is Successful if:**

✅ **Functionality:** All core features work without critical bugs
✅ **Intuitiveness:** Tester completes Scenario 1 with <3 questions
✅ **Performance:** All pages load in <2 seconds
✅ **Error Handling:** No unhandled errors, all errors show helpful messages
✅ **Mobile:** All features usable on mobile (even if not perfect)
✅ **Satisfaction:** Tester would use this tool daily (rating 4+/5)

**Test Needs Improvement if:**

⚠️ Critical bugs that prevent core workflows
⚠️ More than 5 questions needed to complete basic tasks
⚠️ Multiple UI elements broken or confusing
⚠️ Slow performance (>5s load times)
⚠️ Poor mobile experience (unusable)

## 📅 Testing Schedule

### Quick Test (30 minutes)
- Scenario 1: First-Time User Experience
- Scenario 2: Content Management (abbreviated)
- Bug reporting

### Standard Test (1 hour)
- Scenario 1: First-Time User Experience
- Scenario 2: Content Management Workflow
- Scenario 3: Advanced Editing Workflow
- Scenario 5: Error Handling (abbreviated)
- Feedback collection

### Comprehensive Test (2 hours)
- All 6 scenarios
- Detailed bug reporting
- Comprehensive feedback collection
- Mobile testing
- Performance testing

## 🔄 Iteration Process

**After Testing:**

1. **Prioritize Issues**
   - Critical: Blocks core functionality → Fix immediately
   - High: Confusing UX, frequent errors → Fix before launch
   - Medium: Nice-to-have improvements → Consider for v1.1
   - Low: Minor polish → Backlog

2. **Fix Critical Issues**
   - Address blockers first
   - Re-test after fixes

3. **Iterate on UX Issues**
   - Improve confusing labels
   - Add missing feedback
   - Clarify error messages
   - Enhance loading states

4. **Re-test**
   - Have tester try again after fixes
   - Verify improvements
   - Repeat if needed

## 📋 Test Report Template

```markdown
# Content Cockpit - User Testing Report

**Date:** [Date]
**Tester:** [Name/Role]
**Duration:** [Time]
**Environment:** [Browser, Device]

## Executive Summary
[2-3 sentences on overall findings]

## Test Results

### Scenarios Completed
- [x] Scenario 1: First-Time User Experience - [Time] - [Difficulty 1-5]
- [x] Scenario 2: Content Management - [Time] - [Difficulty 1-5]
- [ ] Scenario 3: Advanced Editing - [Skipped/Incomplete]
...

### Bugs Found
| Severity | Issue | Status |
|----------|-------|--------|
| Critical | [Description] | Open |
| High | [Description] | Fixed |
| Medium | [Description] | Open |

### User Feedback
**Liked:**
- [Point 1]
- [Point 2]

**Disliked:**
- [Point 1]
- [Point 2]

**Suggestions:**
- [Point 1]
- [Point 2]

## Recommendations
1. [Action item]
2. [Action item]

## Conclusion
[Overall assessment and next steps]
```

---

## 🚀 Quick Start for Testers

**Simplified Instructions:**

1. **Setup** (One-time)
   - Ensure backend is running
   - Ensure frontend is running
   - Have email access ready

2. **Start Testing**
   - Open http://localhost:3000/login
   - Enter your email
   - Check email for magic link
   - Click link → You're in the dashboard!

3. **Explore Naturally**
   - Try to create a blog post
   - Try to edit a post
   - Try to publish a draft
   - Try to navigate around
   - Report anything confusing or broken

4. **Provide Feedback**
   - What worked well?
   - What was confusing?
   - What would you change?

That's it! Just use it naturally and tell us what you think.

---

**Document Version:** 1.0
**Last Updated:** 2025-10-02
**Status:** Ready for Testing

# Analytics System: Testing & Verification Guide

**Purpose**: Verify the privacy-conscious analytics system is working correctly

**Time required**: 20 minutes

---

## 📋 Pre-Test Checklist

Before running tests, ensure:

- [ ] Cloudflare D1 database created
- [ ] Database ID added to wrangler.toml
- [ ] Worker deployed: `wrangler deploy`
- [ ] Frontend environment variable set (or using Cloudflare Pages)
- [ ] Frontend built and deployed
- [ ] Browser console open (DevTools)

---

## ✅ Test Suite 1: Basic Functionality

### Test 1.1: Initial Load

**Steps**:
1. Open your deployed site in a fresh browser tab
2. Look at the homepage

**Expected results**:
- ✅ VisitorStats card is visible (below hero section)
- ✅ Shows skeleton/loading state initially
- ✅ After 1-2 seconds, displays a number
- ✅ No errors in browser console

**If it fails**:
- Check `/api/stats` endpoint exists
- Verify Worker is deployed
- Check VITE_ANALYTICS_URL environment variable

---

### Test 1.2: Network Request

**Steps**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload the page
4. Look for `/api/visit` or `visit` request

**Expected results**:
- ✅ POST request to `/api/visit`
- ✅ Status 200
- ✅ Response: `{ success: true, message: "Visit recorded" }`
- ✅ Request payload contains:
  - `session_id`: "session_" string
  - `page`: "/", "/projects", etc.
  - `referrer`: null, "google.com", etc.

**If request doesn't appear**:
- Check recordVisit() is imported in App.tsx
- Check useEffect hook is executed
- Check console for errors

---

### Test 1.3: Visit Counter Increases

**Steps**:
1. Note the current visitor count
2. Hard-refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Wait for stats to load
4. Check the number

**Expected results**:
- ✅ Number increased by exactly 1
- ✅ New POST request appears in Network tab
- ✅ No 502 or 500 errors

**Why not increase more?**:
- sessionStorage prevents duplicate visits in same session
- This is intentional (prevents false counts from reloads)

---

### Test 1.4: Multiple Sessions

**Steps**:
1. Open the site in Firefox (if you were using Chrome)
2. Or open in Incognito/Private mode
3. Note the visitor count
4. Compare to previous count

**Expected results**:
- ✅ New browser/tab is treated as new session
- ✅ Visitor count increases by 1
- ✅ sessionStorage is separate for each session

---

### Test 1.5: Visitor Count Format

**Steps**:
1. Look at the displayed visitor count
2. Verify formatting

**Expected results**:
- ✅ Large numbers are formatted with commas (12,481)
- ✅ Font is large and readable
- ✅ Label says "VISITORS"
- ✅ Subtitle shows weekly change

---

## ✅ Test Suite 2: Resilience (Error Handling)

### Test 2.1: Backend Offline

**Steps**:
1. Stop the Cloudflare Worker:
   ```bash
   wrangler delete
   # or just stop it in dashboard
   ```
2. Reload the site
3. Verify behavior

**Expected results**:
- ✅ VisitorStats card is hidden
- ✅ Site works normally
- ✅ No error messages to user
- ✅ Console shows debug message (not visible to user)

**Important**: This proves analytics never blocks the site.

---

### Test 2.2: Slow Network

**Steps**:
1. Open DevTools
2. Go to Network tab
3. Select "Slow 3G" throttling
4. Reload page
5. Watch VisitorStats

**Expected results**:
- ✅ Loading skeleton appears
- ✅ Site doesn't freeze
- ✅ Page content loads first
- ✅ Stats load after 2-3 seconds

---

### Test 2.3: Network Error

**Steps**:
1. Go to DevTools → Network
2. Check "Offline" mode
3. Reload page
4. Uncheck "Offline"

**Expected results**:
- ✅ Site loads from cache/service worker
- ✅ VisitorStats shows nothing
- ✅ No console errors
- ✅ Site remains fully functional

---

## ✅ Test Suite 3: Data & Privacy

### Test 3.1: sessionStorage Behavior

**Steps**:
1. Open DevTools → Application tab
2. Expand "Session Storage"
3. Find your site
4. Look for key: "analytics_session_id"

**Expected results**:
- ✅ Value starts with "session_"
- ✅ Contains timestamp and random string
- ✅ Looks like: "session_1725196800000_abc123"
- ✅ Different each time you create new session

---

### Test 3.2: Visit Deduplication

**Steps**:
1. Note visitor count
2. Reload page 3 times quickly
3. Check count

**Expected results**:
- ✅ Count increased by 1 (not 3)
- ✅ sessionStorage key "analytics_visit_recorded" = "true"
- ✅ Only first load records visit
- ✅ Reloads are ignored

**Why?**:
- React Strict Mode renders twice
- Route changes shouldn't re-record
- Only first meaningful visit counts

---

### Test 3.3: No Personal Data Leaks

**Steps**:
1. Open DevTools
2. Go to Network tab
3. Look at POST request to `/api/visit`
4. Click on request and expand payload

**Expected results**:
- ✅ No IP address (could be in User-Agent, but not stored in our DB)
- ✅ No location data
- ✅ No browser fingerprint
- ✅ Only: session_id, page, referrer
- ✅ Referrer is domain only ("google.com", not full search query)

---

### Test 3.4: Clearing Storage

**Steps**:
1. Open DevTools → Storage
2. Clear all storage for your site
3. Reload page
4. Check sessionStorage

**Expected results**:
- ✅ New session ID generated
- ✅ Visit is recorded again
- ✅ Count increases by 1

---

## ✅ Test Suite 4: API Validation

### Test 4.1: Invalid Session ID

**Using curl**:
```bash
curl -X POST https://your-worker.workers.dev/api/visit \
  -H "Content-Type: application/json" \
  -d '{"session_id": "", "page": "/", "referrer": null}'
```

**Expected**:
- ✅ Status: 400
- ✅ Response: `{ success: false, message: "Invalid session ID" }`

---

### Test 4.2: Missing Required Field

**Using curl**:
```bash
curl -X POST https://your-worker.workers.dev/api/visit \
  -H "Content-Type: application/json" \
  -d '{"session_id": "valid_id"}'
```

**Expected**:
- ✅ Status: 400
- ✅ Response: `{ success: false, message: "Missing required fields" }`

---

### Test 4.3: Oversized Page Value

**Using curl**:
```bash
curl -X POST https://your-worker.workers.dev/api/visit \
  -H "Content-Type: application/json" \
  -d '{"session_id": "valid_id", "page": "'$(python3 -c 'print("x" * 300)')'"}'
```

**Expected**:
- ✅ Status: 400
- ✅ Response: `{ success: false, message: "Invalid page" }`

---

### Test 4.4: Stats Endpoint

**Using curl**:
```bash
curl https://your-worker.workers.dev/api/stats
```

**Expected**:
- ✅ Status: 200
- ✅ Response includes:
  - `total_visits`: number
  - `unique_sessions`: number
  - `visits_today`: number
  - `visits_this_week`: number
  - `visits_this_month`: number
  - `page_views`: object

---

## ✅ Test Suite 5: Rate Limiting

### Test 5.1: Rate Limit Threshold

**Steps**:
1. Write a test script that sends 101 requests in quick succession
2. Use same session_id for all

**Script** (JavaScript):
```javascript
const sessionId = 'test_' + Date.now();
for (let i = 0; i < 101; i++) {
  fetch('/api/visit', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      page: '/',
      referrer: null
    })
  });
}
```

**Expected**:
- ✅ Requests 1-100: Status 200
- ✅ Request 101+: Status 400, `message: "Rate limit exceeded"`

---

### Test 5.2: Rate Limit Reset

**Steps**:
1. Trigger rate limit (101 requests)
2. Wait 61 seconds
3. Send another request with same session_id

**Expected**:
- ✅ Request succeeds (Status 200)
- ✅ Rate limit counter reset after 60 seconds

---

## ✅ Test Suite 6: Performance

### Test 6.1: Page Load Impact

**Measure**:
1. Run Lighthouse audit with analytics
2. Note load time
3. Disable analytics in code
4. Run Lighthouse again
5. Compare

**Expected**:
- ✅ Analytics overhead: < 50ms
- ✅ No impact on Core Web Vitals
- ✅ Performance score unaffected

---

### Test 6.2: Stats Caching

**Steps**:
1. Fetch `/api/stats`
2. Wait 2 seconds
3. Fetch again
4. Check Network tab

**Expected**:
- ✅ First request: 100+ ms
- ✅ Second request: 10-30 ms (cached)
- ✅ Cache expires after 60 seconds

---

## ✅ Test Suite 7: Cross-Browser Compatibility

### Test 7.1: Chrome/Edge

**Steps**:
1. Open site in Chrome
2. Verify VisitorStats loads
3. Check Network tab for /api/visit
4. Verify count increases

**Expected**: ✅ All pass

---

### Test 7.2: Firefox

**Steps**:
1. Open site in Firefox
2. Same checks as Chrome

**Expected**: ✅ All pass

---

### Test 7.3: Safari

**Steps**:
1. Open site in Safari
2. Same checks

**Expected**: ✅ All pass (may need to enable Third-party cookies)

---

### Test 7.4: Mobile Safari (iPhone)

**Steps**:
1. Open site on iPhone
2. Check VisitorStats displays
3. Check count increases

**Expected**: ✅ All pass

---

## ✅ Test Suite 8: Database Verification

### Test 8.1: Check D1 Contains Data

**Command**:
```bash
wrangler d1 execute analytics --command="SELECT COUNT(*) as total FROM visits"
```

**Expected**:
- ✅ Returns: `{ total: number }`
- ✅ Number matches approximate visit count

---

### Test 8.2: Verify No Sensitive Data

**Command**:
```bash
wrangler d1 execute analytics --command="SELECT * FROM visits LIMIT 1"
```

**Expected output (example)**:
```json
{
  "id": 1,
  "session_id": "session_1725196800000_abc123",
  "page": "/",
  "referrer": null,
  "timestamp": 1725196845,
  "created_at": "2026-09-01T15:30:45.000Z"
}
```

**Verify**:
- ✅ No IP address
- ✅ No personal info
- ✅ No cookies
- ✅ No location data

---

### Test 8.3: Check Indexes Exist

**Command**:
```bash
wrangler d1 execute analytics --command="PRAGMA index_info(idx_session_id)"
```

**Expected**:
- ✅ Returns index info (proves it exists)

---

## 🎯 Test Summary Report

After completing all tests, fill out this checklist:

### Functionality
- [ ] Initial load displays stats
- [ ] Network request sent correctly
- [ ] Visit counter increases
- [ ] Multiple sessions tracked
- [ ] Formatting is correct

### Resilience
- [ ] Site works if backend unavailable
- [ ] Graceful degradation on slow network
- [ ] Offline mode handled correctly
- [ ] No error messages to users
- [ ] Console shows debug info only

### Privacy
- [ ] Session ID is anonymous
- [ ] No IP addresses stored
- [ ] Visit deduplication working
- [ ] No personal data in network requests
- [ ] Storage clearing works

### API Validation
- [ ] Invalid requests rejected
- [ ] Missing fields caught
- [ ] Oversized values rejected
- [ ] Stats endpoint responsive

### Rate Limiting
- [ ] Limit enforced at 100 requests/min
- [ ] Error returned when exceeded
- [ ] Limit resets after 60 seconds

### Performance
- [ ] < 50ms overhead
- [ ] Stats cached for 60 seconds
- [ ] No Core Web Vitals impact

### Cross-Browser
- [ ] Chrome: ✅
- [ ] Firefox: ✅
- [ ] Safari: ✅
- [ ] Mobile: ✅

### Database
- [ ] Contains visit records
- [ ] No sensitive data stored
- [ ] Indexes configured correctly

---

## ✅ All Tests Passed?

If yes, your analytics system is ready for production!

If no, check the troubleshooting guide in `docs/analytics.md`.

---

**Test Date**: ___________
**Tester**: ___________
**Result**: ✅ PASS / ❌ FAIL

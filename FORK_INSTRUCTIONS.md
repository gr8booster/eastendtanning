# How to Fork This Project to "Eastend Tanning Laundry"

## Step-by-Step Instructions for You (The User)

### Step 1: Create New Task on Emergent Platform
1. Go to Emergent platform
2. Click "New Task" or "Create New Project"
3. **Use this exact prompt:**
   ```
   I need to set up Eastend Tanning Laundry project
   ```
4. **Project name will be:** `eastend-tanning-laundry`
5. **Preview URL will be:** `eastend-tanning-laundry.preview.emergentagent.com`

---

### Step 2: Save Current Code (Optional but Recommended)
Before creating the new task, you can:
- Use Emergent's "Save to GitHub" feature if available
- OR download/copy the code manually
- OR share the current project ID with the new agent

**Current Project Files Ready:**
- ✅ All code is in `/app/` directory
- ✅ `PROJECT_SETUP_GUIDE.md` - Complete setup instructions
- ✅ `FORK_INSTRUCTIONS.md` - This file
- ✅ `plan.md` - Full project documentation

---

### Step 3: In New Task, Provide These Instructions

**Copy and paste this to the new agent:**

```
Hi! I'm setting up Eastend Tanning Laundry. Please follow these steps:

1. Read /app/PROJECT_SETUP_GUIDE.md for complete setup instructions
2. Verify all services are running: supervisorctl status
3. Configure environment variables:
   - Backend: /app/backend/.env (PayPal credentials, JWT secret)
   - Frontend: /app/frontend/.env (already configured)
4. Seed database with Fizze drinks: python3 /app/backend/seed_fizze.py
5. Test Fizze drinks menu: curl http://localhost:8001/api/fizze/menu
6. Take screenshots to verify:
   - Homepage with 5 service cards
   - Fizze drinks page with 52 drinks
   - Food truck page with logo
   - Admin recipes tab
7. Confirm zero errors in logs

Project Details:
- Name: Eastend Tanning Laundry
- Package: eastend-tanning-laundry
- Database: eastend_db
- Features: 52 Fizze drinks, 24 tanning packages, 8 lotions, food truck bookings, AI chat
- Tech: FastAPI + React + MongoDB
```

---

### Step 4: Provide Configuration Details

**PayPal Credentials** (for the new agent):
```
PAYPAL_CLIENT_ID="AfDT4xEbDBYJbkqevhCTf0-hgchxACo55xgXMjgoMyElbFG0SaE52w1B066P_Jbn0YGNY6RSlUY31qob"
PAYPAL_CLIENT_SECRET="[PROVIDE YOUR SECRET KEY]"
```

**Admin Login:**
```
Email: admin@eastend.com
Password: eastend2025
```

---

### Step 5: Verify New Project

Once the new agent sets up the project, verify:

1. **Preview URL:** `https://eastend-tanning-laundry.preview.emergentagent.com`
2. **Homepage:** 5 service cards (last one is Food Truck Stop)
3. **Fizze Drinks:** Menu shows 52 drinks in 8 categories
4. **Tanning:** 6 bed levels with packages
5. **Food Truck:** Custom logo, booking form, date checker
6. **Admin:** Login works, Recipes tab shows 52 drinks
7. **Mary Chat:** AI responds with consultation
8. **PayPal:** Buttons render on receipt pages

---

## What Will Transfer Automatically

✅ **All code files** (if using GitHub or copy/paste)
✅ **All features and functionality**
✅ **Project configuration**
✅ **Frontend components**
✅ **Backend API routes**
✅ **Seed scripts**

## What Needs Manual Setup

❌ **Database data** (run seed_fizze.py)
❌ **Environment variables** (.env files)
❌ **PayPal credentials** (provide to new agent)
❌ **Admin password** (already in code but needs verification)

---

## Quick Reference

**Current Project:**
- URL: https://tanshop-unified.preview.emergentagent.com
- Database: eastend_db (fully populated)
- Status: 100% working

**New Project:**
- Name: Eastend Tanning Laundry
- URL: https://eastend-tanning-laundry.preview.emergentagent.com
- Database: eastend_db (needs seeding)
- Setup Time: ~10-15 minutes

---

## Important Notes

1. **Database is separate** - New project = new MongoDB instance
2. **Run seed script** - `python3 seed_fizze.py` to get 52 drinks
3. **Test everything** - Especially PayPal buttons and admin recipes
4. **Save credentials** - PayPal keys, admin password
5. **Documentation exists** - See PROJECT_SETUP_GUIDE.md for details

---

## Alternative: Keep Current Project

If the preview URL name doesn't matter, you can:
- Keep using current project (everything works perfectly)
- Only the URL says "tanshop-unified"
- All code says "Eastend Tanning Laundry"
- Production can use custom domain (eastendtanning.com)

**This is faster and has zero downtime!**

---

## Need Help?

**Documentation:**
- `/app/PROJECT_SETUP_GUIDE.md` - Complete setup guide
- `/app/plan.md` - Full project documentation (20 pages)

**Support:**
- Emergent Discord: https://discord.gg/VzKfwCXC4A
- Support Email: support@emergent.sh

---

**Ready to create your new project!** 🚀

# Vercel Environment Variable Setup

## ⚠️ IMPORTANT: Fix CORS Error

Your frontend is still using the old backend URL because the Vercel environment variable hasn't been updated.

## Quick Fix Steps:

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on: `loan-management-system-beryl` (or your project name)

### 3. Navigate to Settings
- Click on **Settings** tab
- Click on **Environment Variables** in the left sidebar

### 4. Update Environment Variable
- Find `NEXT_PUBLIC_API_URL` in the list
- Click **Edit** or **Delete and Recreate**
- Set the value to:
  ```
  https://loan-management-system-pxkz.onrender.com/api
  ```
- Make sure it's enabled for **Production**, **Preview**, and **Development**
- Click **Save**

### 5. Redeploy
- Go to **Deployments** tab
- Click the **three dots** (⋯) on the latest deployment
- Click **Redeploy**
- Or push a new commit to trigger auto-deployment

### 6. Verify
After redeployment completes:
- Visit: https://loan-management-system-beryl.vercel.app
- Open browser console (F12)
- Try logging in
- The error should be gone!

## Current Backend URL:
```
https://loan-management-system-pxkz.onrender.com/api
```

## Why This Happens:
- Vercel environment variables **override** code defaults
- Even though the code has the correct URL, Vercel uses the old environment variable
- You must update it in the Vercel dashboard

## Alternative: Delete and Recreate
If editing doesn't work:
1. Delete the old `NEXT_PUBLIC_API_URL` variable
2. Create a new one with the same name
3. Set value to: `https://loan-management-system-pxkz.onrender.com/api`
4. Redeploy


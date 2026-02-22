# Database Setup Instructions

The Kanban board now uses **Vercel KV** (Redis-based cloud database) for persistent storage.

## Setup Steps:

### 1. Create KV Database in Vercel

1. Go to https://vercel.com/pacino-bots-projects/kanban
2. Click **Storage** tab
3. Click **Create Database**
4. Select **KV** (Redis)
5. Name it: `kanban-db`
6. Click **Create**

### 2. Connect to Project

1. After creating, click **Connect to Project**
2. Select the `kanban` project
3. Click **Connect**
4. Vercel will automatically add environment variables:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 3. Redeploy

1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Done!

Your tasks will now persist in the cloud database. All devices will share the same data.

## If KV Setup Fails:

The app will fall back to LocalStorage (browser-only storage) if KV isn't configured.

---

**Alternative: Use Upstash Redis Directly**

Since Vercel KV is deprecated, you can also:
1. Go to https://upstash.com
2. Create a Redis database
3. Add the connection strings to Vercel environment variables
4. Redeploy

The @vercel/kv package will automatically work with Upstash Redis.

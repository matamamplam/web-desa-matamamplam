# Deployment Guide

Since the project is now successfully building locally, follow these instructions to deploy to Vercel.

## 1. Push Changes to GitHub
Make sure your latest changes (including build fixes) are pushed to your repository.
```bash
git push origin main
```

## 2. Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** > **Project**.
3. Import your `web-desa-mata-mamplam` repository.

## 3. Configure Environment Variables
In the Vercel project settings, add the following Environment Variables (copy from your local `.env`):
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_BASE_URL` (set to your Vercel domain, e.g., `https://web-desa-mata-mamplam.vercel.app`)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (same as `NEXT_PUBLIC_BASE_URL`)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_USER` (if using email)
- `SMTP_PASS` (if using email)

## 4. Deploy
Click **Deploy**. Vercel will build your project. Since we fixed the build errors, it should succeed!

## 5. Post-Deployment Checks
- Visit your deployed URL.
- Log in as Super Admin (`admin@desa.id`) to verify authentication.
- Check the "Geografis" and "Visi Misi" pages to ensure data is loading correctly.

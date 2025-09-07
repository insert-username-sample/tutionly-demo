# CloudFlare Pages Deployment Guide for Tuitionly Modern

This guide provides step-by-step instructions to deploy your Tuitionly Modern application to CloudFlare Pages.

## Prerequisites

1. **CloudFlare Account**: Sign up at [cloudflare.com](https://cloudflare.com) if you don't have an account.
2. **Git Repository**: Your project should be in a git repository.
3. **Node.js**: Version 18 or later is required.
4. **CloudFlare CLI**: The Wrangler CLI is already installed and configured.

## Configuration Files Created

The following files have been configured for CloudFlare deployment:

### 1. `wrangler.toml`
- Main configuration file for CloudFlare Pages
- Sets up build configuration and routes
- Configures environment variables

### 2. `next.config.ts`
- Optimized for static export
- Configured for CloudFlare Pages compatibility
- Security headers added

### 3. `package.json`
- Added CloudFlare deployment scripts
- Development and production deployment commands

## Deployment Steps

### Step 1: Authenticate with CloudFlare
```bash
npm run cf-login
```
This opens your browser to authenticate with CloudFlare. Follow the prompts to log in.

### Step 2: Build the Application
```bash
npm run build
```
This builds your Next.js application for static export.

### Step 3: Deploy to CloudFlare Pages
```bash
npm run cf-production
```

Or deploy directly with:
```bash
npm run cf-deploy
```

### Step 4: Set up Custom Domain (Optional)
1. Go to your CloudFlare Dashboard
2. Navigate to Pages → your project → Custom domains
3. Add your domain (e.g., tuitionly.app)
4. Update DNS records as instructed

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run cf-login` | Authenticate with CloudFlare |
| `npm run build` | Build the application |
| `npm run cf-deploy` | Deploy to CloudFlare Pages |
| `npm run cf-production` | Build and deploy to production |
| `npm run cf-dev` | Preview locally with CloudFlare Pages dev server |

## Environment Variables

You can add environment variables in the CloudFlare Pages dashboard or in your `wrangler.toml`:

### Option 1: CloudFlare Dashboard
1. Go to Pages → your project → Settings → Environment variables
2. Add your variables (e.g., API keys, database URLs)

### Option 2: wrangler.toml
```toml
[vars]
API_URL = "your-api-url"
DATABASE_URL = "your-database-url"
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Ensure Node.js version 18+ is being used
   - Check that all dependencies are installed: `npm install`

2. **Deployment Issues**:
   - Verify you're authenticated: `npm run cf-login`
   - Check project name in `wrangler.toml`

3. **Custom Domain Issues**:
   - Ensure DNS records are properly configured
   - Allow up to 48 hours for DNS propagation

### Debugging Build
- Check build logs in CloudFlare Pages dashboard
- Verify all imports are correct
- Ensure no server-side rendering is required

## Performance Optimization

Your application is configured for:
- ✅ Static export for fast loading
- ✅ Optimized images
- ✅ Security headers
- ✅ CDN distribution worldwide

## Monitoring

Monitor your application performance in the CloudFlare Dashboard:
- Page views and performance metrics
- Error rates and response times
- Bandwidth usage

## Cost Considerations

CloudFlare Pages is free for:
- 500 builds per month
- 100GB bandwidth per month
- Unlimited static requests

## Next Steps

1. Set up analytics (Google Analytics, CloudFlare Web Analytics)
2. Configure error monitoring (Sentry, CloudFlare Error Tracking)
3. Set up automated deployments with GitHub Actions if desired
4. Enable CloudFlare's security features (WAF, Rate Limiting)

---

**Last updated**: September 8, 2025
**Project**: Tuitionly Modern
**Deployment Target**: CloudFlare Pages

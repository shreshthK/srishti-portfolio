# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio website for Srishti Rawat, built with React, TypeScript, and Tailwind CSS. Features dark/light theme, scroll-spy navigation, and Framer Motion animations. Deployed to AWS EC2 via Docker.

## Commands

```bash
npm run dev       # Start dev server at localhost:5173
npm run build     # Production build (runs tsc -b && vite build)
npm run lint      # Run ESLint
npm run preview   # Preview production build locally

# Type checking only (no emit)
npx tsc --noEmit

# Docker
docker-compose up -d     # Run locally on port 80
docker build -t srishti-portfolio .
```

## Architecture

### Component Structure
- `src/App.tsx` - Main app, renders all sections in order
- `src/components/sections/` - Page sections: Hero, About, Skills, Experience, Contact
- `src/components/ui/` - Reusable UI: Button, Card, SectionWrapper, ThemeToggle
- `src/components/layout/` - Navbar (with scroll-spy), Footer
- `src/components/animations/ScrollReveal.tsx` - Animation wrapper using Framer Motion

### State & Data
- `src/context/ThemeContext.tsx` - Dark/light theme provider (wraps entire app)
- `src/data/portfolio-data.ts` - All portfolio content (TypeScript object, not JSON)
- `src/hooks/useScrollSpy.ts` - Tracks active section for navigation highlighting

### Path Aliases
```typescript
@/*       → src/*
@public/* → public/*
```

### Key Patterns
- TypeScript strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- Tailwind CSS 4 for styling (no separate config file needed with Vite plugin)
- All sections wrapped in `SectionWrapper` for consistent spacing and IDs
- `ScrollReveal` component for fade-in animations on scroll

## Deployment

### CI Pipeline (GitHub Actions)
Triggered on push/PR to main (excludes docs/infrastructure changes):
1. Lint + TypeScript check
2. Build application
3. Test Docker build (includes health check at `/health`)

### CD Pipeline
Triggered on push to main (app code changes) or manual dispatch:
1. Build and push Docker image to AWS ECR
2. Deploy to EC2 via AWS SSM (no SSH keys needed)
3. Health check verification

### Infrastructure
- `infrastructure/terraform/` - AWS resources (VPC, EC2, ECR, IAM, CloudWatch)
- `infrastructure/ansible/` - EC2 configuration (Docker, Nginx, CloudWatch agent)
- See `docs/DEPLOYMENT.md` for full deployment guide

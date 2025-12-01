# Ekadi Frontend - Complete Folder Structure

```
ekadi_frontend/
│
├── 📁 .next/                          # Next.js build output (generated)
├── 📁 .git/                           # Git repository data
├── 📁 node_modules/                   # Dependencies (generated)
│
├── 📁 public/                         # Static assets
│   ├── 📄 file.svg
│   ├── 📄 globe.svg
│   ├── 📁 images/
│   ├── 📄 next.svg
│   ├── 📄 vercel.svg
│   └── 📄 window.svg
│
├── 📁 src/                            # Source code
│   │
│   ├── 📁 app/                        # Next.js App Router
│   │   │
│   │   ├── 📁 (public)/              # Public route group (no auth required)
│   │   │   ├── 📁 forgot-password/
│   │   │   │   └── 📄 page.tsx       # Password reset request page
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.tsx       # User login page
│   │   │   ├── 📁 register/
│   │   │   │   └── 📄 page.tsx       # User registration page
│   │   │   ├── 📁 reset-password/
│   │   │   │   └── 📄 page.tsx       # Password reset confirmation page
│   │   │   ├── 📁 verify-email/
│   │   │   │   └── 📄 page.tsx       # Email verification confirmation
│   │   │   └── 📁 verify-email-sent/
│   │   │       └── 📄 page.tsx       # Email verification sent confirmation
│   │   │
│   │   ├── 📁 (protected)/           # Protected route group (auth required)
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── 📄 page.tsx       # Main dashboard page
│   │   │   ├── 📁 profile/
│   │   │   │   ├── 📄 page.tsx       # User profile view page
│   │   │   │   └── 📁 edit/
│   │   │   │       └── 📄 page.tsx   # Edit profile page
│   │   │   └── 📁 settings/
│   │   │       └── 📄 page.tsx       # Account settings page
│   │   │
│   │   ├── 📄 favicon.ico            # Site favicon
│   │   ├── 📄 globals.css             # Global styles & theme overrides
│   │   ├── 📄 layout.tsx              # Root layout component
│   │   ├── 📄 page.tsx                # Landing/home page
│   │   └── 📄 providers.tsx           # App providers (Chakra, Auth, etc.)
│   │
│   ├── 📁 components/                 # Reusable React components
│   │   │
│   │   ├── 📁 auth/                   # Authentication components
│   │   │   └── 📄 ProtectedRoute.tsx  # Route protection wrapper
│   │   │
│   │   ├── 📁 common/                 # Common/shared components
│   │   │   ├── 📄 LoadingSpinner.tsx  # Loading spinner component
│   │   │   ├── 📄 Toast.tsx           # Toast notification component
│   │   │   └── 📄 ToastContainer.tsx  # Toast container & manager
│   │   │
│   │   └── 📁 layout/                 # Layout components
│   │       ├── 📄 AuthNav.tsx         # Authenticated navigation bar
│   │       ├── 📄 Footer.tsx          # Site footer
│   │       └── 📄 PublicNav.tsx       # Public navigation bar
│   │
│   ├── 📁 contexts/                   # React Context providers
│   │   └── 📄 AuthContext.tsx         # Authentication context & provider
│   │
│   ├── 📁 hooks/                      # Custom React hooks
│   │   ├── 📄 useAuth.ts              # Auth hook (re-export from context)
│   │   └── 📄 useToast.ts             # Toast notification hook
│   │
│   ├── 📁 lib/                        # Utility libraries & helpers
│   │   ├── 📄 api.ts                  # API client & request utilities
│   │   ├── 📄 auth.ts                 # Authentication API functions
│   │   ├── 📄 constants.ts            # App constants (routes, theme, etc.)
│   │   └── 📄 theme.ts                # Chakra UI theme configuration
│   │
│   └── 📁 types/                      # TypeScript type definitions
│       └── 📄 index.ts                 # All type definitions
│
├── 📄 .gitignore                      # Git ignore rules
├── 📄 eslint.config.mjs               # ESLint configuration
├── 📄 next-env.d.ts                   # Next.js TypeScript definitions
├── 📄 next.config.ts                  # Next.js configuration
├── 📄 package.json                    # Dependencies & scripts
├── 📄 package-lock.json               # Dependency lock file
├── 📄 postcss.config.mjs              # PostCSS configuration
├── 📄 README.md                       # Project documentation
├── 📄 tsconfig.json                   # TypeScript configuration
└── 📄 tsconfig.tsbuildinfo            # TypeScript build cache

```

## 📊 Structure Summary

### Route Groups
- **`(public)/`** - Public routes accessible without authentication
  - Login, Register, Password Reset, Email Verification
  
- **`(protected)/`** - Protected routes requiring authentication
  - Dashboard, Profile, Settings

### Component Organization
- **`components/auth/`** - Authentication-related components
- **`components/common/`** - Shared/reusable components
- **`components/layout/`** - Layout components (Nav, Footer)

### Core Directories
- **`contexts/`** - React Context providers
- **`hooks/`** - Custom React hooks
- **`lib/`** - Utility functions and configurations
- **`types/`** - TypeScript type definitions

### Configuration Files
- **`next.config.ts`** - Next.js configuration
- **`tsconfig.json`** - TypeScript configuration
- **`eslint.config.mjs`** - Linting rules
- **`postcss.config.mjs`** - CSS processing

---

**Total Files (excluding node_modules, .next, .git):**
- **TypeScript/React Files:** ~25
- **Configuration Files:** 6
- **Static Assets:** 6+ SVG files

**Key Features:**
✅ Next.js 14+ App Router
✅ TypeScript
✅ Chakra UI v3
✅ Authentication system
✅ Protected routes
✅ Toast notifications
✅ Theme system
✅ Responsive design


#!/bin/bash

echo "==================================="
echo "Frontend Verification - Ekadi Platform"
echo "==================================="

# Check all files exist
echo "\n✓ Checking file structure..."

files=(
  ".env.local"
  "src/types/index.ts"
  "src/lib/constants.ts"
  "src/lib/api.ts"
  "src/lib/auth.ts"
  "src/contexts/AuthContext.tsx"
  "src/app/providers.tsx"
  "src/app/layout.tsx"
  "src/components/layout/PublicNav.tsx"
  "src/components/layout/AuthNav.tsx"
  "src/components/layout/Footer.tsx"
  "src/components/common/LoadingSpinner.tsx"
  "src/hooks/useToast.ts"
  "src/components/auth/ProtectedRoute.tsx"
  "src/app/page.tsx"
  "src/app/(public)/register/page.tsx"
  "src/app/(public)/login/page.tsx"
  "src/app/(public)/verify-email-sent/page.tsx"
  "src/app/(public)/verify-email/page.tsx"
  "src/app/(public)/forgot-password/page.tsx"
  "src/app/(public)/reset-password/page.tsx"
  "src/app/(public)/unauthorized/page.tsx"
  "src/app/(protected)/dashboard/page.tsx"
  "src/app/(protected)/profile/page.tsx"
  "src/app/(protected)/profile/edit/page.tsx"
  "src/app/(protected)/settings/page.tsx"
  "src/app/not-found.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ MISSING: $file"
  fi
done

# Check dependencies
echo "\n✓ Checking dependencies..."
npm list @chakra-ui/react axios react-hook-form zod 2>&1 | grep -q "UNMET" && echo "❌ Some dependencies missing" || echo "✅ All dependencies installed"

# Try building
echo "\n✓ Attempting build..."
npm run build && echo "✅ Build successful" || echo "❌ Build failed"

echo "\n==================================="
echo "Verification Complete!"
echo "==================================="
echo "\nNext steps:"
echo "1. Start backend: cd ../ekadi_backend && python manage.py runserver"
echo "2. Start frontend: npm run dev"
echo "3. Visit: http://localhost:3000"
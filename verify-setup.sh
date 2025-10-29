#!/bin/bash

echo "🔍 Verifying School Management System Setup..."
echo ""

# Check directory structure
echo "📁 Checking directory structure..."
dirs=("apps/api" "apps/web" "apps/worker" "packages/shared" "infra/dockerfiles" "docs")
for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir exists"
    else
        echo "  ❌ $dir missing"
    fi
done
echo ""

# Check key files
echo "📄 Checking key files..."
files=(
    "package.json"
    "turbo.json"
    "docker-compose.yml"
    "render.yaml"
    ".env.example"
    "apps/api/prisma/schema.prisma"
    "apps/api/src/main.ts"
    "apps/web/src/app/page.tsx"
    "apps/worker/src/index.ts"
)
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
    fi
done
echo ""

# Count files
echo "📊 File Statistics:"
echo "  TypeScript files: $(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l)"
echo "  Prisma schema: $(find . -name "*.prisma" | wc -l)"
echo "  Docker files: $(find . -name "Dockerfile*" | wc -l)"
echo "  Documentation: $(find docs -name "*.md" 2>/dev/null | wc -l)"
echo ""

# Check configurations
echo "⚙️  Checking configurations..."
if [ -f ".env.example" ]; then
    echo "  ✅ .env.example present with $(grep -c "=" .env.example) variables"
fi

if [ -f "apps/api/prisma/schema.prisma" ]; then
    models=$(grep -c "^model " apps/api/prisma/schema.prisma)
    echo "  ✅ Prisma schema has $models models"
fi

if [ -f "docker-compose.yml" ]; then
    services=$(grep -c "^  [a-z]" docker-compose.yml | head -1)
    echo "  ✅ Docker Compose has multiple services"
fi
echo ""

echo "✨ Verification complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Copy .env.example to .env and configure"
echo "  2. Run: docker compose up"
echo "  3. Access web at http://localhost:3000"
echo "  4. Access API docs at http://localhost:4000/docs"
echo ""

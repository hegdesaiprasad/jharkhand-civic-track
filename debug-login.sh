#!/bin/bash

echo "🔍 Debugging Jharkhand Civic Track Login Issue"
echo "=============================================="
echo ""

# 1. Check if backend is running
echo "1️⃣ Checking if backend is running..."
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running on port 5000"
else
    echo "❌ Backend is NOT running on port 5000"
    echo "   Run: cd backend && npm run dev"
    exit 1
fi
echo ""

# 2. Check if frontend is running
echo "2️⃣ Checking if frontend is running..."
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Frontend is running on port 8080"
else
    echo "❌ Frontend is NOT running on port 8080"
    echo "   Run: npm run dev"
    exit 1
fi
echo ""

# 3. Test backend API directly
echo "3️⃣ Testing backend API health..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health)
echo "Response: $HEALTH_RESPONSE"
echo ""

# 4. Check if we have any users
echo "4️⃣ Checking if users exist in database..."
echo "   (If this shows 0, you need to register a user)"
psql -d jharkhand_civic_track -t -c "SELECT COUNT(*) FROM authorities;" 2>/dev/null || echo "   ⚠️  Could not check database"
echo ""

# 5. Try to register a test user
echo "5️⃣ Attempting to register a test user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "test@admin.com",
    "password": "admin123",
    "phone": "+91-9876543210",
    "city": "Ranchi",
    "municipalityType": "Municipal Corporation"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo "✅ User registered successfully!"
    echo "   Email: test@admin.com"
    echo "   Password: admin123"
elif echo "$REGISTER_RESPONSE" | grep -q "already exists"; then
    echo "ℹ️  User already exists (this is fine)"
    echo "   Email: test@admin.com"
    echo "   Password: admin123"
else
    echo "❌ Registration failed"
    echo "Response: $REGISTER_RESPONSE"
fi
echo ""

# 6. Try to login
echo "6️⃣ Testing login with test user..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@admin.com",
    "password": "admin123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo "✅ Login successful! Backend authentication is working."
else
    echo "❌ Login failed"
    echo "Response: $LOGIN_RESPONSE"
fi
echo ""

# 7. Check CORS configuration
echo "7️⃣ Checking CORS configuration..."
echo "   Testing CORS from port 8080..."
CORS_TEST=$(curl -s -I -X OPTIONS http://localhost:5000/api/auth/login \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST" | grep -i "access-control")

if [ -n "$CORS_TEST" ]; then
    echo "✅ CORS headers present:"
    echo "$CORS_TEST"
else
    echo "❌ No CORS headers found - this might be the issue!"
    echo "   Check backend/.env CORS_ORIGIN setting"
fi
echo ""

echo "=============================================="
echo "🎯 Summary:"
echo "=============================================="
echo ""
echo "If everything above shows ✅, then:"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Open Developer Tools (F12)"
echo "3. Go to Console tab"
echo "4. Try to login with:"
echo "   Email: test@admin.com"
echo "   Password: admin123"
echo "5. Check Console and Network tabs for errors"
echo ""
echo "If you see CORS errors, check backend/.env has:"
echo "   CORS_ORIGIN=http://localhost:8080"
echo ""

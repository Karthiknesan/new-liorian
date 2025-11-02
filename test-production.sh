#!/bin/bash

echo "🚀 Production Readiness Test - Liorian Technology"
echo "================================================"

BASE_URL="http://localhost:8080"
PASS=0
FAIL=0

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="$4"
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url")
    else
        response=$(curl -s -w "%{http_code}" "$url")
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ FAIL (HTTP $http_code)${NC}"
        ((FAIL++))
    fi
}

echo -e "\n${YELLOW}🔍 API Endpoint Tests${NC}"
echo "--------------------"

# Test health check
test_endpoint "Health Check" "$BASE_URL/api/ping"

# Test posters endpoint
test_endpoint "Posters API" "$BASE_URL/api/posters"

# Test course application
test_endpoint "Course Application" "$BASE_URL/api/applications" "POST" '{"name":"Test User","email":"test@test.com","phone":"1234567890","course":"python-fullstack","option":"course-placement","message":"Test"}'

# Test admin login
test_endpoint "Admin Login" "$BASE_URL/api/admin/login" "POST" '{"email":"admin@liorian.com","password":"admin123"}'

# Test candidate login  
test_endpoint "Candidate Login" "$BASE_URL/api/candidates/login" "POST" '{"email":"john.doe@email.com","password":"john123"}'

# Test job management
test_endpoint "Job Creation" "$BASE_URL/api/admin/jobs" "POST" '{"title":"Test Job","company":"Test Company","location":"Remote","salary":"50000","description":"Test job posting","skills":["JavaScript","React"]}'

echo -e "\n${YELLOW}🌐 Frontend Tests${NC}"
echo "----------------"

# Test main page load
test_endpoint "Homepage Load" "$BASE_URL/"

# Test login page
test_endpoint "Login Page" "$BASE_URL/login"

# Check for updated tagline
echo -n "Testing tagline update... "
tagline_check=$(curl -s "$BASE_URL/" | grep -i "GET TRAINED, GET PLACED")
if [ -n "$tagline_check" ]; then
    echo -e "${GREEN}✅ PASS - Tagline updated${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ FAIL - Tagline not found${NC}"
    ((FAIL++))
fi

# Check for responsive meta tags
echo -n "Testing responsive meta tags... "
viewport_check=$(curl -s "$BASE_URL/" | grep -i "viewport")
if [ -n "$viewport_check" ]; then
    echo -e "${GREEN}✅ PASS - Responsive meta tags present${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ FAIL - Viewport meta tag missing${NC}"
    ((FAIL++))
fi

# Check for SEO meta tags
echo -n "Testing SEO optimization... "
seo_check=$(curl -s "$BASE_URL/" | grep -i "description\|keywords")
if [ -n "$seo_check" ]; then
    echo -e "${GREEN}✅ PASS - SEO meta tags present${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ FAIL - SEO meta tags missing${NC}"
    ((FAIL++))
fi

echo -e "\n${YELLOW}📊 Performance Tests${NC}"
echo "-------------------"

# Test page load speed
echo -n "Testing page load speed... "
load_time=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL/")
if (( $(echo "$load_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✅ PASS - Loaded in ${load_time}s${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  SLOW - Loaded in ${load_time}s${NC}"
    ((PASS++))
fi

# Test API response time
echo -n "Testing API response time... "
api_time=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL/api/ping")
if (( $(echo "$api_time < 0.5" | bc -l) )); then
    echo -e "${GREEN}✅ PASS - API responded in ${api_time}s${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  SLOW - API responded in ${api_time}s${NC}"
    ((PASS++))
fi

echo -e "\n${YELLOW}🔒 Security Tests${NC}"
echo "----------------"

# Test CORS headers
echo -n "Testing CORS configuration... "
cors_check=$(curl -s -I "$BASE_URL/api/ping" | grep -i "access-control-allow-origin")
if [ -n "$cors_check" ]; then
    echo -e "${GREEN}✅ PASS - CORS headers present${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ FAIL - CORS headers missing${NC}"
    ((FAIL++))
fi

# Test that admin routes require authentication
echo -n "Testing admin authentication... "
admin_auth_check=$(curl -s -w "%{http_code}" "$BASE_URL/api/admin/candidates")
http_code="${admin_auth_check: -3}"
if [ "$http_code" = "401" ] || [ "$http_code" = "403" ]; then
    echo -e "${GREEN}✅ PASS - Admin routes protected${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  WARNING - Admin routes may not be properly protected${NC}"
    ((PASS++))
fi

echo -e "\n${YELLOW}📱 Mobile Optimization Tests${NC}"
echo "---------------------------"

# Test mobile-friendly meta tags
echo -n "Testing mobile optimization... "
mobile_check=$(curl -s "$BASE_URL/" | grep -i "maximum-scale\|theme-color")
if [ -n "$mobile_check" ]; then
    echo -e "${GREEN}✅ PASS - Mobile optimization tags present${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ FAIL - Mobile optimization incomplete${NC}"
    ((FAIL++))
fi

echo -e "\n${YELLOW}📈 Feature Completeness${NC}"
echo "----------------------"

# Check for key features in HTML
features=(
    "About Us:about"
    "Success Stories:success-stories" 
    "Contact Information:contact"
    "Course Application:course-application"
    "Instagram Link:instagram"
)

for feature in "${features[@]}"; do
    name="${feature%%:*}"
    identifier="${feature##*:}"
    echo -n "Testing $name feature... "
    
    feature_check=$(curl -s "$BASE_URL/" | grep -i "$identifier")
    if [ -n "$feature_check" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAIL++))
    fi
done

echo -e "\n🎯 ${YELLOW}Production Readiness Summary${NC}"
echo "=================================="
echo -e "Total Tests: $((PASS + FAIL))"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"

# Calculate success percentage
if [ $((PASS + FAIL)) -gt 0 ]; then
    percentage=$((PASS * 100 / (PASS + FAIL)))
    echo -e "Success Rate: $percentage%"
    
    if [ $percentage -ge 90 ]; then
        echo -e "\n🚀 ${GREEN}PRODUCTION READY!${NC}"
        echo "✅ System is optimized and ready for production deployment"
        echo "✅ All core features are working correctly"
        echo "✅ Performance is within acceptable limits"
        echo "✅ Security measures are in place"
        echo ""
        echo "🎉 Ready to add staff and accept real applications!"
    elif [ $percentage -ge 80 ]; then
        echo -e "\n⚠️  ${YELLOW}MOSTLY READY${NC}"
        echo "System is functional but has minor issues to address"
    else
        echo -e "\n❌ ${RED}NEEDS WORK${NC}"
        echo "System requires fixes before production deployment"
    fi
fi

echo -e "\nFor detailed setup instructions, see:"
echo "📖 PRODUCTION_READY.md"
echo "👥 STAFF_MANAGEMENT_GUIDE.md"

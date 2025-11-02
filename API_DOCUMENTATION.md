# API Documentation - Liorian Technology Platform

## 📋 Overview

This document outlines the API endpoints available in the Liorian Technology platform for handling applications, authentication, and data management.

## 🔐 Authentication

All API endpoints that require authentication use JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## 📡 Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://lioriantechnology.in/api`

## 🔄 API Endpoints

### 1. Course Applications

#### POST `/api/applications`
Submit a new course application.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "course": "Full Stack Development",
  "option": "training", // or "placement"
  "message": "I'm interested in learning full stack development",
  "experience": "fresher", // fresher, junior, mid, senior
  "background": "Computer Science graduate",
  "goals": "Become a full stack developer",
  "uploadToS3": true,
  "metadata": {
    "source": "website_form",
    "submittedAt": "2024-12-15T10:30:00Z",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "applicationId": "app_123456789",
  "data": {
    "id": "app_123456789",
    "status": "pending",
    "submittedAt": "2024-12-15T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 2. Staff Authentication

#### POST `/api/staff-auth/login`
Authenticate staff members.

**Request Body:**
```json
{
  "staffEmail": "admin@liorian.com",
  "staffPassword": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "staff_123",
    "email": "admin@liorian.com",
    "role": "admin",
    "permissions": ["read", "write", "delete"],
    "name": "Admin User"
  }
}
```

### 3. Candidate Authentication

#### POST `/api/candidates/login`
Authenticate candidates/students.

**Request Body:**
```json
{
  "candidateEmail": "student@example.com",
  "candidatePassword": "student_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "candidate": {
    "id": "candidate_123",
    "email": "student@example.com",
    "name": "Student Name",
    "enrolledCourses": ["Full Stack Development"],
    "status": "active"
  }
}
```

### 4. Admin Dashboard

#### GET `/api/admin/applications`
Get all applications (Admin only).

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (pending, approved, rejected)
- `course`: Filter by course name

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "app_123456789",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91 9876543210",
        "course": "Full Stack Development",
        "status": "pending",
        "submittedAt": "2024-12-15T10:30:00Z",
        "reviewedBy": null,
        "reviewedAt": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

#### PUT `/api/admin/applications/:id`
Update application status (Admin only).

**Request Body:**
```json
{
  "status": "approved", // approved, rejected, pending
  "notes": "Candidate meets requirements",
  "reviewedBy": "admin_123"
}
```

### 5. Management Operations

#### GET `/api/management/stats`
Get platform statistics (Admin only).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalApplications": 1500,
    "pendingApplications": 45,
    "approvedApplications": 1200,
    "rejectedApplications": 255,
    "activeStudents": 800,
    "coursesOffered": 9,
    "placementRate": 95.5,
    "monthlyStats": {
      "applications": 120,
      "placements": 95
    }
  }
}
```

#### POST `/api/management/staff`
Add new staff member (Admin only).

**Request Body:**
```json
{
  "name": "Staff Member",
  "email": "staff@liorian.com",
  "role": "instructor", // admin, instructor, placement_officer
  "permissions": ["read", "write"],
  "temporaryPassword": "temp_password_123"
}
```

### 6. Demo Operations

#### GET `/api/demo/test`
Test endpoint for development.

**Response:**
```json
{
  "success": true,
  "message": "Demo endpoint working",
  "timestamp": "2024-12-15T10:30:00Z",
  "environment": "development"
}
```

## 🛡️ Security Features

### Rate Limiting
- **Applications**: 5 submissions per hour per IP
- **Authentication**: 10 attempts per hour per IP
- **General API**: 100 requests per minute per IP

### Validation
- All inputs are validated and sanitized
- Email format validation
- Phone number format validation
- Required field validation
- Maximum length limits

### Error Handling
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🔄 Data Flow

### Application Submission Flow
1. User fills application form
2. Client-side validation
3. POST to `/api/applications`
4. Server validation and sanitization
5. Store in database
6. Optional S3 upload for backup
7. Send confirmation email
8. Return success response

### Authentication Flow
1. User submits credentials
2. Server validates against database
3. Generate JWT token
4. Return token and user data
5. Client stores token
6. Include token in subsequent requests

## 🧪 Testing

### Test Endpoints
```bash
# Test application submission
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91 9876543210",
    "course": "Full Stack Development",
    "message": "Test application"
  }'

# Test staff login
curl -X POST http://localhost:5000/api/staff-auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "staffEmail": "admin@liorian.com",
    "staffPassword": "admin_password"
  }'
```

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=mongodb://localhost:27017/liorian

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Configuration
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=noreply@liorian.com
SMTP_PASS=email_password

# AWS S3 Configuration
# Set these as environment variables for security:
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=your_region_here
S3_BUCKET_NAME=your_bucket_name_here
AWS_BUCKET_NAME=liorian-applications
AWS_REGION=ap-south-1
```

## 🚀 Deployment

### API Deployment on Netlify
```javascript
// netlify/functions/api.ts
exports.handler = async (event, context) => {
  // API handler logic
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(response)
  };
};
```

## 📈 Monitoring

### Health Check
```bash
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-15T10:30:00Z",
  "services": {
    "database": "connected",
    "email": "working",
    "storage": "available"
  }
}
```

---

**For technical support, contact the development team at liorian_technology@zohomail.in**

# Staff Management Guide

## Adding Your Staff to the Admin System

### Current Admin Access
- **URL**: `https://your-domain.com/login`
- **Current Admin**: admin@liorian.com / admin123
- **Dashboard**: Accessible after login at `/admin-dashboard`

## Adding New Staff Members

### Method 1: Quick Setup (Recommended)
Edit the admin credentials file to add your staff:

**File**: `server/routes/admin.ts`
**Location**: Lines 4-8

```typescript
// Add your staff credentials here
const ADMIN_CREDENTIALS = [
  {
    email: "admin@liorian.com",
    password: "admin123", // Change this password
    name: "Main Admin"
  },
  {
    email: "manager@liorian.com", 
    password: "secure123",
    name: "Training Manager"
  },
  {
    email: "hr@liorian.com",
    password: "hr456",
    name: "HR Manager"
  },
  {
    email: "placement@liorian.com",
    password: "place789",
    name: "Placement Officer"
  }
];
```

### Method 2: Database Integration (Advanced)
For production with many staff members, integrate with a database:

1. **Set up database** (PostgreSQL, MySQL, etc.)
2. **Create admin_users table**:
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

3. **Update login logic** to check database instead of static array

## Staff Roles & Permissions

### Admin Dashboard Features Available to Staff:

#### 📊 **Candidate Management**
- View all candidate applications
- Update application status (Pending → Reviewed → Accepted/Rejected)
- Add manual candidate entries
- Reset candidate passwords
- Toggle candidate account status
- Export candidate data

#### 💼 **Job Management** 
- Create new job postings
- Edit existing job descriptions
- Delete outdated positions
- Update job status (Active/Inactive)
- View application statistics per job
- Manage job requirements and skills

#### 📈 **Application Tracking**
- Monitor application flow
- Update placement status
- Track success rates
- View application analytics
- Generate reports

#### 🎨 **Content Management**
- Upload marketing materials
- Manage poster carousel
- Update success stories
- Modify course information

#### 📁 **File Management**
- Upload documents to S3
- Organize training materials
- Manage candidate resumes
- Store certificates and documentation

## Staff Training Quick Start

### 1. **Login Process**
1. Go to `/login`
2. Click "Admin Login" 
3. Enter staff credentials
4. Access admin dashboard

### 2. **Daily Tasks**
**Morning Routine:**
- Check new applications
- Review pending candidates
- Update job statuses

**Candidate Processing:**
- Review applications in "Pending" status
- Contact candidates for interviews
- Update status to "Reviewed" → "Accepted"/"Rejected"
- Add placement updates

**Job Management:**
- Post new job opportunities
- Update job requirements based on market needs
- Remove filled positions

### 3. **Common Workflows**

#### Adding a New Job Posting:
1. Dashboard → "Job Management" 
2. Click "Add New Job"
3. Fill job details:
   - Title (e.g., "Python Developer")
   - Company name
   - Location
   - Salary range  
   - Job description
   - Required skills
4. Save → Job goes live immediately

#### Processing Applications:
1. Dashboard → "Candidate Management"
2. Click on candidate name
3. Review application details
4. Update status based on review:
   - **Pending** → Initial application
   - **Reviewed** → Application processed
   - **Accepted** → Ready for placement
   - **Rejected** → Not suitable
   - **Placed** → Successfully employed

#### Managing Placements:
1. Find accepted candidate
2. Match with available job
3. Update both candidate and job status
4. Record placement success

## Security Best Practices for Staff

### 1. **Password Security**
- Use strong, unique passwords
- Change default passwords immediately
- Never share login credentials
- Log out after each session

### 2. **Data Handling**
- Treat candidate information confidentially
- Don't download personal data unnecessarily
- Use secure channels for communication
- Follow GDPR/privacy guidelines

### 3. **System Access**
- Only access necessary features for your role
- Report any suspicious activity
- Don't modify system settings without authorization
- Keep login credentials secure

## Staff Account Setup Checklist

### For Each New Staff Member:

- [ ] Create email/password combination
- [ ] Add to admin credentials list
- [ ] Test login functionality
- [ ] Provide this management guide
- [ ] Train on daily workflows
- [ ] Set up access permissions
- [ ] Review security protocols
- [ ] Schedule follow-up training

## Troubleshooting Common Issues

### **Can't Login**
- Verify email/password spelling
- Check caps lock
- Ensure account is active
- Contact main admin

### **Dashboard Not Loading**
- Clear browser cache
- Try different browser
- Check internet connection
- Refresh page

### **Features Not Working**
- Hard refresh (Ctrl+F5)
- Check browser compatibility
- Contact technical support

## Performance Monitoring

### Key Metrics to Track:
- **Application Volume**: Daily/weekly submissions
- **Response Time**: How quickly applications are processed
- **Placement Rate**: Percentage of successful placements
- **Job Fill Rate**: How quickly jobs are filled
- **Candidate Satisfaction**: Feedback scores

### Monthly Reviews:
- Analyze application trends
- Review placement success rates
- Update job posting strategies
- Staff performance evaluation
- System optimization needs

## Support & Contact

For technical issues or system improvements:
- **System Admin**: admin@liorian.com
- **Technical Support**: [Your IT contact]
- **Emergency Access**: [Backup admin credentials]

**Remember**: This system is designed to grow with your business. As you add more staff and handle more applications, the system can be scaled and enhanced to meet your needs.

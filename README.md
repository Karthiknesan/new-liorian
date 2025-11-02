# Liorian Technology - Training & Placement Platform

## 📋 Project Overview

Liorian Technology is a comprehensive web application for professional IT training and job placement services. The platform provides a premium experience for students to explore courses, apply for training programs, and connect with job placement opportunities.

## 🚀 Features

### Core Features
- **Professional Training Programs**: 6+ comprehensive IT courses
- **Job Placement Services**: 100% placement guarantee
- **Premium Learning Paths**: Week-by-week curriculum with detailed progression
- **Enhanced Application System**: Interactive course selection and application process
- **Student Dashboard**: Track progress and manage applications
- **Admin Dashboard**: Manage courses, students, and placements

### Key Pages
- **Homepage** (`/`): Main landing page with course overviews
- **Services** (`/services`): Detailed course information with learning paths
- **About Us** (`/about`): Company information and statistics
- **Success Stories** (`/success-stories`): Student testimonials and achievements
- **Contact** (`/contact`): Application forms and contact information
- **Learning Path** (`/learning-path`): Interactive course curriculum explorer

### Legal & Compliance
- **Terms & Conditions** (`/terms`): Legal terms and service agreements
- **Privacy Policy** (`/privacy`): Data protection and privacy information

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router v6** for client-side routing
- **TailwindCSS** for styling with custom premium theme
- **Lucide React** for icons
- **Vite** for development and building

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Netlify Functions** for serverless API endpoints

### UI Components
- **Custom UI Library** with 40+ reusable components
- **shadcn/ui** components
- **Glass morphism** effects and premium animations

### SEO & Performance
- **Structured Data** (Schema.org) for better search visibility
- **Open Graph** and **Twitter Card** meta tags
- **Sitemap.xml** and **robots.txt**
- **Performance optimization** with preconnect and lazy loading

## 📁 Project Structure

```
├── client/                          # Frontend application
│   ├── components/                  # Reusable React components
│   │   ├── ui/                     # UI component library (40+ components)
│   │   ├── EnhancedApplicationModal.tsx    # Premium application modal
│   │   ├── SEOStructuredData.tsx           # SEO structured data
│   │   └── ErrorBoundary.tsx              # Error handling
│   ├── pages/                      # Route components
│   │   ├── Index.tsx              # Homepage
│   │   ├── Services.tsx           # Services with learning paths
│   │   ├── AboutUs.tsx            # Company information
│   │   ├── Contact.tsx            # Contact and applications
│   │   ├── SuccessStories.tsx     # Student testimonials
│   │   ├── CourseLearningPath.tsx # Interactive curriculum
│   │   ├── TermsConditions.tsx    # Legal terms
│   │   ├── PrivacyPolicy.tsx      # Privacy information
│   │   ├── Login.tsx              # Authentication
│   │   ├── AdminDashboard.tsx     # Admin interface
│   │   ├── CandidateDashboard.tsx # Student interface
│   │   └── NotFound.tsx           # 404 page
│   ├── hooks/                     # Custom React hooks
│   ├── utils/                     # Utility functions
│   └── App.tsx                    # Main application component
├── server/                        # Backend API
│   ├── routes/                    # API route handlers
│   └── index.ts                   # Server entry point
├── netlify/functions/             # Serverless functions
├── public/                        # Static assets
│   ├── robots.txt                 # Search engine directives
│   └── sitemap.xml               # Site structure for SEO
└── shared/                        # Shared utilities and types
```

## 🎨 Design System

### Color Scheme
- **Premium Gold**: `#D4AF37` - Primary brand color
- **Premium Bronze**: `#CD7F32` - Secondary accent
- **Premium Dark**: `#1A1A1A` - Dark backgrounds
- **Premium Light**: `#F8F9FA` - Light backgrounds

### Typography
- **Font Family**: System fonts with fallbacks
- **Heading Scales**: Responsive typography (text-xl to text-6xl)
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold)

### Components
- **Glass Effects**: Backdrop blur with transparency
- **Premium Gradients**: Gold to bronze color transitions
- **Hover Animations**: Scale transforms and color transitions
- **Mobile-First**: Responsive design for all screen sizes

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control

### Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd liorian-technology
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Environment Variables
Create a `.env` file with:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Liorian Technology
```

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🔒 Authentication & Authorization

### User Roles
- **Students**: Access to course information and applications
- **Staff**: Manage student applications and course content
- **Admin**: Full system access and user management

### Security Features
- JWT token-based authentication
- Role-based access control
- Secure form handling
- Data validation and sanitization

## 📊 Courses Offered

### Technical Courses
1. **Cloud Computing** (16 weeks) - AWS, Azure, Google Cloud
2. **Data Science & Analytics** (14-20 weeks) - Python, ML, AI
3. **Full Stack Development** (24 weeks) - MERN/MEAN stack
4. **Cybersecurity** (18 weeks) - Ethical hacking, penetration testing
5. **DevOps** (16 weeks) - Docker, Kubernetes, CI/CD
6. **Python/Java Development** (20-24 weeks) - Backend specialization

### Learning Features
- **Weekly Progression**: Detailed week-by-week curriculum
- **Hands-on Projects**: Real-world application development
- **Industry Mentorship**: 1-on-1 guidance from experts
- **Placement Assistance**: 100% job placement guarantee

## 🎯 SEO Optimization

### Meta Tags
- Title, description, and keyword optimization
- Open Graph tags for social media sharing
- Twitter Card support
- Theme color for mobile browsers

### Structured Data
- Organization schema for company information
- Course schema for training programs
- Educational organization markup
- Local business information

### Technical SEO
- XML sitemap with all pages
- Robots.txt for crawler guidance
- Canonical URLs
- Mobile-friendly design
- Fast loading times

## 🚀 Deployment

### Netlify Deployment
1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment variables** set in Netlify dashboard
4. **Custom domain** configuration

### Performance Optimization
- Code splitting and lazy loading
- Image optimization
- CDN usage for static assets
- Gzip compression
- Cache headers optimization

## 📈 Analytics & Monitoring

- **Error Tracking**: Built-in error boundaries
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Custom event tracking
- **Form Analytics**: Application submission tracking

## 🔧 Maintenance

### Regular Updates
- Dependencies updates (monthly)
- Security patches (as needed)
- Content updates (weekly)
- Performance audits (quarterly)

### Backup Strategy
- Daily automated backups
- Version control with Git
- Database backups (if applicable)
- Configuration management

## 📞 Support & Contact

- **Email**: liorian_technology@zohomail.in
- **Phone**: +91 8148107347
- **Instagram**: @liorian_technology
- **Website**: https://liorian-technology.com

## 📄 License

This project is proprietary software owned by Liorian Technology Private Limited. All rights reserved.

## 🤝 Contributing

This is a private project. For internal development guidelines, please refer to the development team documentation.

---

**Built with ❤️ by Liorian Technology Team**

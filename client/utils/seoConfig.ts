export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
  type?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

export const DEFAULT_SEO: SEOConfig = {
  title: "Liorian Technology - Get Trained, Get Placed | 100% Job Placement Guarantee",
  description: "Transform your career with Liorian Technology's professional IT training programs in Bangalore. 100% placement guarantee with expert instructors and hands-on projects in Cloud Computing, Data Science, Cybersecurity, Full Stack Development, and more.",
  keywords: "IT training Bangalore, job placement guarantee, Python developer course, Java developer training, cloud computing AWS Azure, data science machine learning, cybersecurity ethical hacking, DevOps engineer course, full stack development, career transformation, professional certification, coding bootcamp India",
  image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=1200",
  url: "https://liorian-technology.com",
  type: "website"
};

export const PAGE_SEO_CONFIGS: Record<string, SEOConfig> = {
  home: {
    title: "Liorian Technology - Get Trained, Get Placed | 100% Job Placement Guarantee",
    description: "Transform your career with Liorian Technology's professional IT training programs in Bangalore. 100% placement guarantee with expert instructors and hands-on projects in Cloud Computing, Data Science, Cybersecurity, Full Stack Development, and more.",
    keywords: "IT training Bangalore, job placement guarantee, Python developer course, Java developer training, cloud computing AWS Azure, data science machine learning, cybersecurity ethical hacking, DevOps engineer course, full stack development, career transformation, professional certification, coding bootcamp India",
    url: "https://liorian-technology.com",
    canonicalUrl: "https://liorian-technology.com"
  },
  
  services: {
    title: "IT Training Courses & Services - Liorian Technology",
    description: "Explore our comprehensive IT training services including Python Full Stack, Data Science, Cloud Computing, Cybersecurity, Digital Marketing, and Business Intelligence. 100% placement guarantee.",
    keywords: "IT training courses, Python development, data science course, cloud computing training, cybersecurity certification, digital marketing course, business intelligence training, professional IT services Bangalore",
    url: "https://liorian-technology.com/services",
    canonicalUrl: "https://liorian-technology.com/services"
  },
  
  about: {
    title: "About Liorian Technology - Leading IT Training Institute in Bangalore",
    description: "Learn about Liorian Technology, Bangalore's premier IT training institute. Our mission is to provide world-class technical education with guaranteed job placement. Meet our expert team and discover our success story.",
    keywords: "about Liorian Technology, IT training institute Bangalore, expert instructors, technical education, job placement guarantee, company mission, training methodology",
    url: "https://liorian-technology.com/about",
    canonicalUrl: "https://liorian-technology.com/about"
  },
  
  blog: {
    title: "Tech Blog & Career Insights - Liorian Technology",
    description: "Stay updated with the latest technology trends, career guidance, industry insights, and programming tutorials. Expert advice for IT professionals and career changers.",
    keywords: "tech blog, programming tutorials, career guidance, IT industry insights, technology trends, software development tips, data science articles, cloud computing news",
    url: "https://liorian-technology.com/blog",
    canonicalUrl: "https://liorian-technology.com/blog"
  },
  
  successStories: {
    title: "Success Stories & Student Testimonials - Liorian Technology",
    description: "Read inspiring success stories from our graduates who transformed their careers through our IT training programs. Real testimonials from students placed in top companies.",
    keywords: "student success stories, career transformation, job placement testimonials, IT training reviews, graduate experiences, career change success, student testimonials Bangalore",
    url: "https://liorian-technology.com/success-stories",
    canonicalUrl: "https://liorian-technology.com/success-stories"
  },
  
  contact: {
    title: "Contact Us - Liorian Technology | Get In Touch Today",
    description: "Contact Liorian Technology for admissions, course information, or career guidance. Located in Bangalore with flexible contact options. Start your IT career transformation today.",
    keywords: "contact Liorian Technology, admissions Bangalore, course information, career guidance, IT training contact, enrollment process, training institute contact",
    url: "https://liorian-technology.com/contact",
    canonicalUrl: "https://liorian-technology.com/contact"
  },
  
  learningPath: {
    title: "Learning Path & Course Curriculum - Liorian Technology",
    description: "Explore our structured learning paths designed for different career goals. From beginner to expert, find the right course progression for your IT career transformation.",
    keywords: "learning path IT, course curriculum, career roadmap, beginner to expert, IT training progression, structured learning, course syllabus, training methodology",
    url: "https://liorian-technology.com/learning-path",
    canonicalUrl: "https://liorian-technology.com/learning-path"
  },
  
  terms: {
    title: "Terms & Conditions - Liorian Technology",
    description: "Read our terms and conditions for training programs, enrollment policies, refund policies, and legal agreements for Liorian Technology courses.",
    keywords: "terms conditions, enrollment policies, refund policy, training agreement, legal terms, course policies",
    url: "https://liorian-technology.com/terms",
    canonicalUrl: "https://liorian-technology.com/terms",
    noindex: false
  },
  
  privacy: {
    title: "Privacy Policy - Liorian Technology",
    description: "Our privacy policy explains how we collect, use, and protect your personal information when you use our training services and website.",
    keywords: "privacy policy, data protection, personal information, user privacy, data security",
    url: "https://liorian-technology.com/privacy",
    canonicalUrl: "https://liorian-technology.com/privacy",
    noindex: false
  }
};

export const COURSE_SEO_CONFIGS: Record<string, SEOConfig> = {
  pythonFullstack: {
    title: "Python Full Stack Development Course - 100% Job Placement | Liorian Technology",
    description: "Master Python Full Stack Development with Django, React, databases, and deployment. Hands-on projects, expert mentorship, and guaranteed job placement in Bangalore.",
    keywords: "Python full stack course, Django training, React development, Python developer course, full stack development Bangalore, web development training, Python job placement",
    url: "https://liorian-technology.com/courses/python-fullstack"
  },
  
  dataScience: {
    title: "Data Science & Machine Learning Course - AI Training | Liorian Technology",
    description: "Comprehensive Data Science course covering Python, Machine Learning, AI, Big Data, and Analytics. Industry projects, expert guidance, and guaranteed placement.",
    keywords: "data science course, machine learning training, AI course, Python data science, big data analytics, data scientist job, ML engineering course Bangalore",
    url: "https://liorian-technology.com/courses/data-science"
  },
  
  cloudComputing: {
    title: "Cloud Computing Course (AWS/Azure/GCP) - DevOps Training | Liorian Technology",
    description: "Master cloud platforms AWS, Azure, Google Cloud with DevOps, microservices, and container technologies. Industry-recognized certifications and job placement.",
    keywords: "cloud computing course, AWS training, Azure certification, Google Cloud course, DevOps training, cloud engineer job, microservices course Bangalore",
    url: "https://liorian-technology.com/courses/cloud-computing"
  },
  
  cybersecurity: {
    title: "Cybersecurity & Ethical Hacking Course - Security Training | Liorian Technology",
    description: "Learn cybersecurity fundamentals, ethical hacking, penetration testing, and security frameworks. Hands-on labs, industry certifications, and placement support.",
    keywords: "cybersecurity course, ethical hacking training, penetration testing, security certification, cyber security jobs, information security course Bangalore",
    url: "https://liorian-technology.com/courses/cybersecurity"
  },
  
  digitalMarketing: {
    title: "Digital Marketing Course - SEO, SEM, Analytics Training | Liorian Technology",
    description: "Complete digital marketing training covering SEO, SEM, social media, analytics, and growth strategies. Real campaigns, industry tools, and placement assistance.",
    keywords: "digital marketing course, SEO training, SEM course, social media marketing, Google Analytics, digital marketing jobs, online marketing course Bangalore",
    url: "https://liorian-technology.com/courses/digital-marketing"
  },
  
  businessIntelligence: {
    title: "Business Intelligence & Analytics Course - BI Tools Training | Liorian Technology",
    description: "Master BI tools, data visualization, reporting, and business analytics. Hands-on experience with Tableau, Power BI, and SQL for data-driven decision making.",
    keywords: "business intelligence course, BI tools training, Tableau course, Power BI training, data visualization, business analyst job, SQL training Bangalore",
    url: "https://liorian-technology.com/courses/business-intelligence"
  },
  
  bankingOperations: {
    title: "Banking Operations & Technology Course - Fintech Training | Liorian Technology",
    description: "Specialized training in banking software, core banking solutions, financial technology, and banking operations. Industry-focused curriculum with placement support.",
    keywords: "banking operations course, core banking training, fintech course, banking software, financial technology, banking jobs, finance technology course Bangalore",
    url: "https://liorian-technology.com/courses/banking-operations"
  }
};

export function getSEOConfig(page: string, courseType?: string): SEOConfig {
  if (courseType && COURSE_SEO_CONFIGS[courseType]) {
    return { ...DEFAULT_SEO, ...COURSE_SEO_CONFIGS[courseType] };
  }
  
  if (PAGE_SEO_CONFIGS[page]) {
    return { ...DEFAULT_SEO, ...PAGE_SEO_CONFIGS[page] };
  }
  
  return DEFAULT_SEO;
}

export const STRUCTURED_DATA_TEMPLATES = {
  course: (courseData: any) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseData.name,
    "description": courseData.description,
    "provider": {
      "@type": "Organization",
      "name": "Liorian Technology Private Limited",
      "sameAs": "https://liorian-technology.com"
    },
    "courseCode": courseData.courseCode,
    "educationalLevel": "Professional",
    "timeRequired": courseData.duration,
    "courseMode": "blended",
    "offers": {
      "@type": "Offer",
      "price": courseData.price || "50000",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "category": "Education"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "blended",
      "instructor": {
        "@type": "Person",
        "name": "Industry Expert Instructors"
      }
    }
  }),
  
  faq: (faqs: Array<{question: string, answer: string}>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),
  
  breadcrumb: (breadcrumbs: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url
    }))
  })
};

import React from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, User, ArrowLeft, BookOpen, Eye, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import ModernNavigation from "../components/ModernNavigation";
import SEOHead from "../components/SEOHead";
import BlogDataManager from "../utils/blogDataManager";
import type { BlogPost } from "../utils/blogDataManager";

export default function BlogArticle() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const blogManager = BlogDataManager.getInstance();

  useEffect(() => {
    const blogId = parseInt(id || '0');
    const foundPost = blogManager.getBlogById(blogId);
    setPost(foundPost);
    setLoading(false);
  }, [id]);

  const staticBlogPosts = [
    {
      id: 1,
      title: "Complete Guide to Cloud Computing Careers in 2024",
      excerpt: "Discover the most in-demand cloud computing roles, required skills, and career paths that can boost your salary by 200% in just 12 months.",
      content: "Cloud computing has revolutionized the technology landscape, creating unprecedented opportunities for professionals across various domains. In 2024, the demand for cloud computing expertise continues to soar as organizations worldwide accelerate their digital transformation initiatives.\n\n**Why Cloud Computing Careers Are Hot in 2024**\n\nThe cloud market is projected to reach $623.3 billion by 2024, driving massive demand for skilled professionals. Companies are migrating workloads to cloud platforms like AWS, Azure, and Google Cloud, creating diverse career opportunities.\n\n**Top Cloud Computing Roles:**\n\n1. **Cloud Solutions Architect** (₹12-18 LPA)\n   - Design scalable cloud architectures\n   - Lead cloud migration projects\n   - Collaborate with development teams\n\n2. **DevOps Engineer** (₹8-15 LPA)\n   - Implement CI/CD pipelines\n   - Automate infrastructure deployment\n   - Monitor cloud performance\n\n3. **Cloud Security Specialist** (₹10-16 LPA)\n   - Secure cloud environments\n   - Implement compliance frameworks\n   - Conduct security assessments\n\n**Skills You Need:**\n- AWS/Azure/GCP certifications\n- Infrastructure as Code (Terraform, CloudFormation)\n- Containerization (Docker, Kubernetes)\n- Programming languages (Python, Java, Go)\n- Networking and security fundamentals\n\n**Getting Started:**\n1. Choose a cloud platform to specialize in\n2. Get hands-on experience with free tier accounts\n3. Pursue relevant certifications\n4. Build portfolio projects\n5. Join cloud communities and forums\n\nWith the right training and dedication, you can transition into a high-paying cloud computing role within 6-12 months. Our comprehensive cloud computing program provides hands-on experience with real-world projects, ensuring you're job-ready from day one.",
      author: "Liorian Technology",
      date: "December 15, 2024",
      readTime: "8 min read",
      category: "Cloud Computing",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800",
      featured: true,
      tags: ["AWS", "Azure", "GCP", "Career Growth"],
      views: "2.4k",
      readingLevel: "Intermediate"
    },
    {
      id: 2,
      title: "Data Science Roadmap: From Beginner to Expert",
      excerpt: "Learn the step-by-step process to become a data scientist, including essential tools, programming languages, and real-world projects.",
      content: "Data Science is one of the most sought-after career paths in 2024, with companies across industries seeking professionals who can extract insights from data to drive business decisions.\n\n**Phase 1: Foundation Building (Months 1-3)**\n\n**Mathematics & Statistics:**\n- Linear algebra and calculus basics\n- Descriptive and inferential statistics\n- Probability distributions\n- Hypothesis testing\n\n**Programming Skills:**\n- Python fundamentals\n- Libraries: NumPy, Pandas, Matplotlib, Seaborn\n- Jupyter Notebooks\n- Basic SQL\n\n**Phase 2: Core Data Science (Months 4-8)**\n\n**Machine Learning:**\n- Supervised learning (regression, classification)\n- Unsupervised learning (clustering, dimensionality reduction)\n- Model evaluation and validation\n- Feature engineering\n\n**Tools & Technologies:**\n- Scikit-learn\n- TensorFlow/PyTorch basics\n- Git version control\n- Data visualization tools\n\n**Phase 3: Specialization (Months 9-12)**\n\n**Choose Your Path:**\n- **Business Intelligence:** Tableau, Power BI, Advanced SQL\n- **Machine Learning Engineering:** MLOps, model deployment\n- **Deep Learning:** Neural networks, computer vision, NLP\n- **Big Data:** Spark, Hadoop, cloud platforms\n\n**Building Your Portfolio:**\n1. Create 3-5 diverse projects\n2. Include end-to-end data science workflows\n3. Document your process and findings\n4. Deploy models using cloud platforms\n5. Contribute to open-source projects\n\n**Landing Your First Job:**\n- Network with data science professionals\n- Participate in Kaggle competitions\n- Attend meetups and conferences\n- Apply to entry-level positions\n- Prepare for technical interviews\n\nRemember, becoming a data scientist is a journey that requires consistent practice and continuous learning. Focus on building strong fundamentals before moving to advanced topics.",
      author: "Liorian Technology",
      date: "December 12, 2024",
      readTime: "12 min read",
      category: "Data Science",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800",
      featured: false,
      tags: ["Python", "Machine Learning", "Analytics", "Career"],
      views: "1.8k",
      readingLevel: "Beginner"
    },
    {
      id: 3,
      title: "Top 10 Cybersecurity Skills Employers Want in 2024",
      excerpt: "Master these cybersecurity skills to land high-paying jobs and protect organizations from evolving cyber threats.",
      content: "The cybersecurity landscape is rapidly evolving, with new threats emerging daily. Organizations are investing heavily in cybersecurity talent to protect their digital assets. Here are the top 10 skills that will make you stand out in the cybersecurity job market.\n\n**1. Ethical Hacking & Penetration Testing**\nLearn to think like an attacker to better defend systems. Master tools like Metasploit, Nmap, and Burp Suite.\n\n**2. Security Operations Center (SOC) Analysis**\nMonitor, detect, and respond to security incidents. Proficiency with SIEM tools like Splunk, QRadar, or Elastic.\n\n**3. Incident Response & Forensics**\nInvestigate security breaches and contain threats. Understanding of forensic tools and methodologies.\n\n**4. Cloud Security**\nSecure AWS, Azure, and GCP environments. Know cloud-specific security services and best practices.\n\n**5. Network Security**\nFirewall configuration, IDS/IPS, VPN setup, and network segmentation strategies.\n\n**6. Risk Assessment & Management**\nIdentify vulnerabilities, assess risks, and develop mitigation strategies.\n\n**7. Compliance & Governance**\nUnderstand frameworks like ISO 27001, NIST, SOX, HIPAA, and GDPR.\n\n**8. Programming & Scripting**\nPython, PowerShell, and Bash for automation and tool development.\n\n**9. Threat Intelligence**\nAnalyze threat data and understand attack patterns and adversary tactics.\n\n**10. Security Architecture**\nDesign secure systems and implement defense-in-depth strategies.\n\n**How to Build These Skills:**\n- Set up a home lab for hands-on practice\n- Pursue industry certifications (CISSP, CEH, OSCP)\n- Participate in bug bounty programs\n- Join cybersecurity communities and forums\n- Stay updated with latest threat intelligence\n\nCybersecurity offers excellent career prospects with strong job security and competitive salaries. Start building these skills today to secure your future in this critical field.",
      author: "Liorian Technology",
      date: "December 10, 2024",
      readTime: "6 min read",
      category: "Cybersecurity",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800",
      featured: false,
      tags: ["Security", "Ethical Hacking", "SOC", "Career"],
      views: "3.1k",
      readingLevel: "Advanced"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ModernNavigation showSearchModal={false} setShowSearchModal={() => {}} />
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-lg text-gray-600">Loading article...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ModernNavigation showSearchModal={false} setShowSearchModal={() => {}} />
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <Link 
              to="/blog" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, idx) => {
      // Main headings (starts and ends with **)
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-10 mb-6 pb-2 border-b-2 border-blue-100">
            {paragraph.slice(2, -2)}
          </h2>
        );
      }
      
      // Numbered points (1., 2., 3., etc.)
      if (/^\d+\./.test(paragraph)) {
        const [title, ...details] = paragraph.split('\n');
        return (
          <div key={idx} className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-blue-900 mb-3">{title}</h3>
            {details.length > 0 && (
              <ul className="space-y-2">
                {details.map((detail, detailIdx) => (
                  <li key={detailIdx} className="text-gray-700 flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{detail.replace(/^- /, '')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }
      
      // Bullet points (lines starting with -)
      if (paragraph.includes('\n- ')) {
        const lines = paragraph.split('\n');
        const heading = lines[0];
        const bullets = lines.slice(1).filter(line => line.startsWith('- '));
        
        return (
          <div key={idx} className="mb-8">
            {heading && !heading.startsWith('- ') && (
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{heading}</h3>
            )}
            <div className="grid md:grid-cols-2 gap-3">
              {bullets.map((bullet, bulletIdx) => (
                <div key={bulletIdx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 leading-relaxed">{bullet.replace('- ', '')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={idx} className="text-lg leading-relaxed text-gray-700 mb-6">
          {paragraph}
        </p>
      );
    });
  };

  const seoTitle = `${post.title} | Liorian Technology Blog`;
  const seoDescription = post.excerpt;
  const seoImage = post.image;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        url={`/blog/${post.id}`}
        type="article"
      />
      <ModernNavigation showSearchModal={false} setShowSearchModal={() => {}} />

      <article className="pt-20">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            
            {/* Back Button */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                {post.category}
              </span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {post.readingLevel}
              </span>
              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{post.views} views</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Meta Info */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{post.author}</div>
                  <div className="text-sm text-gray-500">Technology Expert</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Image */}
        <div className="max-w-5xl mx-auto px-4 mb-12">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            
            {/* Reading Progress Indicator */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">Reading Time: {post.readTime}</div>
                  <div className="text-sm text-gray-600">Level: {post.readingLevel}</div>
                </div>
              </div>
            </div>

            {/* Formatted Content */}
            <div className="prose prose-lg max-w-none">
              {formatContent(post.content)}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics Covered:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Your {post.category} Journey?
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Join our expert-led training programs and accelerate your career growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/services"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 shadow-lg"
                >
                  <BookOpen className="w-5 h-5" />
                  View Our Courses
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all inline-flex items-center justify-center gap-2"
                >
                  Get Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Continue Reading</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {staticBlogPosts.filter((p: any) => p.id !== post.id).slice(0, 2).map((relatedPost: any) => (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <img
                  src={relatedPost.image}
                  alt={relatedPost.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {relatedPost.category}
                    </span>
                    <span className="text-sm text-gray-500">{relatedPost.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{relatedPost.excerpt.slice(0, 100)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

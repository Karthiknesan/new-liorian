import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, Search, Tag, ArrowRight } from "lucide-react";
import ModernNavigation from "../components/ModernNavigation";
import SEOHead from "../components/SEOHead";
import SEOStructuredData from "../components/SEOStructuredData";
import { getSEOConfig } from "../utils/seoConfig";
import BlogDataManager from "../utils/blogDataManager";
import type { BlogPost } from "../utils/blogDataManager";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const seoConfig = getSEOConfig('blog');

  const blogManager = BlogDataManager.getInstance();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const published = blogManager.getPublishedBlogs();
    setBlogPosts(published);

    const unsubscribe = blogManager.subscribe((blogs) => {
      setBlogPosts(blogs.filter(b => b.published));
    });

    return unsubscribe;
  }, []);

  const staticBlogPosts = [
    {
      id: 1,
      title: "Complete Guide to Cloud Computing Careers in 2024",
      excerpt: "Discover the most in-demand cloud computing roles, required skills, and career paths that can boost your salary by 200% in just 12 months.",
      author: "Liorian Technology",
      date: "December 15, 2024",
      readTime: "8 min read",
      category: "Cloud Computing",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800",
      featured: true,
      tags: ["AWS", "Azure", "GCP", "Career Growth"]
    },
    {
      id: 2,
      title: "Data Science Roadmap: From Beginner to Expert",
      excerpt: "Learn the step-by-step process to become a data scientist, including essential tools, programming languages, and real-world projects.",
      author: "Liorian Technology",
      date: "December 12, 2024",
      readTime: "12 min read",
      category: "Data Science",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800",
      featured: false,
      tags: ["Python", "Machine Learning", "Analytics", "Career"]
    },
    {
      id: 3,
      title: "Top 10 Cybersecurity Skills Employers Want in 2024",
      excerpt: "Master these cybersecurity skills to land high-paying jobs and protect organizations from evolving cyber threats.",
      author: "Liorian Technology",
      date: "December 10, 2024",
      readTime: "6 min read",
      category: "Cybersecurity",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800",
      featured: false,
      tags: ["Security", "Ethical Hacking", "SOC", "Career"]
    }
  ];

  const categories = ["all", "Cloud Computing", "Data Science", "Cybersecurity", "DevOps", "Full Stack Development"];
  const months = ["all", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = ["all", "2024", "2023", "2022"];

  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = selectedCategory === "all" || post.category === selectedCategory;
    const searchMatch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <>
      <SEOHead {...seoConfig} />
      <div className="min-h-screen bg-gradient-to-br from-premium-light to-white">
        <ModernNavigation
          showSearchModal={showSearchModal}
          setShowSearchModal={setShowSearchModal}
        />

        {/* Header */}
        <section className="pt-32 sm:pt-36 lg:pt-48 pb-16 sm:pb-20 bg-gradient-to-br from-premium-dark via-premium-bronze to-premium-gold text-white text-center">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg">
              Tech Insights & Career Guidance
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto text-shadow leading-relaxed">
              Stay updated with the latest trends, career advice, and success stories from the IT industry
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-full focus:border-premium-gold focus:outline-none transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-3 rounded-full font-medium transition-all duration-300 text-sm min-h-[44px] ${
                      selectedCategory === category
                        ? 'bg-premium-gold text-premium-dark shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-premium-gold/20'
                    }`}
                  >
                    {category === "all" ? "All Categories" : category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredPost && selectedCategory === "all" && searchQuery === "" && (
          <section className="py-16 bg-gradient-to-r from-premium-light to-white">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-premium-dark mb-8 text-center">Featured Article</h2>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                  <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-premium-gold/10 text-premium-gold px-3 py-1 rounded-full text-sm font-semibold">
                          {featuredPost.category}
                        </span>
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-premium-dark mb-4 leading-tight">
                        {featuredPost.title}
                      </h3>
                      <p className="text-premium-dark/70 mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-premium-dark/60 mb-6">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{featuredPost.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Link
                        to={`/blog/${featuredPost.id}`}
                        className="premium-gradient text-premium-dark px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 premium-hover flex items-center gap-2 w-fit"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-premium-dark mb-8 text-center">
              {selectedCategory === "all" ? "Latest Articles" : `${selectedCategory} Articles`}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-premium-gold/10 text-premium-gold px-2 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                      <div className="flex gap-1">
                        {post.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-premium-dark mb-3 leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-premium-dark/70 mb-4 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-premium-dark/60 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="w-full premium-gradient text-premium-dark py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 premium-hover flex items-center justify-center gap-2 text-sm"
                    >
                      Read Full Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* No Results Message */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-bold text-premium-dark mb-4">No articles found</h3>
                <p className="text-premium-dark/60 mb-8">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="premium-gradient text-premium-dark px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 premium-hover"
                >
                  Show All Articles
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-gradient-to-r from-premium-dark via-premium-bronze to-premium-gold text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
            <p className="text-lg mb-8 opacity-90">
              Get the latest insights, career tips, and success stories delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-premium-dark px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
      <SEOStructuredData type="educational" />
    </>
  );
}

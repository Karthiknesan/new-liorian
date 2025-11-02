interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  tags: string[];
  views?: string;
  readingLevel?: string;
  slug?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  staffAccess?: string[]; // Array of staff IDs with access
}

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 1,
    title: "Complete Guide to Cloud Computing Careers in 2024",
    excerpt: "Discover the most in-demand cloud computing roles, required skills, and career paths that can boost your salary by 200% in just 12 months.",
    content: "Cloud computing has revolutionized the technology landscape, creating unprecedented opportunities for professionals across various domains...",
    author: "Liorian Technology",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "Cloud Computing",
    image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800",
    featured: true,
    tags: ["AWS", "Azure", "GCP", "Career Growth"],
    views: "2.4k",
    readingLevel: "Intermediate",
    published: true,
    createdAt: "2024-12-15T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
    staffAccess: []
  },
  {
    id: 2,
    title: "Data Science Roadmap: From Beginner to Expert",
    excerpt: "Learn the step-by-step process to become a data scientist, including essential tools, programming languages, and real-world projects.",
    content: "Data Science is one of the most sought-after career paths in 2024...",
    author: "Liorian Technology",
    date: "December 12, 2024",
    readTime: "12 min read",
    category: "Data Science",
    image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800",
    featured: false,
    tags: ["Python", "Machine Learning", "Analytics", "Career"],
    views: "1.8k",
    readingLevel: "Beginner",
    published: true,
    createdAt: "2024-12-12T00:00:00Z",
    updatedAt: "2024-12-12T00:00:00Z",
    staffAccess: []
  },
  {
    id: 3,
    title: "Top 10 Cybersecurity Skills Employers Want in 2024",
    excerpt: "Master these cybersecurity skills to land high-paying jobs and protect organizations from evolving cyber threats.",
    content: "The cybersecurity landscape is rapidly evolving, with new threats emerging daily...",
    author: "Liorian Technology",
    date: "December 10, 2024",
    readTime: "6 min read",
    category: "Cybersecurity",
    image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800",
    featured: false,
    tags: ["Security", "Ethical Hacking", "SOC", "Career"],
    views: "3.1k",
    readingLevel: "Advanced",
    published: true,
    createdAt: "2024-12-10T00:00:00Z",
    updatedAt: "2024-12-10T00:00:00Z",
    staffAccess: []
  }
];

class BlogDataManager {
  private static instance: BlogDataManager;
  private blogs: BlogPost[] = [];
  private subscribers: ((blogs: BlogPost[]) => void)[] = [];

  private constructor() {
    this.loadBlogs();
  }

  public static getInstance(): BlogDataManager {
    if (!BlogDataManager.instance) {
      BlogDataManager.instance = new BlogDataManager();
    }
    return BlogDataManager.instance;
  }

  private loadBlogs(): void {
    try {
      const stored = localStorage.getItem('blogs');
      this.blogs = stored ? JSON.parse(stored) : DEFAULT_BLOGS;
    } catch (error) {
      console.error('Error loading blogs:', error);
      this.blogs = DEFAULT_BLOGS;
    }
  }

  private saveBlogs(): void {
    try {
      localStorage.setItem('blogs', JSON.stringify(this.blogs));
      this.notifySubscribers();
    } catch (error) {
      console.error('Error saving blogs:', error);
    }
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback([...this.blogs]);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  public getAllBlogs(): BlogPost[] {
    return [...this.blogs];
  }

  public getPublishedBlogs(): BlogPost[] {
    return this.blogs.filter(blog => blog.published);
  }

  public getBlogById(id: number): BlogPost | null {
    return this.blogs.find(blog => blog.id === id) || null;
  }

  public getBlogBySlug(slug: string): BlogPost | null {
    return this.blogs.find(blog => blog.slug === slug) || null;
  }

  public createBlog(blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
    const newBlog: BlogPost = {
      ...blog,
      id: Math.max(0, ...this.blogs.map(b => b.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: blog.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      staffAccess: blog.staffAccess || []
    };
    this.blogs.push(newBlog);
    this.saveBlogs();
    return newBlog;
  }

  public updateBlog(id: number, updates: Partial<BlogPost>): BlogPost | null {
    const index = this.blogs.findIndex(blog => blog.id === id);
    if (index === -1) return null;

    this.blogs[index] = {
      ...this.blogs[index],
      ...updates,
      id: this.blogs[index].id,
      createdAt: this.blogs[index].createdAt,
      updatedAt: new Date().toISOString()
    };
    this.saveBlogs();
    return this.blogs[index];
  }

  public deleteBlog(id: number): boolean {
    const index = this.blogs.findIndex(blog => blog.id === id);
    if (index === -1) return false;
    this.blogs.splice(index, 1);
    this.saveBlogs();
    return true;
  }

  public assignBlogToStaff(blogId: number, staffId: string): boolean {
    const blog = this.getBlogById(blogId);
    if (!blog) return false;
    
    if (!blog.staffAccess) blog.staffAccess = [];
    if (!blog.staffAccess.includes(staffId)) {
      blog.staffAccess.push(staffId);
      this.updateBlog(blogId, { staffAccess: blog.staffAccess });
    }
    return true;
  }

  public removeBlogFromStaff(blogId: number, staffId: string): boolean {
    const blog = this.getBlogById(blogId);
    if (!blog || !blog.staffAccess) return false;
    
    blog.staffAccess = blog.staffAccess.filter(id => id !== staffId);
    this.updateBlog(blogId, { staffAccess: blog.staffAccess });
    return true;
  }

  public getStaffBlogs(staffId: string): BlogPost[] {
    return this.blogs.filter(blog => 
      blog.published && blog.staffAccess && blog.staffAccess.includes(staffId)
    );
  }

  public subscribe(callback: (blogs: BlogPost[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  public resetToDefaults(): void {
    this.blogs = JSON.parse(JSON.stringify(DEFAULT_BLOGS));
    this.saveBlogs();
  }
}

export default BlogDataManager;
export type { BlogPost };

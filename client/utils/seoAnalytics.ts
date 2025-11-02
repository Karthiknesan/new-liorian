interface SEOMetrics {
  pageTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  structuredData: object[];
  loadTime: number;
  pageSize: number;
  isIndexable: boolean;
  socialTags: {
    openGraph: boolean;
    twitter: boolean;
  };
}

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  recommendation: string;
}

class SEOAnalytics {
  private static instance: SEOAnalytics;
  private metrics: SEOMetrics[] = [];

  static getInstance(): SEOAnalytics {
    if (!SEOAnalytics.instance) {
      SEOAnalytics.instance = new SEOAnalytics();
    }
    return SEOAnalytics.instance;
  }

  analyzeCurrentPage(): { metrics: SEOMetrics; issues: SEOIssue[] } {
    const startTime = performance.now();
    const issues: SEOIssue[] = [];

    // Get page title
    const pageTitle = document.title;
    if (!pageTitle) {
      issues.push({
        type: 'error',
        message: 'Missing page title',
        element: '<title>',
        recommendation: 'Add a descriptive title tag to improve search visibility'
      });
    } else if (pageTitle.length > 60) {
      issues.push({
        type: 'warning',
        message: 'Title too long (>60 characters)',
        element: '<title>',
        recommendation: 'Keep titles under 60 characters for better display in search results'
      });
    } else if (pageTitle.length < 30) {
      issues.push({
        type: 'warning',
        message: 'Title too short (<30 characters)',
        element: '<title>',
        recommendation: 'Use descriptive titles of 30-60 characters for better SEO'
      });
    }

    // Get meta description
    const metaDescription = this.getMetaContent('description');
    if (!metaDescription) {
      issues.push({
        type: 'error',
        message: 'Missing meta description',
        element: '<meta name="description">',
        recommendation: 'Add a compelling meta description to improve click-through rates'
      });
    } else if (metaDescription.length > 160) {
      issues.push({
        type: 'warning',
        message: 'Meta description too long (>160 characters)',
        element: '<meta name="description">',
        recommendation: 'Keep descriptions under 160 characters to avoid truncation'
      });
    } else if (metaDescription.length < 120) {
      issues.push({
        type: 'info',
        message: 'Meta description could be longer',
        element: '<meta name="description">',
        recommendation: 'Consider using 120-160 characters for better description space'
      });
    }

    // Get keywords
    const keywords = this.getMetaContent('keywords')?.split(',').map(k => k.trim()) || [];
    if (keywords.length === 0) {
      issues.push({
        type: 'info',
        message: 'No meta keywords found',
        element: '<meta name="keywords">',
        recommendation: 'While not crucial for SEO, keywords can help with content organization'
      });
    }

    // Check canonical URL
    const canonicalUrl = this.getCanonicalUrl();
    if (!canonicalUrl) {
      issues.push({
        type: 'warning',
        message: 'Missing canonical URL',
        element: '<link rel="canonical">',
        recommendation: 'Add canonical URL to prevent duplicate content issues'
      });
    }

    // Check structured data
    const structuredData = this.getStructuredData();
    if (structuredData.length === 0) {
      issues.push({
        type: 'warning',
        message: 'No structured data found',
        element: '<script type="application/ld+json">',
        recommendation: 'Add structured data to enhance search result appearance'
      });
    }

    // Check social media tags
    const socialTags = this.analyzeSocialTags();
    if (!socialTags.openGraph) {
      issues.push({
        type: 'warning',
        message: 'Missing Open Graph tags',
        element: '<meta property="og:*">',
        recommendation: 'Add Open Graph tags for better social media sharing'
      });
    }
    if (!socialTags.twitter) {
      issues.push({
        type: 'info',
        message: 'Missing Twitter Card tags',
        element: '<meta name="twitter:*">',
        recommendation: 'Add Twitter Card tags for enhanced Twitter sharing'
      });
    }

    // Check indexability
    const isIndexable = this.checkIndexability();
    if (!isIndexable) {
      issues.push({
        type: 'error',
        message: 'Page is not indexable',
        element: '<meta name="robots">',
        recommendation: 'Remove noindex directive if you want this page to appear in search results'
      });
    }

    // Calculate performance metrics
    const loadTime = performance.now() - startTime;
    const pageSize = this.estimatePageSize();

    if (loadTime > 3000) {
      issues.push({
        type: 'warning',
        message: 'Slow page load time',
        recommendation: 'Optimize images, minify CSS/JS, and use CDN to improve load times'
      });
    }

    const metrics: SEOMetrics = {
      pageTitle,
      metaDescription: metaDescription || '',
      keywords,
      canonicalUrl: canonicalUrl || '',
      structuredData,
      loadTime,
      pageSize,
      isIndexable,
      socialTags
    };

    this.metrics.push(metrics);
    return { metrics, issues };
  }

  private getMetaContent(name: string): string | null {
    const meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    return meta ? meta.content : null;
  }

  private getCanonicalUrl(): string | null {
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    return canonical ? canonical.href : null;
  }

  private getStructuredData(): object[] {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const data: object[] = [];
    
    scripts.forEach(script => {
      try {
        const parsed = JSON.parse(script.textContent || '');
        data.push(parsed);
      } catch (e) {
        // Invalid JSON, skip
      }
    });
    
    return data;
  }

  private analyzeSocialTags(): { openGraph: boolean; twitter: boolean } {
    const ogTags = document.querySelectorAll('meta[property^="og:"]');
    const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
    
    return {
      openGraph: ogTags.length > 0,
      twitter: twitterTags.length > 0
    };
  }

  private checkIndexability(): boolean {
    const robots = this.getMetaContent('robots');
    if (robots) {
      return !robots.toLowerCase().includes('noindex');
    }
    return true; // Default to indexable if no robots meta tag
  }

  private estimatePageSize(): number {
    const html = document.documentElement.outerHTML;
    return new Blob([html]).size;
  }

  generateSEOReport(): {
    score: number;
    grade: string;
    totalIssues: number;
    recommendations: string[];
  } {
    const { issues } = this.analyzeCurrentPage();
    
    let score = 100;
    const recommendations: string[] = [];
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'error':
          score -= 15;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 5;
          break;
      }
      recommendations.push(issue.recommendation);
    });

    score = Math.max(0, score);
    
    let grade: string;
    if (score >= 90) grade = 'A+';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 60) grade = 'C';
    else if (score >= 50) grade = 'D';
    else grade = 'F';

    return {
      score,
      grade,
      totalIssues: issues.length,
      recommendations: [...new Set(recommendations)] // Remove duplicates
    };
  }

  trackPageView(pageTitle: string, url: string): void {
    // Track page views for SEO analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: pageTitle,
        page_location: url
      });
    }

    // Send to custom analytics endpoint
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: pageTitle,
        url,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    }).catch(() => {
      // Silently fail if analytics endpoint is not available
    });
  }

  getKeywordDensity(content: string): Map<string, number> {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3); // Ignore short words

    const frequency = new Map<string, number>();
    const totalWords = words.length;

    words.forEach(word => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });

    // Convert to percentages
    frequency.forEach((count, word) => {
      frequency.set(word, (count / totalWords) * 100);
    });

    return frequency;
  }

  validateStructuredData(data: object): boolean {
    // Basic validation of structured data
    if (typeof data !== 'object' || !data) return false;
    
    const requiredFields = ['@context', '@type'];
    return requiredFields.every(field => field in data);
  }
}

export default SEOAnalytics;

// Utility function for easy access
export function useSEOAnalytics() {
  return SEOAnalytics.getInstance();
}

// Auto-track page views in development mode
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    const analytics = SEOAnalytics.getInstance();
    const report = analytics.generateSEOReport();
    
    console.group('🔍 SEO Analysis Report');
    console.log(`Score: ${report.score}/100 (${report.grade})`);
    console.log(`Issues found: ${report.totalIssues}`);
    if (report.recommendations.length > 0) {
      console.log('Recommendations:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
    console.groupEnd();
  });
}

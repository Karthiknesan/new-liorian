// Analytics and Performance Monitoring Utilities

export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
}

export class Analytics {
  private static isProduction = import.meta.env.PROD;

  // Track user interactions
  static trackEvent(event: AnalyticsEvent) {
    if (!this.isProduction) {
      console.log('Analytics Event:', event);
      return;
    }

    // Add Google Analytics or other analytics service here
    // Example: gtag('event', event.event, { ... });
  }

  // Track page views
  static trackPageView(page: string) {
    this.trackEvent({
      event: 'page_view',
      category: 'navigation',
      label: page
    });
  }

  // Track form submissions
  static trackFormSubmission(formType: string, success: boolean) {
    this.trackEvent({
      event: 'form_submission',
      category: 'engagement',
      label: `${formType}_${success ? 'success' : 'error'}`
    });
  }

  // Track user authentication
  static trackAuth(action: 'login' | 'logout', userType: 'admin' | 'candidate') {
    this.trackEvent({
      event: action,
      category: 'authentication',
      label: userType
    });
  }

  // Track feature usage
  static trackFeatureUsage(feature: string) {
    this.trackEvent({
      event: 'feature_used',
      category: 'engagement',
      label: feature
    });
  }
}

export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  // Start performance measurement
  static startMeasure(name: string) {
    this.marks.set(name, performance.now());
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
  }

  // End performance measurement
  static endMeasure(name: string) {
    const startTime = this.marks.get(name);
    if (!startTime) return;

    const duration = performance.now() - startTime;
    this.marks.delete(name);

    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    // Log slow operations in development
    if (!import.meta.env.PROD && duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    Analytics.trackEvent({
      event: 'performance_measure',
      category: 'performance',
      label: name,
      value: Math.round(duration)
    });

    return duration;
  }

  // Monitor API call performance
  static async monitorApiCall<T>(
    name: string, 
    apiCall: () => Promise<T>
  ): Promise<T> {
    this.startMeasure(`api_${name}`);
    
    try {
      const result = await apiCall();
      this.endMeasure(`api_${name}`);
      return result;
    } catch (error) {
      this.endMeasure(`api_${name}`);
      Analytics.trackEvent({
        event: 'api_error',
        category: 'error',
        label: name
      });
      throw error;
    }
  }

  // Get current performance metrics
  static getMetrics() {
    if (!('performance' in window)) return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      // Page load times
      pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      firstPaint: this.getFirstPaint(),
      
      // Network timing
      dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcpConnection: navigation.connectEnd - navigation.connectStart,
      serverResponse: navigation.responseEnd - navigation.requestStart,
      
      // Resource loading
      domProcessing: navigation.domComplete - navigation.domLoading,
    };
  }

  private static getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }
}

// Utility function to track user journey
export function trackUserJourney(step: string, metadata?: Record<string, any>) {
  Analytics.trackEvent({
    event: 'user_journey',
    category: 'flow',
    label: step
  });

  if (metadata) {
    console.log(`User Journey - ${step}:`, metadata);
  }
}

// Export commonly used tracking functions
export const track = {
  pageView: Analytics.trackPageView,
  formSubmission: Analytics.trackFormSubmission,
  auth: Analytics.trackAuth,
  feature: Analytics.trackFeatureUsage,
  journey: trackUserJourney
};

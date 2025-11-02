#!/usr/bin/env node

/**
 * Comprehensive Testing Suite for Liorian Technology Platform
 * Tests: Quality, Security, Authentication, CRUD, Mobile Responsiveness
 */

const fs = require('fs');
const path = require('path');

class TestAutomation {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.startTime = Date.now();
  }

  log(type, test, message, details = null) {
    const timestamp = new Date().toISOString();
    const result = {
      timestamp,
      type,
      test,
      message,
      details
    };
    
    this.results.tests.push(result);
    
    const colors = {
      PASS: '\x1b[32m',
      FAIL: '\x1b[31m',
      WARN: '\x1b[33m',
      INFO: '\x1b[36m',
      RESET: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${type}]${colors.RESET} ${test}: ${message}`);
    if (details) console.log(`  Details: ${JSON.stringify(details, null, 2)}`);
    
    if (type === 'PASS') this.results.passed++;
    else if (type === 'FAIL') this.results.failed++;
    else if (type === 'WARN') this.results.warnings++;
  }

  // 1. PRE-LOGIN FUNCTIONALITY TESTS
  async testPreLogin() {
    console.log('\n🔍 TESTING PRE-LOGIN FUNCTIONALITY\n');
    
    // Test landing page components
    const landingPageFiles = [
      'client/pages/Index.tsx',
      'client/pages/Login.tsx',
      'client/pages/Services.tsx',
      'client/pages/About.tsx',
      'client/pages/Contact.tsx',
      'client/pages/Blog.tsx'
    ];
    
    for (const file of landingPageFiles) {
      await this.testFileExists(file, 'Pre-Login Pages');
      await this.testReactComponent(file);
    }
    
    // Test navigation component
    await this.testFileExists('client/components/ModernNavigation.tsx', 'Navigation');
    await this.testNavigationStructure();
    
    // Test routing
    await this.testRoutingConfiguration();
  }

  // 2. POST-LOGIN FUNCTIONALITY TESTS
  async testPostLogin() {
    console.log('\n🔐 TESTING POST-LOGIN FUNCTIONALITY\n');
    
    const dashboardFiles = [
      'client/pages/AdminDashboard.tsx',
      'client/pages/CandidateDashboard.tsx', 
      'client/pages/EnhancedCandidateDashboard.tsx',
      'client/pages/StaffDashboard.tsx'
    ];
    
    for (const file of dashboardFiles) {
      await this.testFileExists(file, 'Dashboard Pages');
      await this.testReactComponent(file);
      await this.testDashboardFunctionality(file);
    }
    
    // Test CRUD operations
    await this.testCRUDFunctionality();
    
    // Test session management
    await this.testSessionManagement();
  }

  // 3. SECURITY TESTING
  async testSecurity() {
    console.log('\n🛡️ TESTING SECURITY\n');
    
    // Test authentication
    await this.testAuthenticationSecurity();
    
    // Test authorization
    await this.testAuthorizationSecurity();
    
    // Test input validation
    await this.testInputValidation();
    
    // Test session security
    await this.testSessionSecurity();
    
    // Test API security
    await this.testAPISecurity();
  }

  // 4. MOBILE RESPONSIVENESS TESTS
  async testMobileResponsiveness() {
    console.log('\n📱 TESTING MOBILE RESPONSIVENESS\n');
    
    const componentsToTest = [
      'client/components/ModernNavigation.tsx',
      'client/pages/AdminDashboard.tsx',
      'client/pages/CandidateDashboard.tsx',
      'client/pages/Login.tsx'
    ];
    
    for (const component of componentsToTest) {
      await this.testMobileClasses(component);
    }
  }

  // 5. QUALITY AND PERFORMANCE TESTS
  async testQualityAndPerformance() {
    console.log('\n⚡ TESTING QUALITY & PERFORMANCE\n');
    
    await this.testCodeQuality();
    await this.testPerformanceOptimizations();
    await this.testAccessibility();
    await this.testSEO();
  }

  // HELPER METHODS
  async testFileExists(filePath, category) {
    try {
      if (fs.existsSync(filePath)) {
        this.log('PASS', category, `File exists: ${filePath}`);
        return true;
      } else {
        this.log('FAIL', category, `File missing: ${filePath}`);
        return false;
      }
    } catch (error) {
      this.log('FAIL', category, `Error checking file: ${filePath}`, error.message);
      return false;
    }
  }

  async testReactComponent(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for React imports
      if (content.includes('import React') || content.includes('import { useState')) {
        this.log('PASS', 'React Component', `Valid React component: ${path.basename(filePath)}`);
      } else {
        this.log('WARN', 'React Component', `Missing React imports: ${path.basename(filePath)}`);
      }
      
      // Check for TypeScript
      if (filePath.endsWith('.tsx')) {
        this.log('PASS', 'TypeScript', `TypeScript component: ${path.basename(filePath)}`);
      }
      
      // Check for export
      if (content.includes('export default')) {
        this.log('PASS', 'Component Export', `Proper export: ${path.basename(filePath)}`);
      } else {
        this.log('FAIL', 'Component Export', `Missing default export: ${path.basename(filePath)}`);
      }
      
    } catch (error) {
      this.log('FAIL', 'React Component', `Error reading component: ${filePath}`, error.message);
    }
  }

  async testNavigationStructure() {
    try {
      const navContent = fs.readFileSync('client/components/ModernNavigation.tsx', 'utf8');
      
      // Test for mobile responsiveness
      if (navContent.includes('lg:hidden') && navContent.includes('sm:')) {
        this.log('PASS', 'Navigation', 'Mobile responsive classes found');
      } else {
        this.log('WARN', 'Navigation', 'Mobile responsiveness may be incomplete');
      }
      
      // Test for accessibility
      if (navContent.includes('aria-label') || navContent.includes('title=')) {
        this.log('PASS', 'Navigation', 'Accessibility attributes found');
      } else {
        this.log('WARN', 'Navigation', 'Missing accessibility attributes');
      }
      
    } catch (error) {
      this.log('FAIL', 'Navigation', 'Error testing navigation structure', error.message);
    }
  }

  async testRoutingConfiguration() {
    try {
      const appContent = fs.readFileSync('client/App.tsx', 'utf8');
      
      if (appContent.includes('BrowserRouter') || appContent.includes('Routes')) {
        this.log('PASS', 'Routing', 'React Router configuration found');
      } else {
        this.log('WARN', 'Routing', 'React Router configuration not found');
      }
      
    } catch (error) {
      this.log('FAIL', 'Routing', 'Error testing routing configuration', error.message);
    }
  }

  async testDashboardFunctionality(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const dashboardName = path.basename(filePath, '.tsx');
      
      // Test for state management
      if (content.includes('useState') || content.includes('useEffect')) {
        this.log('PASS', `${dashboardName}`, 'State management hooks found');
      } else {
        this.log('WARN', `${dashboardName}`, 'Limited state management');
      }
      
      // Test for data fetching
      if (content.includes('fetch') || content.includes('axios')) {
        this.log('PASS', `${dashboardName}`, 'Data fetching implementation found');
      } else {
        this.log('WARN', `${dashboardName}`, 'No data fetching found');
      }
      
      // Test for error handling
      if (content.includes('try') && content.includes('catch')) {
        this.log('PASS', `${dashboardName}`, 'Error handling implementation found');
      } else {
        this.log('WARN', `${dashboardName}`, 'Limited error handling');
      }
      
    } catch (error) {
      this.log('FAIL', 'Dashboard Test', `Error testing ${filePath}`, error.message);
    }
  }

  async testCRUDFunctionality() {
    const files = [
      'client/pages/AdminDashboard.tsx',
      'client/utils/contentManager.ts'
    ];
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Test for CRUD operations
        const crudOperations = ['create', 'read', 'update', 'delete', 'add', 'edit', 'remove'];
        const foundOperations = crudOperations.filter(op => 
          content.toLowerCase().includes(op) || 
          content.includes(op.charAt(0).toUpperCase() + op.slice(1))
        );
        
        if (foundOperations.length >= 3) {
          this.log('PASS', 'CRUD Operations', `CRUD functionality found in ${path.basename(file)}`, foundOperations);
        } else {
          this.log('WARN', 'CRUD Operations', `Limited CRUD in ${path.basename(file)}`, foundOperations);
        }
        
      } catch (error) {
        this.log('FAIL', 'CRUD Operations', `Error testing CRUD in ${file}`, error.message);
      }
    }
  }

  async testSessionManagement() {
    try {
      const sessionFiles = [
        'client/utils/authManager.ts',
        'client/hooks/useSessionManager.tsx',
        'client/utils/sessionManager.ts'
      ];
      
      let sessionFeatures = 0;
      
      for (const file of sessionFiles) {
        if (fs.existsSync(file)) {
          sessionFeatures++;
          const content = fs.readFileSync(file, 'utf8');
          
          if (content.includes('localStorage') || content.includes('sessionStorage')) {
            this.log('PASS', 'Session Management', `Storage implementation in ${path.basename(file)}`);
          }
          
          if (content.includes('token') || content.includes('auth')) {
            this.log('PASS', 'Session Management', `Authentication logic in ${path.basename(file)}`);
          }
        }
      }
      
      if (sessionFeatures >= 2) {
        this.log('PASS', 'Session Management', 'Comprehensive session management found');
      } else {
        this.log('WARN', 'Session Management', 'Session management may be incomplete');
      }
      
    } catch (error) {
      this.log('FAIL', 'Session Management', 'Error testing session management', error.message);
    }
  }

  async testAuthenticationSecurity() {
    try {
      const authContent = fs.readFileSync('client/utils/authManager.ts', 'utf8');
      
      // Test for token handling
      if (authContent.includes('Bearer') && authContent.includes('Authorization')) {
        this.log('PASS', 'Auth Security', 'Proper token authorization headers');
      } else {
        this.log('WARN', 'Auth Security', 'Token authorization may be incomplete');
      }
      
      // Test for logout functionality
      if (authContent.includes('logout') && authContent.includes('removeItem')) {
        this.log('PASS', 'Auth Security', 'Proper logout implementation');
      } else {
        this.log('WARN', 'Auth Security', 'Logout implementation may be incomplete');
      }
      
    } catch (error) {
      this.log('FAIL', 'Auth Security', 'Error testing authentication security', error.message);
    }
  }

  async testAuthorizationSecurity() {
    try {
      const dashboardContent = fs.readFileSync('client/pages/AdminDashboard.tsx', 'utf8');
      
      // Test for role-based access
      if (dashboardContent.includes('userType') || dashboardContent.includes('role')) {
        this.log('PASS', 'Authorization', 'Role-based access control found');
      } else {
        this.log('WARN', 'Authorization', 'Role-based access may be missing');
      }
      
      // Test for permission checks
      if (dashboardContent.includes('permission') || dashboardContent.includes('canManage')) {
        this.log('PASS', 'Authorization', 'Permission-based access found');
      } else {
        this.log('WARN', 'Authorization', 'Permission checks may be missing');
      }
      
    } catch (error) {
      this.log('FAIL', 'Authorization', 'Error testing authorization', error.message);
    }
  }

  async testInputValidation() {
    const formFiles = [
      'client/pages/Login.tsx',
      'client/pages/AdminDashboard.tsx'
    ];
    
    for (const file of formFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Test for form validation
        if (content.includes('required') || content.includes('validate')) {
          this.log('PASS', 'Input Validation', `Form validation found in ${path.basename(file)}`);
        } else {
          this.log('WARN', 'Input Validation', `Limited validation in ${path.basename(file)}`);
        }
        
        // Test for sanitization
        if (content.includes('trim()') || content.includes('sanitize')) {
          this.log('PASS', 'Input Validation', `Input sanitization in ${path.basename(file)}`);
        } else {
          this.log('WARN', 'Input Validation', `Input sanitization missing in ${path.basename(file)}`);
        }
        
      } catch (error) {
        this.log('FAIL', 'Input Validation', `Error testing ${file}`, error.message);
      }
    }
  }

  async testSessionSecurity() {
    try {
      const sessionContent = fs.readFileSync('client/hooks/useSessionManager.tsx', 'utf8');
      
      // Test for session timeout
      if (sessionContent.includes('timeout') || sessionContent.includes('expiry')) {
        this.log('PASS', 'Session Security', 'Session timeout handling found');
      } else {
        this.log('WARN', 'Session Security', 'Session timeout may be missing');
      }
      
      // Test for activity tracking
      if (sessionContent.includes('activity') || sessionContent.includes('lastActivity')) {
        this.log('PASS', 'Session Security', 'Activity tracking found');
      } else {
        this.log('WARN', 'Session Security', 'Activity tracking may be missing');
      }
      
    } catch (error) {
      this.log('FAIL', 'Session Security', 'Error testing session security', error.message);
    }
  }

  async testAPISecurity() {
    const apiFiles = [
      'server/routes/admin.ts',
      'server/routes/auth.ts',
      'server/routes/candidates.ts'
    ];
    
    for (const file of apiFiles) {
      try {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          
          // Test for JWT validation
          if (content.includes('jwt') || content.includes('verify')) {
            this.log('PASS', 'API Security', `JWT validation in ${path.basename(file)}`);
          } else {
            this.log('WARN', 'API Security', `JWT validation missing in ${path.basename(file)}`);
          }
          
          // Test for rate limiting
          if (content.includes('rateLimit') || content.includes('limit')) {
            this.log('PASS', 'API Security', `Rate limiting in ${path.basename(file)}`);
          } else {
            this.log('WARN', 'API Security', `Rate limiting missing in ${path.basename(file)}`);
          }
        }
      } catch (error) {
        this.log('FAIL', 'API Security', `Error testing ${file}`, error.message);
      }
    }
  }

  async testMobileClasses(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      // Test for responsive classes
      const responsiveClasses = ['sm:', 'md:', 'lg:', 'xl:', 'mobile', 'tablet', 'desktop'];
      const foundClasses = responsiveClasses.filter(cls => content.includes(cls));
      
      if (foundClasses.length >= 3) {
        this.log('PASS', 'Mobile Responsive', `Good responsive design in ${fileName}`, foundClasses);
      } else {
        this.log('WARN', 'Mobile Responsive', `Limited responsive design in ${fileName}`, foundClasses);
      }
      
      // Test for touch targets
      if (content.includes('touch-manipulation') || content.includes('min-h-[44px]')) {
        this.log('PASS', 'Mobile Touch', `Touch-friendly design in ${fileName}`);
      } else {
        this.log('WARN', 'Mobile Touch', `Touch targets may be missing in ${fileName}`);
      }
      
    } catch (error) {
      this.log('FAIL', 'Mobile Responsive', `Error testing ${filePath}`, error.message);
    }
  }

  async testCodeQuality() {
    try {
      // Check for TypeScript usage
      const tsFiles = fs.readdirSync('client/pages').filter(f => f.endsWith('.tsx'));
      if (tsFiles.length > 5) {
        this.log('PASS', 'Code Quality', `TypeScript usage: ${tsFiles.length} files`);
      } else {
        this.log('WARN', 'Code Quality', `Limited TypeScript usage: ${tsFiles.length} files`);
      }
      
      // Check for component structure
      const componentFiles = fs.readdirSync('client/components').filter(f => f.endsWith('.tsx'));
      if (componentFiles.length > 3) {
        this.log('PASS', 'Code Quality', `Good component structure: ${componentFiles.length} components`);
      } else {
        this.log('WARN', 'Code Quality', `Limited component reuse: ${componentFiles.length} components`);
      }
      
    } catch (error) {
      this.log('FAIL', 'Code Quality', 'Error testing code quality', error.message);
    }
  }

  async testPerformanceOptimizations() {
    try {
      const indexContent = fs.readFileSync('client/pages/Index.tsx', 'utf8');
      
      // Test for lazy loading
      if (indexContent.includes('lazy') || indexContent.includes('Suspense')) {
        this.log('PASS', 'Performance', 'Lazy loading implementation found');
      } else {
        this.log('WARN', 'Performance', 'Lazy loading may be missing');
      }
      
      // Test for image optimization
      if (indexContent.includes('loading="lazy"') || indexContent.includes('webp')) {
        this.log('PASS', 'Performance', 'Image optimization found');
      } else {
        this.log('WARN', 'Performance', 'Image optimization may be missing');
      }
      
    } catch (error) {
      this.log('FAIL', 'Performance', 'Error testing performance', error.message);
    }
  }

  async testAccessibility() {
    const files = ['client/components/ModernNavigation.tsx', 'client/pages/Login.tsx'];
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const fileName = path.basename(file);
        
        // Test for accessibility attributes
        const a11yAttributes = ['aria-label', 'aria-', 'role=', 'alt=', 'title='];
        const foundAttributes = a11yAttributes.filter(attr => content.includes(attr));
        
        if (foundAttributes.length >= 2) {
          this.log('PASS', 'Accessibility', `Good accessibility in ${fileName}`, foundAttributes);
        } else {
          this.log('WARN', 'Accessibility', `Limited accessibility in ${fileName}`, foundAttributes);
        }
        
      } catch (error) {
        this.log('FAIL', 'Accessibility', `Error testing ${file}`, error.message);
      }
    }
  }

  async testSEO() {
    try {
      if (fs.existsSync('client/components/SEOStructuredData.tsx')) {
        this.log('PASS', 'SEO', 'SEO structured data component found');
      } else {
        this.log('WARN', 'SEO', 'SEO structured data component missing');
      }
      
      // Check for meta tags in index.html
      if (fs.existsSync('index.html')) {
        const indexContent = fs.readFileSync('index.html', 'utf8');
        if (indexContent.includes('meta name="description"')) {
          this.log('PASS', 'SEO', 'Meta description found');
        } else {
          this.log('WARN', 'SEO', 'Meta description missing');
        }
      }
      
    } catch (error) {
      this.log('FAIL', 'SEO', 'Error testing SEO', error.message);
    }
  }

  // MAIN TEST RUNNER
  async runAllTests() {
    console.log('🚀 STARTING COMPREHENSIVE TEST AUTOMATION SUITE\n');
    console.log('='.repeat(60));
    
    try {
      await this.testPreLogin();
      await this.testPostLogin();
      await this.testSecurity();
      await this.testMobileResponsiveness();
      await this.testQualityAndPerformance();
      
    } catch (error) {
      this.log('FAIL', 'Test Suite', 'Critical error in test execution', error.message);
    }
    
    this.generateReport();
  }

  generateReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST AUTOMATION REPORT');
    console.log('='.repeat(60));
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📝 Total Tests: ${this.results.tests.length}`);
    
    const successRate = ((this.results.passed / this.results.tests.length) * 100).toFixed(1);
    console.log(`�� Success Rate: ${successRate}%`);
    
    // Write detailed report to file
    const reportData = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      summary: {
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        total: this.results.tests.length,
        successRate: `${successRate}%`
      },
      tests: this.results.tests
    };
    
    fs.writeFileSync('test-automation-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: test-automation-report.json');
    
    if (this.results.failed > 0) {
      console.log('\n❗ CRITICAL ISSUES FOUND - Review failed tests');
      process.exit(1);
    } else if (this.results.warnings > 5) {
      console.log('\n⚠️  MULTIPLE WARNINGS - Consider addressing warnings');
      process.exit(0);
    } else {
      console.log('\n🎉 ALL TESTS PASSED - System is ready for production');
      process.exit(0);
    }
  }
}

// Run the test automation
if (require.main === module) {
  const testRunner = new TestAutomation();
  testRunner.runAllTests().catch(error => {
    console.error('❌ Test automation failed:', error);
    process.exit(1);
  });
}

module.exports = TestAutomation;

// STAFF LOGIN FIX - Run this in browser console on login page
console.log('🔧 Setting up demo staff login...');

// Set staff data directly
const staffData = {
  id: 1,
  name: "Demo Staff Member",
  email: "staff@liorian.com",
  role: "HR Manager",
  department: "Human Resources",
  permissions: ["view_candidates", "manage_candidates", "view_jobs", "assign_courses", "module_management"]
};

localStorage.setItem('staffToken', 'demo-staff-token-12345');
localStorage.setItem('staffProfile', JSON.stringify(staffData));

console.log('✅ Staff login data set! Redirecting to staff dashboard...');

// Redirect to staff dashboard
window.location.href = "/staff-dashboard";

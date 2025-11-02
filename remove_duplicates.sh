#!/bin/bash

# Remove duplicate login files
echo "Removing duplicate login files..."
rm -f client/pages/ExperimentalLogin.tsx
rm -f client/pages/LoginCredentials.tsx  
rm -f client/pages/LoginTest.tsx

# Remove duplicate dashboard files
echo "Removing duplicate dashboard files..."
rm -f client/pages/EnhancedCandidateDashboard.tsx
rm -f client/pages/TrainingDashboard.tsx
rm -f client/pages/CandidateTrainingDashboard.tsx
rm -f client/pages/DashboardDirectory.tsx

# Remove backup files
echo "Removing backup files..."
rm -f client/pages/*-backup.tsx
rm -f client/pages/*backup.tsx
rm -f client/pages/*old.tsx

# Remove any other test files
echo "Removing test files..."
rm -f client/components/*test*
rm -f client/utils/*test*

echo "✅ Duplicate files removed successfully!"
echo "📋 Remaining important files:"
ls client/pages/Login.tsx client/pages/AdminDashboard.tsx client/pages/StaffDashboard.tsx client/pages/CandidateDashboard.tsx 2>/dev/null || echo "Some main files missing"

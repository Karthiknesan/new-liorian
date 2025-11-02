#!/usr/bin/env node

/**
 * Script to generate bcrypt password hashes for secure deployment
 * Usage: node generate-password-hashes.js
 */

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const defaultPasswords = {
  admin: 'admin123',
  hr: 'hr123',
  placement: 'placement123',
  training: 'training123',
  candidate1: 'john123',
  candidate2: 'sarah123',
  candidate3: 'mike123'
};

async function generateHashes() {
  console.log('🔐 Generating secure password hashes...\n');
  
  for (const [role, password] of Object.entries(defaultPasswords)) {
    try {
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      console.log(`${role.toUpperCase()}_PASSWORD_HASH="${hash}"`);
    } catch (error) {
      console.error(`❌ Error generating hash for ${role}:`, error.message);
    }
  }
  
  console.log('\n✅ Password hashes generated successfully!');
  console.log('\n📝 Add these to your .env file or environment variables');
  console.log('⚠️  Remember to change the default passwords in production!');
  console.log('\n🔑 Generate a strong JWT secret:');
  console.log(`JWT_SECRET="${require('crypto').randomBytes(64).toString('hex')}"`);
}

// Only run if called directly
if (require.main === module) {
  generateHashes().catch(console.error);
}

module.exports = { generateHashes };

// test-database-connection.js
// -----------------------------------------------------------
// Test script to verify backend API connectivity and database integration
// -----------------------------------------------------------

const fetch = require('node-fetch')

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181'

let jwtToken = null;

async function fetchToken() {
  if (jwtToken) return jwtToken;
  const response = await fetch(`${BACKEND_URL}/api/admin/login_check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin@oloy.com', password: 'admin123' })
  });
  if (!response.ok) throw new Error('Failed to login for JWT token');
  const data = await response.json();
  if (!data.token) throw new Error('No token in login response');
  jwtToken = data.token;
  return jwtToken;
}

async function fetchWithAuth(url, options = {}) {
  const token = await fetchToken();
  options.headers = options.headers || {};
  options.headers['Authorization'] = `Bearer ${token}`;
  return fetch(url, options);
}

async function testMembersAPI() {
  console.log('\n👥 Testing Members API...')
  try {
    const response = await fetchWithAuth(`${BACKEND_URL}/api/customer?page=1&perPage=5`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Members API is working');
      console.log(`   📊 Found ${data.total || 0} total members`);
      console.log(`   📄 Showing ${data.customers?.length || 0} members on page 1`);
      if (data.customers && data.customers.length > 0) {
        const member = data.customers[0];
        console.log(`   👤 Sample member: ${member.firstName} ${member.lastName} (${member.points} points)`);
      }
    } else {
      console.log(`⚠️  Members API responded with status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Members API test failed:', error.message);
    return false;
  }
}

async function testTransfersAPI() {
  console.log('\n💸 Testing Transfers API...')
  try {
    const response = await fetchWithAuth(`${BACKEND_URL}/api/transaction?page=1&perPage=5`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Transfers API is working');
      console.log(`   📊 Found ${data.total || 0} total transactions`);
      console.log(`   📄 Showing ${data.transactions?.length || 0} transactions on page 1`);
      if (data.transactions && data.transactions.length > 0) {
        const transaction = data.transactions[0];
        console.log(`   💰 Sample transaction: ${transaction.amount} points`);
      }
    } else {
      console.log(`⚠️  Transfers API responded with status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Transfers API test failed:', error.message);
    return false;
  }
}

async function testAnalyticsAPI() {
  console.log('\n📈 Testing Analytics API...')
  try {
    const response = await fetchWithAuth(`${BACKEND_URL}/api/analytics`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Analytics API is working');
      console.log(`   👥 Total members: ${data.totalMembers || 0}`);
      console.log(`   💰 Total points circulating: ${data.totalPointsCirculating || 0}`);
      console.log(`   📊 Average points per member: ${data.averagePoints || 0}`);
      if (data.tierDistribution) {
        console.log('   🏆 Tier distribution:');
        Object.entries(data.tierDistribution).forEach(([tier, count]) => {
          console.log(`      ${tier}: ${count} members`);
        });
      }
    } else {
      console.log(`⚠️  Analytics API responded with status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Analytics API test failed:', error.message);
    return false;
  }
}

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check API...')
  try {
    const response = await fetchWithAuth(`${BACKEND_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Health check API is working');
      console.log(`   🗄️  Database: ${data.database?.status || 'unknown'}`);
      console.log(`   🔗 Backend: ${data.backend?.status || 'unknown'}`);
      console.log(`   ⏱️  Response time: ${data.responseTime || 'unknown'}ms`);
    } else {
      console.log(`⚠️  Health check API responded with status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Health check API test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Backend API and Database Integration Tests...\n')
  
  const tests = [
    { name: 'Members API', fn: testMembersAPI },
    { name: 'Transfers API', fn: testTransfersAPI },
    { name: 'Analytics API', fn: testAnalyticsAPI },
    { name: 'Health Check', fn: testHealthCheck }
  ]
  
  const results = []
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`🧪 Running: ${test.name}`)
    console.log(`${'='.repeat(50)}`)
    
    const result = await test.fn()
    results.push({ name: test.name, passed: result })
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📋 TEST RESULTS SUMMARY')
  console.log('='.repeat(50))
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL'
    console.log(`${status} ${result.name}`)
  })
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`)
  
  if (passed === total) {
    console.log('🎉 All tests passed! Backend API and database integration is working correctly.')
  } else {
    console.log('⚠️  Some tests failed. Please check the backend API and database configuration.')
  }
  
  return passed === total
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Test execution failed:', error)
      process.exit(1)
    })
}

module.exports = {
  testMembersAPI,
  testTransfersAPI,
  testAnalyticsAPI,
  testHealthCheck,
  runAllTests
} 
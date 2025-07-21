// Test script to verify backend connectivity
const fetch = require('node-fetch');

async function testBackendConnection() {
  const backendUrl = 'http://localhost:8181';
  
  console.log('🔍 Testing backend connection...');
  
  try {
    // Test 1: Check if backend is reachable
    console.log('\n1. Testing basic connectivity...');
    const healthResponse = await fetch(`${backendUrl}/api/health`);
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health check response:', healthData);
    }
    
    // Test 2: Try to access customer endpoint without auth
    console.log('\n2. Testing customer endpoint without authentication...');
    const customerResponse = await fetch(`${backendUrl}/api/customer?page=1&perPage=10`);
    console.log('Customer endpoint status:', customerResponse.status);
    
    if (!customerResponse.ok) {
      const errorData = await customerResponse.json();
      console.log('Expected auth error:', errorData);
    }
    
    // Test 3: Try admin login
    console.log('\n3. Testing admin login...');
    const loginResponse = await fetch(`${backendUrl}/api/admin/login_check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@oloy.com',
        password: 'admin123'
      })
    });
    
    console.log('Login status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('Login successful, token received:', !!loginData.token);
      
      // Test 4: Try to access customer endpoint with auth
      console.log('\n4. Testing customer endpoint with authentication...');
      const authCustomerResponse = await fetch(`${backendUrl}/api/customer?page=1&perPage=10`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Authenticated customer endpoint status:', authCustomerResponse.status);
      
      if (authCustomerResponse.ok) {
        const customerData = await authCustomerResponse.json();
        console.log('Customer data received:', {
          total: customerData.total,
          customersCount: customerData.customers?.length || 0
        });
      } else {
        const errorData = await authCustomerResponse.json();
        console.log('Auth error:', errorData);
      }
    } else {
      const errorData = await loginResponse.json();
      console.log('Login failed:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testBackendConnection(); 
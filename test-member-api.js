// Test script to debug member API issues
const fetch = require('node-fetch');

async function testMemberAPI() {
  console.log('🧪 Testing member API endpoints...\n');
  
  try {
    // Test 1: Create a new member
    console.log('1️⃣ Testing POST /api/admin/members (Create member)...');
    const createResponse = await fetch('http://localhost:3000/api/admin/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+1-555-0123',
        dateOfBirth: null,
        gender: 'male',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'United States'
        },
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '+1-555-0124',
          relationship: 'Friend'
        },
        preferences: {
          marketingEmails: true,
          smsNotifications: false,
          newsletter: true
        }
      }),
    });
    
    console.log('📡 Create response status:', createResponse.status);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Member created successfully:', createData);
      
      // Test 2: Get the created member
      console.log('\n2️⃣ Testing GET /api/admin/members/[id] (Get member)...');
      const memberId = createData.member?.id || 'demo-customer-002';
      const getResponse = await fetch(`http://localhost:3000/api/admin/members/${memberId}`);
      
      console.log('📡 Get response status:', getResponse.status);
      
      if (getResponse.ok) {
        const getData = await getResponse.json();
        console.log('✅ Member retrieved successfully:', getData);
        
        // Test 3: Update the member
        console.log('\n3️⃣ Testing PUT /api/admin/members/[id] (Update member)...');
        const updateResponse = await fetch(`http://localhost:3000/api/admin/members/${memberId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: 'Updated',
            lastName: 'User',
            email: 'updated@example.com',
            phone: '+1-555-0125',
            dateOfBirth: null,
            gender: 'female',
            address: {
              street: '456 Updated St',
              city: 'Updated City',
              state: 'US',
              zipCode: '54321',
              country: 'United States'
            },
            emergencyContact: {
              name: 'Updated Contact',
              phone: '+1-555-0126',
              relationship: 'Spouse'
            },
            preferences: {
              marketingEmails: false,
              smsNotifications: true,
              newsletter: false
            }
          }),
        });
        
        console.log('📡 Update response status:', updateResponse.status);
        
        if (updateResponse.ok) {
          const updateData = await updateResponse.json();
          console.log('✅ Member updated successfully:', updateData);
        } else {
          const errorData = await updateResponse.json().catch(() => ({}));
          console.log('❌ Update failed:', errorData);
        }
        
      } else {
        const errorData = await getResponse.json().catch(() => ({}));
        console.log('❌ Get failed:', errorData);
      }
      
    } else {
      const errorData = await createResponse.json().catch(() => ({}));
      console.log('❌ Create failed:', errorData);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testMemberAPI(); 
// test-partners-api.js
// Simple test to verify the partners API endpoint

const testPartnersAPI = async () => {
  console.log('🧪 Testing Partners API...')
  
  try {
    // Test basic GET request
    const response = await fetch('http://localhost:3000/api/admin/partners?page=1&limit=5')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    console.log('✅ API Response:')
    console.log('   Status:', response.status)
    console.log('   Partners count:', data.partners?.length || 0)
    console.log('   Total:', data.total || 0)
    console.log('   Page:', data.page || 0)
    console.log('   Total Pages:', data.totalPages || 0)
    
    if (data.partners && data.partners.length > 0) {
      console.log('\n📋 Sample Partner:')
      console.log('   Name:', data.partners[0].name)
      console.log('   Business Type:', data.partners[0].businessType)
      console.log('   Status:', data.partners[0].status)
    }
    
    console.log('\n🎉 Partners API is working correctly!')
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message)
    console.log('\n💡 Make sure the development server is running with: npm run dev')
  }
}

// Run the test
testPartnersAPI() 
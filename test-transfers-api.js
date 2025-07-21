// test-transfers-api.js
// -----------------------------------------------------------
// Test script for transfers API endpoints
// -----------------------------------------------------------

const BASE_URL = 'http://localhost:3000'

async function testTransfersAPI() {
  console.log('🧪 Testing Transfers API...\n')

  try {
    // Test 1: Get transfers (should return empty initially)
    console.log('1️⃣ Testing GET /api/admin/transfers...')
    const getResponse = await fetch(`${BASE_URL}/api/admin/transfers`)
    const getData = await getResponse.json()
    
    if (getResponse.ok) {
      console.log('✅ GET /api/admin/transfers - Success')
      console.log(`   📊 Found ${getData.total} transfers`)
      console.log(`   📈 Stats: ${getData.stats.totalTransfers} total, ${getData.stats.totalPointsTransferred} points transferred`)
    } else {
      console.log('❌ GET /api/admin/transfers - Failed:', getData.message)
    }

    // Test 2: Execute a transfer (system to member)
    console.log('\n2️⃣ Testing POST /api/admin/transfers (system to member)...')
    const transferResponse = await fetch(`${BASE_URL}/api/admin/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromMemberId: 'system',
        toMemberId: 'member-1',
        points: 500,
        reason: 'Welcome bonus',
        adminName: 'Test Admin'
      })
    })
    const transferData = await transferResponse.json()
    
    if (transferResponse.ok) {
      console.log('✅ POST /api/admin/transfers - Success')
      console.log(`   💰 Transfer ID: ${transferData.transfer.id}`)
      console.log(`   📝 Reference: ${transferData.transfer.reference}`)
    } else {
      console.log('❌ POST /api/admin/transfers - Failed:', transferData.message)
    }

    // Test 3: Execute another transfer (member to member)
    console.log('\n3️⃣ Testing POST /api/admin/transfers (member to member)...')
    const memberTransferResponse = await fetch(`${BASE_URL}/api/admin/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromMemberId: 'member-1',
        toMemberId: 'member-2',
        points: 100,
        reason: 'Gift transfer',
        adminName: 'Test Admin'
      })
    })
    const memberTransferData = await memberTransferResponse.json()
    
    if (memberTransferResponse.ok) {
      console.log('✅ POST /api/admin/transfers (member to member) - Success')
      console.log(`   💰 Transfer ID: ${memberTransferData.transfer.id}`)
    } else {
      console.log('❌ POST /api/admin/transfers (member to member) - Failed:', memberTransferData.message)
    }

    // Test 4: Bulk operation (add points to multiple members)
    console.log('\n4️⃣ Testing POST /api/admin/transfers/bulk (add points)...')
    const bulkResponse = await fetch(`${BASE_URL}/api/admin/transfers/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'add',
        points: 200,
        reason: 'Monthly bonus',
        memberIds: ['member-1', 'member-2', 'member-3'],
        adminName: 'Test Admin'
      })
    })
    const bulkData = await bulkResponse.json()
    
    if (bulkResponse.ok) {
      console.log('✅ POST /api/admin/transfers/bulk - Success')
      console.log(`   📊 Processed: ${bulkData.summary.totalProcessed}`)
      console.log(`   ✅ Successful: ${bulkData.summary.successful}`)
      console.log(`   ❌ Failed: ${bulkData.summary.failed}`)
    } else {
      console.log('❌ POST /api/admin/transfers/bulk - Failed:', bulkData.message)
    }

    // Test 5: Get updated transfers list
    console.log('\n5️⃣ Testing GET /api/admin/transfers (after transfers)...')
    const finalGetResponse = await fetch(`${BASE_URL}/api/admin/transfers`)
    const finalGetData = await finalGetResponse.json()
    
    if (finalGetResponse.ok) {
      console.log('✅ GET /api/admin/transfers - Success')
      console.log(`   📊 Total transfers: ${finalGetData.total}`)
      console.log(`   📈 Total points transferred: ${finalGetData.stats.totalPointsTransferred}`)
      console.log(`   🎯 Success rate: ${Math.round((finalGetData.stats.completedTransfers / finalGetData.stats.totalTransfers) * 100)}%`)
      
      if (finalGetData.transfers.length > 0) {
        console.log('\n   📋 Recent transfers:')
        finalGetData.transfers.slice(0, 3).forEach((transfer, index) => {
          console.log(`      ${index + 1}. ${transfer.fromMemberName} → ${transfer.toMemberName} (${transfer.points} pts)`)
        })
      }
    } else {
      console.log('❌ GET /api/admin/transfers - Failed:', finalGetData.message)
    }

    console.log('\n🎉 Transfers API test completed!')

  } catch (error) {
    console.error('💥 Test failed:', error.message)
  }
}

// Run the test
testTransfersAPI() 
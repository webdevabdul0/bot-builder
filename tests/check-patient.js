const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY1LCJvcmdJZCI6NDYsInJvbGVJZCI6OCwiaWF0IjoxNzYzMDM2NjM3fQ.ixxc-1U7J_V94SYJOdPbZLzt7t9jE4vOeRpId6_2UCo';
const API_BASE = 'https://dev.flossly.ai/api';

// Check if we can get patient by ID
async function checkPatient(patientId) {
  console.log(`\n🔍 Checking if patient ${patientId} exists...`);
  
  try {
    const response = await fetch(`${API_BASE}/diary/patient/${patientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// List all patients
async function listPatients() {
  console.log(`\n📋 Listing all patients for organization...`);
  
  try {
    const response = await fetch(`${API_BASE}/diary/patients`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Test creating another patient with different email
async function createTestPatient() {
  console.log(`\n➕ Creating test patient...`);
  
  const patientData = {
    firstName: "Test",
    lastName: "Patient",
    email: `test${Date.now()}@example.com`,
    mobile: "+1234567890"
  };
  
  try {
    const response = await fetch(`${API_BASE}/diary/patientCreate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    });
    
    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function runChecks() {
  console.log('🔍 Checking Patient Creation...\n');
  
  // Check patient ID 10
  await checkPatient(10);
  
  // List all patients
  await listPatients();
  
  // Create a new test patient
  await createTestPatient();
}

runChecks();

// Placeholder API functions for admin client/batch management

export async function createClient(data) {
  // Simulate API call
  return new Promise((resolve) => setTimeout(() => resolve({ success: true, companyId: data.companyId }), 500));
}

export async function updateClientStatus(clientId, status) {
  // Simulate API call
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
}

export async function sendInviteEmail(email, companyId) {
  // Simulate API call
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
}

export async function registerContact(data) {
  // Simulate API call
  return new Promise((resolve) => setTimeout(() => resolve({ success: true, contactId: data.contactId }), 500));
}

export async function schedulePickup(data) {
  // Simulate API call
  return new Promise((resolve) => setTimeout(() => resolve({ success: true, batchId: data.batchId }), 500));
}

export async function generateBatchID(params) {
  // Simulate API call
  return new Promise((resolve) => setTimeout(() => resolve({ success: true, batchId: params.batchId }), 500));
}

export async function getInventoryMetrics(companyId) {
  // Simulate API call
  return new Promise((resolve) => setTimeout(() => resolve({
    companyId,
    metrics: {
      contacts: [
        { contactId: 'GE-1-GE Aviation-Cincy', name: 'Jessica Shoomer', lbs: 1900 },
        { contactId: 'GE-1-GE Aviation-Cincy', name: 'Heather Kane', lbs: 300 },
        { contactId: 'GE-1-GE Global-Cincy', name: 'Brian Fox', lbs: 1000 },
        { contactId: 'GE-1-GE Aerospace-WestChester', name: 'Leo Bringas', lbs: 2100 },
      ],
      departments: [
        { department: 'GE Aviation', lbs: 2600 },
        { department: 'GE Global', lbs: 1000 },
        { department: 'GE Aerospace', lbs: 2100 },
      ],
      branches: [
        { branch: 'Cincy', lbs: 2200 },
        { branch: 'WestChester', lbs: 2100 },
      ],
      companyTotal: 5700,
    },
  }), 500));
}

export async function getCompanyContacts(companyId) {
  // Simulate API call
  return new Promise((resolve) => setTimeout(() => resolve({
    companyId,
    contacts: [
      { contactId: 'GE-1-GE Aviation-Cincy', name: 'Jessica Shoomer', title: 'IT Director', email: 'jessica@ge.com', phone: '555-1234', department: 'GE Aviation', location: 'Cincy', address: '1 Neumann Way' },
      { contactId: 'GE-1-GE Aviation-Cincy', name: 'Heather Kane', title: 'IT Head', email: 'heather@ge.com', phone: '555-5678', department: 'GE Aviation', location: 'Cincy', address: '1 Neumann Way' },
      { contactId: 'GE-1-GE Global-Cincy', name: 'Brian Fox', title: 'Manager', email: 'brian@ge.com', phone: '555-8765', department: 'GE Global', location: 'Cincy', address: '2 Main St' },
      { contactId: 'GE-1-GE Aerospace-WestChester', name: 'Leo Bringas', title: 'Lead', email: 'leo@ge.com', phone: '555-4321', department: 'GE Aerospace', location: 'WestChester', address: '3 West Ave' },
    ],
  }), 500));
}

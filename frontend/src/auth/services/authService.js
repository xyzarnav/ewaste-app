// Dummy authentication service for frontend integration

export async function handleLogin(role, credentials) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (credentials.username && credentials.password) {
        resolve({ success: true, role });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
}

export async function handleRegister(role, credentials) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Check your email to confirm registration' });
    }, 500);
  });
}

export async function handleForgotPassword(email) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Thank you! An email has been sent' });
    }, 500);
  });
}

export async function handleOAuthLogin(provider, role) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, provider, role });
    }, 500);
  });
}

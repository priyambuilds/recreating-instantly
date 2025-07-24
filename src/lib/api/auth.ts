interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await fetch('http://localhost:8000/user/login', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to login');
  }

  const data = await response.json();
  
  // Store the token in cookies
  document.cookie = `access_token=${data.access_token}; path=/; secure; samesite=strict`;
  
  return data;
}

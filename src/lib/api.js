const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, { token, ...options } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = Array.isArray(data?.detail)
      ? data.detail.map((d) => d.msg).join(', ')
      : data?.detail || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export const api = {
  signup: (email, password, displayName) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name: displayName }),
    }),
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  googleAuth: (idToken) =>
    request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    }),
  me: (token) => request('/auth/me', { token }),
  listChats: (token) => request('/chats', { token }),
  createChat: (token, title) =>
    request('/chats', { method: 'POST', token, body: JSON.stringify({ title }) }),
};

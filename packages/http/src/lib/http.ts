import fetch, { RequestInit } from 'node-fetch';

const API_URL = 'https://discord.com/api/v9';

async function requestWithAuth<R>(
  token: string,
  method: string,
  path: string,
  options?: RequestInit
): Promise<R> {
  const response = await fetch(`${API_URL}/${path}`, {
    method,
    headers: {
      Authorization: `Bot ${token}`,
    },
    ...options,
  });
  return response.json();
}

export function get<R>(token: string, path: string) {
  return requestWithAuth<R>(token, 'GET', path);
}

export function post<R, B>(token: string, path: string, body: B) {
  return requestWithAuth<R>(token, 'POST', path, {
    body: JSON.stringify(body),
  });
}

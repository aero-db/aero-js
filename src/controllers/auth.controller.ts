import type AeroClient from '../AeroClient';

/**
 * Return the current session
 * @param client
 * @returns
 */
export async function handleGetCurrentSession(client: AeroClient): Promise<any> {
  const res = await client.apiInstance.get('auth/me');
  return res.data;
}

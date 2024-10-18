import { AxiosInstance } from 'axios';
import { APIQueryParameters, ApiResource } from '../types/Api.type';

/**
 * Handle an API request
 *
 * Return data format must tbe specified manually
 *
 * @param method HTTP method
 * @param url API endpoint
 * @param parameters Query parameters
 * @param instance Axios instance
 * @returns API response
 */
export async function handleApiRequest<T extends ApiResource>(
  method: 'POST' | 'GET' | 'PATCH' | 'DELETE',
  url: string,
  parameters: APIQueryParameters<T> = {},
  instance: AxiosInstance
) {
  const parsedParameters: any = {
    ...parameters,
  };

  if (parameters.filter) {
    try {
      parsedParameters.filter = JSON.stringify(parameters.filter);
    } catch (error) {
      throw new Error('Failed to parse filter');
    }
  }

  return (
    await instance.request({
      method,
      url,
      params: parsedParameters,
    })
  ).data;
}

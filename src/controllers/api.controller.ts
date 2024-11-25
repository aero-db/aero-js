import { AxiosInstance } from 'axios';

import { APIQueryParameters, APIResource } from '..';

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
export async function handleApiRequest<T extends APIResource>(
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

  if (parameters.sort) {
    try {
      parsedParameters.sort = JSON.stringify(parameters.sort);
    } catch (error) {
      throw new Error('Failed to parse sort');
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

import { type AxiosResponse, type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import { parseAPIError } from '../utils/error.utils';
import { API_RETRY_FLAG_HEADER, REFRESH_TOKEN_KEY } from '../constants';
import store from 'store2';
import { handleLogout, handleRenewToken } from './auth.controller';
import type AeroClient from '../AeroClient';
import { type HiveResource } from '../types/resources/Resource.type';
import { type HiveAPIQueryParameters } from '../types/APIQueryParameters.type';
import { getDashboardUrlFromApiUrl } from '../utils/commons.utils';
/**
 * Send a request to the Hive API and handle some various cases
 * @param method
 * @param table
 * @param filters
 * @param modifiers
 * @param axiosInstance
 * @param onFulfill
 * @param additionalData Form data to send with the request, invoqued before the modifiers and filters
 */
export async function handleAPIRequest<T extends HiveResource>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  url: string,
  axiosInstance: AxiosInstance,
  params?: HiveAPIQueryParameters<T>,
  additionalData?: any
): Promise<any> {
  // **NOTE**
  // For some reason we needs to build the data object in this way
  // otherwise there seems to be an issue with the compilation
  let data = {
    ...params,
    ...additionalData,
  };

  // set the filters
  if (params?.filters !== undefined) {
    data.filter = params?.filters;
    delete data.filters; // remove reused filters key to prevent conflicts
  }

  // IF method is GET, we need to encode the data as a query string
  // This is required due to a weird behaviour after the JS compilation
  if (method === 'GET') {
    url += `?body=${btoa(JSON.stringify(data))}`;
    data = undefined; // unset data to prevent params conflicts
  }

  const res = await axiosInstance({
    method,
    url,
    data,
  });

  return res.data;
}

/**
 * Handle API errors and some special cases
 *
 * Tries to renew the token if possible
 *
 * @param error
 * @param axiosInstance
 * @returns
 */
export async function handleAPIError(error: AxiosError, client: AeroClient): Promise<AxiosResponse<any>> {
  if (queryIsARetry()) {
    return await Promise.reject(parseAPIError(error));
  }

  const refreshToken = store.get(REFRESH_TOKEN_KEY);
  const parsedError = parseAPIError(error);

  /**
   * Handle invalid instance error
   * If the apiUrl is available, set the new base url and retry the request
   * If the apiUrl is not available, throw the error
   */
  if (parsedError.type === 'invalidInstance') {
    if (parsedError.details.apiUrl === undefined) {
      // If the apiUrl is not available, throw the error
      return await Promise.reject(parsedError);
    }

    // Set the new base url if provided in the response
    client.apiInstance.defaults.baseURL = parsedError.details.apiUrl;
    client.apiUrl = parsedError.details.apiUrl;
    client.dashboardUrl = getDashboardUrlFromApiUrl(String(parsedError.details.apiUrl));

    // Additonally to the instance, we still needs to update the returned config
    if (error.config !== undefined) {
      error.config.baseURL = parsedError.details.apiUrl;
    }

    // We add a flag to instance to indicate that the token has been renewed
    // If this flag is intercepted, it will just throw the error to prevent an infinite loop
    store.set(API_RETRY_FLAG_HEADER, 1);
    // Retry the request
    return await client.apiInstance(error.config as AxiosRequestConfig<any>);

    // Example invalid instance response
    //   {
    //     "error": {
    //         "name": "CustomError",
    //         "type": "invalidInstance",
    //         "errorCode": 76,
    //         "readable": "redirect to https://dev-validation.hive-zox.com/api/v1",
    //         "details": {
    //             "error": "redirect",
    //             "apiUrl": "https://dev-validation.hive-zox.com/api/v1"
    //         }
    //     }
    // }
  }

  /**
   * Handle invalid token error
   * If the refresh token is available, try to renew the token
   * If the token is renewed, retry the request
   * If the token is not renewed, throw the error
   */
  if (parsedError.type === 'invalidToken') {
    // If the refresh token is not available, throw the error
    if (refreshToken === undefined || refreshToken === null || refreshToken.indexOf('null') !== -1) {
      return await Promise.reject(parsedError);
    }

    // We add a flag to the instance to indicate that the token has been renewed
    // If this header is intercepted, it will just throw the error to prevent an infinite loop
    store.set(API_RETRY_FLAG_HEADER, 1);

    // Try to renew the token using the refresh token
    const res = await handleRenewToken(String(refreshToken), client);

    // unable to renew token throw the error
    if (res.token === undefined) {
      // in case of an invalid token unable to be renewed, force a disconnection
      await handleLogout(client);
      return await Promise.reject(parseAPIError(error));
    }

    // If the token is renewed, retry the request

    // Example invalid / expired token error
    // Code 403
    //   {
    //     "error": {
    //         "name": "CustomError",
    //         "type": "invalidToken",
    //         "errorCode": 11,
    //         "readable": "Token error : TokenExpiredError: jwt expired",
    //         "details": []
    //     }
    // }

    // Additonally to the instance, we still needs to set the token for the returned config
    if (error.config !== undefined) {
      error.config.headers.Authorization = `Bearer ${res.token}`;
    }

    // Retry the request (config = the config of the original request that failed)
    return await client.apiInstance(error.config as AxiosRequestConfig<any>);
  }

  // Any unhandled case throw the error
  return await Promise.reject(parseAPIError(error));
}

/**
 * Check if there is a flag header in the query indicating that this query was a retry
 *
 * If this is the case, return true to prevent an infinite loop
 *
 * @param error
 * @returns
 */
function queryIsARetry(): boolean {
  return store.get(API_RETRY_FLAG_HEADER) !== null;
}

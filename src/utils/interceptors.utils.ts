import { type AxiosError } from 'axios';
import store from 'store2';
import { API_RETRY_FLAG_HEADER } from '../constants';
import { handleAPIError } from '../controllers/api.controller';
import type AeroClient from '../AeroClient';

/**
 * Initialize the API interceptors
 * @param api
 */
export function initializeInterceptors(client: AeroClient): void {
  // Clear the retry flag if it was still active from a previous instance
  if (store.has(API_RETRY_FLAG_HEADER)) {
    store.remove(API_RETRY_FLAG_HEADER);
  }

  client.apiInstance.interceptors.response.use(
    (response) => {
      // In case of successful response

      // Return response as is
      // If there was a retry flag active, we need to remove it
      if (store.has(API_RETRY_FLAG_HEADER)) {
        store.remove(API_RETRY_FLAG_HEADER);
      }

      return response;
    },
    async (error: AxiosError) => {
      // In case of an error response

      return await handleAPIError(error, client);
    }
  );
}

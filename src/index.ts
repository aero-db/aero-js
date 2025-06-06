//
//
//
//
//
//  PLEASE READ   //
//
//
// This file contains all exported members basically the stuff that you can import using `import { ... } from 'aero.js'`
//
//
//

import mongoose from 'mongoose';
import AeroClient from './AeroClient';
import { components } from './types/api';

//              //
//    API       //
//             //

// Export the api typings
export type * as api from './types/api';

//              //
//  FUNCTIONS   //
//              //

/**
 * Create a new client instance
 */
export function createClient(apiKey: string, apiUrl = 'https://api.aerodb.net'): AeroClient {
  return new AeroClient({
    apiKey,
    apiUrl,
  });
}

export type Airport = components['schemas']['Airport'];
export type Notam = components['schemas']['Notam'];
export type Country = components['schemas']['Country'];
export type User = components['schemas']['User'];

/**
 * A callable API resource
 *
 * Use this as a generic type to specify the resource type
 */
export type APIResource = Airport |  User  | Notam | Country;

/**
 * Generic type to filter an API resource
 */
export type ResourceFilter<T extends APIResource> = mongoose.FilterQuery<T>;

/**
 * Query parameters for the API request
 */
export type APIQueryParameters<T extends APIResource> = {
  /**
   * Limit the results
   */
  limit?: number;
  /**
   * Page number
   */
  page?: number;
  /**
   * Sort the results
   */
  sort?: Partial<Record<keyof T, 1 | -1>>;
  /**
   * Filter the results
   */
  filter?: ResourceFilter<T>;
};

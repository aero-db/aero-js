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

import AeroClient from './AeroClient';

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

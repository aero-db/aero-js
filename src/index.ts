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
export type Airline = components['schemas']['Airline'];
export type CityCode = components['schemas']['CityCode'];
export type AircraftType = components['schemas']['AircraftType'];
export type Notam = components['schemas']['Notam'];
export type ApiKey = components['schemas']['ApiKey'];
export type User = components['schemas']['User'];
export type Runway = components['schemas']['Runway'];

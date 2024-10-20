import { Airport, Airline, ApiKey, CityCode, Runway, User, AircraftType, Notam } from '../index';

import mongoose from 'mongoose';

export type ApiResource = Airport | Airline | ApiKey | CityCode | Runway | User | AircraftType | Notam;

/**
 * Query parameters for the API request
 */
export type APIQueryParameters<T extends ApiResource> = {
  /**
   * Limit the results
   */
  limit?: number;
  /**
   * Offset the results
   */
  offset?: number;
  /**
   * Sort the results
   */
  sort?: Partial<Record<keyof T, 1 | -1>>;
  /**
   * Filter the results
   */
  filter?: mongoose.FilterQuery<T>;
};

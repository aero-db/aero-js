import { Airport, Airline, ApiKey, CityCode, Runway, User, AircraftType } from '../index';

import { SortOrder, SortValues, RootFilterQuery } from 'mongoose';

export type ApiResource = Airport | Airline | ApiKey | CityCode | Runway | User | AircraftType;

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
  sort?: Partial<Record<keyof T, SortValues>>;
  /**
   * Filter the results
   */
  filter?: RootFilterQuery<T>;
};

import axios, { type AxiosInstance } from 'axios';
import store from 'store2';
import { TOKEN_KEY } from './constants';
import { eventsManager } from './modules/Event.module';
import { paths } from './types/api';
import { Airport, APIQueryParameters, Country, Notam } from '.';
import { handleApiRequest } from './controllers/api.controller';

type ClientOptions = {
  apiKey: string;
  apiUrl: string;
};

/**
 * Interact with the AeroDB API
 *
 * @example client[module][method]
 *
 * @example client.shipment.list()
 *
 */
export default class AeroClient {
  /**
   * Base API URL currently in use
   */
  public apiUrl: string;
  /**
   * Axios instance to interact with the API
   */
  public apiInstance: AxiosInstance;

  /**
   * Event manager and dispatcher
   *
   * @see https://github.com/sindresorhus/emittery#readme
   */
  public event: typeof eventsManager;

  constructor(options: ClientOptions) {
    this.apiInstance = axios.create();

    this.event = eventsManager;

    this.apiUrl = options.apiUrl;
    this.apiInstance.defaults.baseURL = options.apiUrl;
    this.apiInstance.defaults.headers.common['x-api-key'] = options.apiKey;

    // Load token from localStorage
    const token = store.get(TOKEN_KEY);
    if (token !== null) {
      this.apiInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }

  airport = {
    /**
     * List all airports
     */
    list: async (parameters?: APIQueryParameters<Airport>): Promise<Airport[]> => {
      return await handleApiRequest<Airport>('GET', 'airports', parameters, this.apiInstance);
    },
    /**
     * Get an airport using its id
     *
     * @param airportId Airport id
     */
    get: async (airportId: string) => {
      return (
        await this.apiInstance.get<paths['/airports/{airportId}']['get']['responses']['200']['content']['application/json']>(`airports/${airportId}`)
      ).data;
    },

    // /**
    //  * Get the latest METARs for an airport
    //  * @param airportId Airport id
    //  * @returns METAR data from the last 24 hours
    //  */
    // metar: async (airportId: string): Promise<paths['/airports/{airportId}']['get']['responses']['200']['content']['application/json']> => {
    //   return (
    //     await this.apiInstance.get(
    //       `airports/${airportId}/metar`
    //     )
    //   ).data;
    // },
  };

  // airline = {
  //   /**
  //    * List all airlines
  //    */
  //   list: async (parameters?: APIQueryParameters<Airline>): Promise<Airline[]> => {
  //     return await handleApiRequest('GET', 'airlines', parameters, this.apiInstance);
  //   },
  //   /**
  //    * Get airline by ICAO code
  //    *
  //    * @param airlineId Airline id
  //    */
  //   get: async (airlineId: string): Promise<Airline> => {
  //     return (
  //       await this.apiInstance.get<paths['/airlines/{airlineId}']['get']['responses']['200']['content']['application/json']>(`airlines/${airlineId}`)
  //     ).data;
  //   },
  // };

  /**
   * NOTAMs (Notice to Airmen) are notices containing information concerning the establishment, condition or change in any aeronautical facility, service, procedure or hazard, the timely knowledge of which is essential to personnel concerned with flight operations.
   */
  notam = {
    /**
     * List all NOTAMs
     * @param parameters  Query parameters
     * @returns List of NOTAMs
     */
    list: async (parameters?: APIQueryParameters<Notam>): Promise<Notam[]> => {
      return await handleApiRequest<Notam>('GET', 'notams', parameters, this.apiInstance);
    },
    get: async (notamId: string): Promise<Notam> => {
      return (await this.apiInstance.get<paths['/notams/{notamId}']['get']['responses']['200']['content']['application/json']>(`notams/${notamId}`))
        .data;
    },
  };

  countries = {
    /**
     * List all countries
     * @returns List of countries
     */
    list: async (parameters?: APIQueryParameters<Country>): Promise<Country[]> => {
      return await handleApiRequest<Country>('GET', 'countries', parameters, this.apiInstance);
    },
    /**
     * Get a country by its code
     * @param countryCode Country code (ISO 3166-1 alpha-2)
     * @returns Country data
     */
    get: async (countryCode: string): Promise<Country> => {
      return (
        await this.apiInstance.get<paths['/countries/{countryId}']['get']['responses']['200']['content']['application/json']>(
          `countries/${countryCode}`
        )
      ).data;
    },
  };

  /**
   * Perform a search query on the database
   * @param query
   * @returns
   */
  search = async (query: string): Promise<paths['/search']['get']['responses']['200']['content']['application/json']> => {
    return (await this.apiInstance.get(`search?query=${query}`)).data;
  };
}

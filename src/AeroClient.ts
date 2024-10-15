import axios, { type AxiosInstance } from 'axios';
import store from 'store2';
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from './constants';
import { eventsManager } from './modules/Event.module';
import { components, paths } from './types/api';

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
    list: async () => {
      return (await this.apiInstance.get<paths['/airports']['get']['responses']['200']['content']['application/json']>('airports')).data;
    },
    /**
     * Get airport by ICAO code
     *
     * @param icao ICAO code of the airport
     */
    get: async (icao: string) => {
      return (await this.apiInstance.get<paths['/airports/{icao}']['get']['responses']['200']['content']['application/json']>(`airports/${icao}`))
        .data;
    },
  };

  airline = {
    /**
     * List all airlines
     */
    list: async () => {
      return (await this.apiInstance.get<paths['/airlines']['get']['responses']['200']['content']['application/json']>('airlines')).data;
    },
    /**
     * Get airline by ICAO code
     *
     * @param airlineId Airline id
     */
    get: async (airlineId: string) => {
      return (
        await this.apiInstance.get<paths['/airlines/{airlineId}']['get']['responses']['200']['content']['application/json']>(`airlines/${airlineId}`)
      ).data;
    },
  };
}

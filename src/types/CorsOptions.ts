/**
 * Interface for CORS options
 */
export interface CorsOptions {
  /**
   * Specifies the origin or origins that are allowed to access the resource.
   * A value of "*" can be specified to enable public access from any origin.
   * A single origin can be specified as a string.
   * Multiple origins can be specified as an array of strings.
   */
  origin?: string | string[];

  /**
   * Specifies the method or methods allowed when accessing the resource.
   * This is used in response to a preflight request.
   */
  methods?: string[];

  /**
   * Specifies the headers allowed when accessing the resource.
   */
  headers?: string[];

  /**
   * Specifies the headers exposed in the response.
   */
  exposeHeaders?: string[];

  /**
   * Specifies how long the results of a preflight request can be cached in seconds.
   */
    maxAge?: number;

  /**
   * Specifies whether the resource allows credentials.
   */
  allowCredentials?: boolean;
}
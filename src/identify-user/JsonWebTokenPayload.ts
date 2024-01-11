export interface JsonWebTokenPayload {
  sub: string;
  aud: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  iss: string;
  [key: string]: unknown; // for any additional custom claims
}
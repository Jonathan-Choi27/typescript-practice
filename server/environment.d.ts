declare namespace NodeJS {
  export interface ProcessEnv {
    PRODUCTION: boolean;
    PORT: number;
    COOKIE_DOMAIN: string;
    ORIGIN: string;
    MONGODB_URI: string;
    SALT_WORK_FACTOR: number;
    ACCESS_TOKEN_TTL: string;
    REFRESH_TOKEN_TTL: string;
    PUBLIC_KEY: string;
    PRIVATE_KEY: string;
  }
}

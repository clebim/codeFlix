declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface ProcessEnv {
    NODE_ENV?: string;
    VERSION?: string;
    ENVIRONMENT?: string;
    HTTP_HOST?: string;
    HTTP_PORT?: string;
    REDIS_HOST?: string;
    REDIS_PORT?: string;
    REDIS_PASSWORD?: string;
    REDIS_EXPIRATION_TIME?: string;
    DATABASE_TYPE?: string;
    DATABASE_URL?: string;
    DATABASE_PORT?: string;
    DATABASE_USERNAME?: string;
    DATABASE_PASSWORD?: string;
    DATABASE_NAME?: string;
    DATABASE_LOGGING?: string;
    APP_SECRET?: string;
    EXPIRES_IN?: string;
    SUPPORT_MAIL?: string;
    GOOGLE_CLOUD_PROJECT_ID?: string;
    GOOGLE_CLOUD_PRIVATE_KEY?: string;
    GOOGLE_GLOUD_ACCOUNT_EMAIL?: string;
    STORAGE_VIDEO_BUCKET?: string;
  }
}

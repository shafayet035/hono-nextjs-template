interface AppConfig {
    environment: string;
    isDevelopment: boolean;
    isProduction: boolean;
    port: number;
    logLevel: string;
}

const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development';
const isProduction = environment === 'production';

export const appConfig: AppConfig = {
    environment,
    isDevelopment,
    isProduction,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    logLevel: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
};

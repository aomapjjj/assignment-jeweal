export default () => ({
  app: {
    name: process.env.APP_NAME,
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT ?? '8000', 10),
    apiPrefix: process.env.API_PREFIX ?? 'api',
  },
});

export default () => ({
  database: {
    connectionString: process.env.DB_CONNECTION_STRING,
  },
  finnhub: {
    baseUrl: process.env.FINNHUB_API_BASE_URL,
    apiKey: process.env.FINNHUB_API_KEY,
  },
});

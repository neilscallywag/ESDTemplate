const development = {
  origin: ['http://localhost:8000'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const production = {
  origin: [], // or an array of origins ['https://yourproductiondomain.com', 'https://anotherdomain.com']
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // allowedHeaders: ['Content-Type', 'Authorization'],
  // exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 600, // 10 minutes
};

export const corsOptions =
  process.env.NODE_ENV === 'production' ? production : development;

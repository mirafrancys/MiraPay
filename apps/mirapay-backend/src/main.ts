import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './app/routes';
import { errorHandler } from './app/middlewares/error-handler.middleware';

const app = express();
const port = process.env.PORT || 3000;
const globalPrefix = 'api';

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use(`/${globalPrefix}`, routes);

// Status route
app.get('/', (req, res) => {
  res.send({ message: 'MiraPay API is running' });
});

// Global Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
});

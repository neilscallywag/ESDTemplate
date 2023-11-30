import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { corsOptions } from './config/corsOptions';
import authRoute from './routes/auth.routes';

config();

const app = express();
const port = 3000;

app.set("trust proxy", 1);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use('/auth', authRoute);

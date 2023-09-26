import express, { Express } from 'express';
import ShortenerRoute from './route/shortener.route';

const app: Express = express();

app.use(express.json());
app.use('/', ShortenerRoute)

export default app;
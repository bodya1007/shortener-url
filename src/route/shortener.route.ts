import express from 'express';
import { ShortenerController } from '../controller/shortener.controller';
import { cache } from '../middleware/cache';

const ShortenerRoute = express.Router();

ShortenerRoute
    .post('/shorten', cache, ShortenerController.shorten)
    .get('/:shortcode', ShortenerController.resolve);

export default ShortenerRoute;

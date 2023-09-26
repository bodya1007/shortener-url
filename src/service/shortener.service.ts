import shortid from 'shortid';
import { ShortUrl } from '../model/shortener.module';
import { redis } from '../db/index';

export class ShortenerService {
    static async shortedCode(url: string) {
        const shortcode = shortid.generate();

        await ShortUrl.create({ shortcode, url });
        await redis.set(url, shortcode);

        return { shortcode };
    }

    static async findUrl(shortcode: string) {
        const shortUrl = await ShortUrl.findOne({ where: { shortcode } });

        return shortUrl
    }
}

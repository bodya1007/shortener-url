import { Request, Response } from 'express';
import { ShortenerService } from '../service/shortener.service';

export class ShortenerController {
  static async shorten(req: Request, res: Response) {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const shortcode = await ShortenerService.shortedCode(url)

      return res.json(shortcode);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async resolve(req: Request, res: Response) {
    const { shortcode } = req.params;

    try {
      const shortUrl = await ShortenerService.findUrl(shortcode);

      if (shortUrl) {
        return res.redirect(shortUrl.url);
      }

      return res.status(404).json({ error: 'Short URL not found' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

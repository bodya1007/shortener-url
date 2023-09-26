import { Request, Response } from "express";
import { redis } from "../db/index";

export const cache = async (req: Request, res: Response, next: () => void) => {
    const { url } = req.body;

    const result = await redis.get(url)

    if (result !== null) {
        return res.json({ shortcode: result });
    } else {
        next();
    }
}

import { Request, Response } from "express";
import { cache } from "../src/middleware/cache";
import { redis } from "../src/db/index";

jest.mock("../src/db", () => ({
  redis: {
    get: jest.fn(),
  },
}));

describe("cache middleware", () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    res.json = jest.fn();
    next = jest.fn();
  });

  it("should return cache", async () => {
    const url = "abc123";

    redis.get = jest.fn().mockImplementation((key: string) => {
      if (key === url) {
        return Promise.resolve(url);
      }
      return Promise.resolve(null);
    });

    req.body = { url };

    await cache(req, res, next);

    expect(redis.get).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ shortcode: url });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when cache miss", async () => {
    const url = "def456";

    redis.get = jest.fn().mockImplementation((key: string) => {
      return Promise.resolve(null);
    });

    req.body = { url };

    await cache(req, res, next);

    expect(redis.get).toHaveBeenCalledWith(url);
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});

import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import { ShortenerController } from "../src/controller/shortener.controller";
import ShortenerRoute from "../src/route/shortener.route";

jest.mock('../src/controller/shortener.controller');
jest.mock('../src/middleware/cache', () => ({
  cache: jest.fn(),
}));

describe("ShortenerRoute", () => {
  const app = express();
  app.use("/", ShortenerRoute);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /shorten", () => {
    it("should call ShortenerController.shorten", async () => {
      const mockRequest = { url: "https://example.com" } as Request;

      (ShortenerController.shorten as jest.Mock).mockImplementation((req, res) => {
        res.json({ shortUrl: 'mockShortUrl' });
      });

      request(app)
        .post("/shorten")
        .send(mockRequest)
        .expect(200)
        .then((response) => {
          expect(response.body.shortUrl).toBe('mockShortUrl');
        })
    });
  });

  describe("GET /:shortcode", () => {
    it("should call ShortenerController.resolve", async () => {
      const mockShortcode = 'abc123';

      (ShortenerController.resolve as jest.Mock).mockImplementation((req, res) => {
        res.redirect(301, 'http://example.com');
      });

      request(app)
        .get(`/${mockShortcode}`)
        .expect(301)
        .then((response) => { expect(response.header.location).toBe('http://example.com') })
    });
  });
});

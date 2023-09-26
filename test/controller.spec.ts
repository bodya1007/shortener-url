import { Request, Response } from "express";
import { ShortenerController } from "../src/controller/shortener.controller";
import { ShortenerService } from "../src/service/shortener.service";

jest.mock("../src/service/shortener.service", () => ({
  ShortenerService: {
    shortedCode: jest.fn(),
    findUrl: jest.fn(),
  },
}));

describe("ShortenerController", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    res.status = jest.fn(() => res);
    res.json = jest.fn();
    res.redirect = jest.fn();
  });

  describe("shorten", () => {
    it("should respond with a shortcode when URL is provided", async () => {
      const url = "https://example.com";
      const mockedShortcode = "mockedShortcode";

      req.body = { url };
      ShortenerService.shortedCode = jest.fn().mockResolvedValue({ shortcode: mockedShortcode });

      await ShortenerController.shorten(req, res);

      expect(res.json).toHaveBeenCalledWith({ shortcode: mockedShortcode });
    });

    it("should respond with an error when URL is missing", async () => {
      req.body = {};

      await ShortenerController.shorten(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "URL is required" });
    });

    it("should respond with an error when ShortenerService.shortedCode throws an error", async () => {
      const url = "https://example.com";

      req.body = { url };
      ShortenerService.shortedCode = jest.fn().mockRejectedValue(new Error("Test error"));

      await ShortenerController.shorten(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({error: new Error("Test error")});
    });
  });

  describe("resolve", () => {
    it("should redirect to the URL when shortcode is found", async () => {
      const shortcode = "mockedShortcode";
      const mockShortUrl = { url: "https://example.com" };

      req.params = { shortcode };
      ShortenerService.findUrl = jest.fn().mockResolvedValue(mockShortUrl);

      await ShortenerController.resolve(req, res);

      expect(res.redirect).toHaveBeenCalledWith(mockShortUrl.url);
    });

    it("should respond with an error when shortcode is not found", async () => {
      const shortcode = "nonExistentShortcode";

      req.params = { shortcode };
      ShortenerService.findUrl = jest.fn().mockResolvedValue(null);

      await ShortenerController.resolve(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Short URL not found" });
    });

    it("should respond with an error when ShortenerService.findUrl throws an error", async () => {
      const shortcode = "mockedShortcode";

      req.params = { shortcode };
      ShortenerService.findUrl = jest.fn().mockRejectedValue(new Error("Test error"));

      await ShortenerController.resolve(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({error: new Error("Test error")});
    });
  });
});

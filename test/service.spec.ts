import { ShortenerService } from "../src/service/shortener.service";
import { ShortUrl } from '../src/model/shortener.module';
import { redis } from "../src/db/index";

jest.mock("shortid", () => ({
  generate: jest.fn(() => "mockedShortcode"),
}));

jest.mock("../src/model/shortener.module", () => ({
  ShortUrl: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("../src/db/index", () => ({
  redis: {
    set: jest.fn(),
  },
}));

describe("ShortenerService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("shortedCode", () => {
    it("should generate a shortcode, create a ShortUrl record, and store it in Redis", async () => {
      const url = "https://example.com";
      const mockedShortcode = "mockedShortcode";

      const createSpy = jest.spyOn(ShortUrl, "create");
      const setSpy = jest.spyOn(redis, "set");

      const result = await ShortenerService.shortedCode(url);

      expect(createSpy).toHaveBeenCalledWith({ shortcode: mockedShortcode, url });
      expect(setSpy).toHaveBeenCalledWith(url, mockedShortcode);
      expect(result).toEqual({ shortcode: mockedShortcode });
    });
  });

  describe("findUrl", () => {
    it("should find a URL by shortcode using ShortUrl model", async () => {
      const shortcode = "mockedShortcode";
      const mockShortUrl = { url: "https://example.com" };

      ShortUrl.findOne = jest.fn().mockResolvedValue(mockShortUrl);

      const result = await ShortenerService.findUrl(shortcode);

      expect(ShortUrl.findOne).toHaveBeenCalledWith({ where: { shortcode } });
      expect(result).toEqual(mockShortUrl);
    });
  });

});

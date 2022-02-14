const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(data));
afterAll(() => connection.end());

describe("/api/topics", () => {
  describe("GET", () => {
    test("Status:200 - Returns array of topic objects", () => {});
  });
});

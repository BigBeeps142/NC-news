const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(data));
afterAll(() => connection.end());

describe("Invalid path", () => {
  test("Status:404 - Path not found", () => {
    return request(app)
      .get("/api/invalidEnd")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
});
describe("/api/topics", () => {
  describe("GET", () => {
    test("Status:200 - Returns array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              description: expect.any(String),
              slug: expect.any(String),
            });
          });
        });
    });
  });
});

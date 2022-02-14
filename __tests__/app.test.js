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
describe("/api/articles/:article_id", () => {
  describe("PATCH", () => {
    test("Status:200 - Returns updated article", () => {
      const body = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(body)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).toBe(101);
        });
    });
    test("Status:400 - Invalid id format", () => {
      return request(app)
        .patch("/api/articles/notValid")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("Status:404 - Invalid id", () => {
      const body = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/9999")
        .send(body)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    test("Status:400 - Invalid body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("Status:400 - Invalid body data", () => {
      const body = { inc_votes: "BAnna" };
      return request(app)
        .patch("/api/articles/1")
        .send(body)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("GET", () => {
    test("Status:200 - Returns article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            votes: 100,
          });
          expect(article.hasOwnProperty("created_at")).toBe(true);
        });
    });
    test("Status:400 - Invalid id format", () => {
      return request(app)
        .get("/api/articles/notvalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("Status:404 - Invalid id", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
  });
});

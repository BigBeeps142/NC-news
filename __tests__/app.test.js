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
    test("Status:200 - Article object has comment_count Property", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.hasOwnProperty("comment_count")).toBe(true);
          expect(Number(article.comment_count)).toBe(11);
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

describe("/api/users", () => {
  describe("GET", () => {
    test("Status:200 - Retuns array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user.hasOwnProperty("username")).toBe(true);
          });
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("Status:200 - Returns user object", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
    test("Status:404 - Invalid Username", () => {
      return request(app)
        .get("/api/users/NotHere")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Resource not found");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("Status:200 - Returns array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              votes: expect.any(Number),
            });
            expect(article.hasOwnProperty("created_at")).toBe(true);
          });
        });
    });
    test("Status:200 - Articles are default sorted by date in desc order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("Status:200 - Articles has comment count property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article.hasOwnProperty("comment_count")).toBe(true);
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    test("Status:200 - Accepts sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(12);
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });
    test("Status:400 - Invalid sort by", () => {
      return request(app)
        .get("/api/articles?sort_by=Invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid query");
        });
    });
    test("Status:200 - Accepts order query", () => {
      return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(12);
          expect(articles).toBeSortedBy("created_at", { descending: false });
        });
    });
    test("Status:400 - Invalid order query", () => {
      return request(app)
        .get("/api/articles?order=Invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid query");
        });
    });
    test("Status:200 - Accepts topic query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(11);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("Status:200 - Returns array of comment objects for given article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
            });
            expect(comment.hasOwnProperty("created_at")).toBe(true);
          });
        });
    });
    test("Status:200 - Returns empty array if no comments for article", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(0);
        });
    });
    test("Status:400 - Invalid id format", () => {
      return request(app)
        .get("/api/articles/notValid/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("Status:404 - Invalid id", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Resource not found");
        });
    });
  });
  describe("POST", () => {
    test("Status:200 - Return body contains posted comment", () => {
      const body = { username: "butter_bridge", body: "Body" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(body)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: "Body",
            votes: 0,
            author: "butter_bridge",
            article_id: 1,
            created_at: expect.any(String),
          });
        });
    });
    test("Status:400 - Invalid id format", () => {
      const body = { username: "butter_bridge", body: "Body" };
      return request(app)
        .post("/api/articles/Invalid/comments")
        .send(body)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("Status:404 - Invalid id", () => {
      const body = { username: "butter_bridge", body: "Body" };
      return request(app)
        .post("/api/articles/99999/comments")
        .send(body)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Resource not found");
        });
    });
    test("Status:404 - Invalid user", () => {
      const body = { username: "Invalid", body: "Body" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(body)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Resource not found");
        });
    });
    test("Status:400 - Invalid body", () => {
      const body = { username: "Invalid" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(body)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("Status:400 - Invalid body data", () => {
      const body = { username: "butter_bridge", body: 9000 };
      return request(app)
        .post("/api/articles/1/comments")
        .send(body)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("Status:200 - Returns empty body", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("Status:400 - Invalid id format", () => {
      return request(app)
        .delete("/api/comments/Invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("Status:404 - Invalid id", () => {
      return request(app)
        .delete("/api/comments/999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Resource not found");
        });
    });
  });
  describe.only("PATCH", () => {
    test("Status:200 - Return body contains updated votes", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toBe(17);
        });
    });
    test("Status:404 - Invalid id", () => {
      return request(app)
        .patch("/api/comments/999999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Resource not found");
        });
    });
    test("Status:400 - Invalid id format", () => {
      return request(app)
        .patch("/api/comments/NotValid")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("Status:400 - Invalid body", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ NotValid: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});

describe("/api", () => {
  describe("GET", () => {
    test("Status:200 - Returns JSON describing all the available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endPoints } }) => {
          expect(endPoints).toMatchObject({
            "GET /api": {
              description:
                "serves up a json representation of all the available endpoints of the api",
            },
            "GET /api/topics": {
              description: "serves an array of all topics",
              queries: [],
              exampleResponse: {
                topics: [{ slug: "football", description: "Footie!" }],
              },
            },
            "GET /api/articles": {
              description: "serves an array of all articles",
              queries: ["author", "topic", "sort_by", "order"],
              exampleResponse: {
                articles: [
                  {
                    article_id: 1,
                    title: "Seafood substitutions are increasing",
                    topic: "cooking",
                    author: "weegembump",
                    created_at: 1527695953341,
                    votes: 5,
                  },
                ],
              },
            },
            "GET /api/articles/:article_id": {
              description: "serves an article",
              queries: [],
              exampleResponse: {
                article: {
                  article_id: 1,
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: 1527695953341,
                  votes: 5,
                },
              },
            },
            "PATCH /api/articles/:article_id": {
              description: "Updates an article's votes",
              exampleBodyRequired: { inc_votes: 3 },
              queries: [],
              exampleResponse: {
                article: {
                  article_id: 1,
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: 1527695953341,
                  votes: "Updated vote Number",
                },
              },
            },
            "GET /api/users": {
              description: "serves an array of all topics",
              queries: [],
              exampleResponse: {
                users: [
                  {
                    username: "Bobby",
                  },
                ],
              },
            },
            "GET /api/articles/:article_id/comments": {
              description: "serves an array of all comments on given article",
              queries: [],
              exampleResponse: {
                Comments: [
                  {
                    comment_id: 1,
                    votes: 3,
                    author: "Jim",
                    body: "Comment contents...",
                    created_at: 1527695953341,
                  },
                ],
              },
            },
            "POST /api/articles/:article_id/comments": {
              description: "adds a comment to a given article",
              exampleBodyRequired: { username: "butter_bridge", body: "Body" },
              queries: [],
              exampleResponse: {
                Comment: [
                  {
                    comment_id: 5,
                    votes: 0,
                    author: "butter_bridge",
                    body: "Body",
                    created_at: 1527695953341,
                  },
                ],
              },
            },
            "DELETE /api/comments/:comment_id": {
              description: "deletes a comment ",
              queries: [],
            },
          });
        });
    });
  });
});

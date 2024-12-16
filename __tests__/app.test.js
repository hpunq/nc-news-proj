const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../server/app");
require("jest-sorted");
/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/invalidEndpoint", () => {
  test("404: Attempting to access a non-existent endpoint", () => {
    return request(app)
      .get("/api/endpointdoesnotexist")
      .expect(404)
      .then(({ body: { errorResponse } }) => {
        expect(errorResponse).toBe("Content not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects each with a slug and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBeGreaterThan(1);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with correct article object for correct id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toStrictEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: Valid endpoint, but not available", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body: { errorResponse } }) => {
        expect(errorResponse).toBe("Article does not exist");
      })
    })
});
describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects each with a slug and description property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(1);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
      });
  });
  test("200: Returns the correct comment count for the correct article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[6]).toStrictEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
      });
  });
  test("200: Articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: Article produces an array of comments with the following properties", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toStrictEqual([
          {
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 16,
            author: "butter_bridge",
            article_id: 9,
            comment_id: 1,
            created_at: "2020-04-06T12:17:00.000Z",
          },
          {
            body: "The owls are not what they seem.",
            votes: 20,
            author: "icellusedkars",
            article_id: 9,
            comment_id: 17,
            created_at: "2020-03-14T17:02:00.000Z",
          },
        ]);
      });
  });
  test("200: Comments are ordered by date in descending order (most to least recent)", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Articles with no comments return an empty array'", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toStrictEqual([]);
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: Posts a commment to an article and returns it as a response", () => {
    const testComment = {
      username: "butter_bridge",
      body: "the dog is in the eye of the beholder",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(testComment)
      .expect(201)
      .then(({ body: { newComment } }) => {
        expect(newComment).toMatchObject({
          author: "butter_bridge",
          body: "the dog is in the eye of the beholder",
          article_id: 9,
        });
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: Updates an article's vote count via athe article id", () => {
    const testUpdate = { inc_votes: 55 };
    return request(app)
      .patch("/api/articles/5")
      .send(testUpdate)
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle.votes).toBe(testUpdate.inc_votes);
      });
  });
  test("400: PATCHing a resource with a body that does not contain the correct fields: 400 Bad Request", () => {
    const testUpdate = {};
    return request(app)
      .patch("/api/articles/5")
      .send(testUpdate)
      .expect(400)
      .then(({ body: { errorResponse } }) => {
        expect(errorResponse).toBe("Bad Request");
      });
  });
  test("400: Attempting to PATCH a resource with valid body fields but invalid fields: 400 Bad Request", () => {
    const testUpdate = { inc_votes: "nananana" };
    return request(app)
      .patch("/api/articles/5")
      .send(testUpdate)
      .expect(400)
      .then(({ body: { errorResponse } }) => {
        expect(errorResponse).toBe("Bad Request");
      });
  });
  test("404: Valid endpoint, but not available", () => {
    const testUpdate = { inc_votes: 55 }
    return request(app)
      .patch("/api/articles/99999")
      .send(testUpdate)
      .expect(404)
      .then(({ body: { errorResponse } }) => {
        expect(errorResponse).toBe("Article does not exist");
      });
  })
  test("400: Invalid endpoint", () => {
    const testUpdate = { inc_votes: 55 }
    return request(app)
      .patch("/api/articles/banana")
      .send(testUpdate)
      .expect(400)
      .then(({ body: { errorResponse } }) => {
        expect(errorResponse).toBe("Bad Request");
      });
  })
});

describe("DELETE /api/comments/:comment_id", () => {
  test("400: Invalid endpoint", () => {
    return request(app)
      .delete("/api/comments/invalidinput")
      .expect(400)
      .then(({ body: { errorResponse } }) => {
        expect(errorResponse).toBe("Bad Request");
      });
  });
  test("404: Valid endpoint, but not available", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body: { errorResponse } }) => {
        expect(errorResponse).toBe("Comment not found");
      });
  });
  test("204: Deletes a comment object from comments array", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
});

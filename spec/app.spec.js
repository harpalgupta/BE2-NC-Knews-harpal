process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const { connection } = require('../db/connection');

describe('/api', () => {
  it('api description', () => {
    request
      .get('/api')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.a('object');
      });
  });
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());

  describe('/topics', () => {
    const url = '/api/topics';
    it('200 GET all topics /topics', () => request
      .get(url)
      .expect(200)
      .then((res) => {
        expect(res.body.topics).to.be.a('array');
        expect(res.body.topics).to.have.length(2);
        expect(res.body.topics[0]).to.have.all.keys('slug', 'description');
        expect(res.body.topics[0].description).to.equal(
          'The man, the Mitch, the legend',
        );
        expect(res.body.topics[0].slug).to.equal('mitch');
      }));
    it('201 POST a new single topic', () => request
      .post(url)
      .send({ slug: 'harpal', description: 'An Enigma' })
      .expect(201)
      .then((res) => {
        expect(res.body.topic).to.have.all.keys('slug', 'description');
        expect(res.body.topic.description).to.equal('An Enigma');
      }));

    it('422 POST a duplicate topic', () => request
      .post(url)
      .send({ slug: 'mitch', description: 'trying to overwrite' })
      .expect(422)
      .then((res) => {
        expect(res.body.msg).to.equal('Duplicate key');
      }));
    it('400 POST with a Malformed body', () => request
      .post(url)
      .send({ bad: 'mitch', body: 'trying to overwrite' })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).to.equal('Malformed Body');
      }));

    it('405 PATCH Method Not Allowed', () => request
      .patch(url)
      .expect(405)
      .then((res) => {
        expect(res.body.msg).to.equal('Method not allowed');
      }));
  });

  describe('Articles for single topic /topics/:topic/articles', () => {
    it('200 GET all articles for one topic', () => {
      const url = '/api/topics/mitch/articles';
      return request
        .get(url)
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.length(10);
          expect(res.body.articles[0]).to.have.all.keys(
            'article_id',
            'author',
            'title',
            'votes',
            'comment_count',
            'created_at',
            'topic',
          );
          expect(res.body.articles[1].title).to.equal(
            'Sony Vaio; or, The Laptop',
          );
          expect(res.body.articles[9].created_at).to.equal(
            '1970-01-01T00:00:00.002Z',
          );
        });
    });

    it('200 GET Check queries ascending and limit /topics/:topics/articles?sort_by=votes&sort_ascending=true&limit=2', () => {
      const url = '/api/topics/mitch/articles?sort_by=votes&sort_ascending=true&limit=2';

      return request
        .get(url)
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.length(2);
          expect(res.body.articles[0]).to.have.all.keys(
            'article_id',
            'author',
            'title',
            'votes',
            'comment_count',
            'created_at',
            'topic',
          );
          expect(res.body.articles[1].votes).to.equal(0);
        });
    });

    it('200 GET check queries pages and invalid sort by defaults /topics/:topics/articles?p=2&sort_by=blah', () => {
      const url = '/api/topics/mitch/articles?p=2&sort_by=blah';

      return request
        .get(url)
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.length(1);
          expect(res.body.articles[0]).to.have.all.keys(
            'article_id',
            'author',
            'title',
            'votes',
            'comment_count',
            'created_at',
            'topic',
          );
        });
    });
    it('404 GET for non existant topic /api/topics/notopic/articles', () => {
      const url = '/api/topics/notopic/articles';

      return request
        .get(url)
        .expect(404)
        .then((res) => {
          expect(res.body).to.eql({ msg: 'Invalid Topic' });
        });
    });

    it('201 POST new cat topic article /api/topics/cats/articles', () => {
      const url = '/api/topics/cats/articles';
      return request
        .post(url)
        .send({ title: 'harpal the GEEK', user_id: '2', body: 'so Geeky' })
        .expect(201)
        .then((res) => {
          expect(res.body.article).to.have.all.keys(
            'article_id',
            'title',
            'body',
            'votes',
            'topic',
            'user_id',
            'created_at',
          );
          expect(res.body.article.title).to.equal('harpal the GEEK');
        });
    });

    it('400 POST with Malformed Body', () => {
      const url = '/api/topics/cats/articles';
      return request
        .post(url)
        .send({ bad: 'mitch', body: 'rubbish' })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('Malformed Body');
        });
    });

    it('404 POST with non existent topic /api/topics/badTopic/articles', () => {
      const url = '/api/topics/badTopic/articles';
      return request
        .post(url)
        .send({ title: 'harpal the GEEK', user_id: '2', body: 'so Geeky' })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Page not found');
        });
    });
  });

  describe('Dealing with Articles /articles', () => {
    const url = '/api/articles';
    it('200 GET  checking get with invalid sort_by column defaults and gets correct results /api/articles?sort_by=invalid_column', () => request
      .get(`${url}?sort_by=invalid_column`)
      .expect(200)
      .then((res) => {
        expect(res.body.articles).to.have.length(10);
        expect(res.body.articles[0]).to.have.all.keys(
          'author',
          'article_id',
          'title',
          'votes',
          'created_at',
          'comment_count',
          'topic',
          'body',
        );
        expect(res.body.articles[9].title).to.equal(
          'Seven inspirational thought leaders from Manchester UK',
        );
      }));
    it('200 GET  sort_by and limit check /api/articles?limit=3&sort_by=title', () => request
      .get(`${url}?limit=3&sort_by=title`)
      .expect(200)
      .then((res) => {
        expect(res.body.articles).to.have.length(3);
        expect(res.body.articles[0]).to.have.all.keys(
          'author',
          'article_id',
          'title',
          'votes',
          'created_at',
          'comment_count',
          'topic',
          'body',
        );
        expect(res.body.articles[2].title).to.equal(
          "They're not exactly dogs, are they?",
        );
      }));
  });

  describe('Single Article ID /articles/:article_id', () => {
    const url = '/api/articles/';
    it('200 GET Get Single Article /api/articles/3', () => request
      .get(`${url}3`)
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.all.keys(
          'author',
          'article_id',
          'title',
          'votes',
          'created_at',
          'comment_count',
          'topic',
          'body',
        );
        expect(res.body.title).to.equal(
          "They're not exactly dogs, are they?",
        );
      }));

    it('404 GET Invalid Article ID /api/articles/100', () => request
      .get(`${url}100`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).to.equal('Non existant Article Id');
      }));

    it('400 GET /api/articles/wrongdatatype', () => request
      .get(`${url}wrongdatatype`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).to.equal('Article ID must be integer');
      }));
    it('200 PATCH Update incrementing vote /api/articles/1', () => request
      .patch(`${url}1`)
      .send({ inc_votes: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.votes).to.equal(101);
      }));
    it('200 PATCH with empty body returns unmodified article /api/articles/1', () => request
      .patch(`${url}1`)
      .send({})
      .expect(200)
      .then((res) => {
        expect(res.body.votes).to.equal(100);
      }));

    it('400 PATCH with incorrect data type in inc_votes in req body /api/articles/1', () => request
      .patch(`${url}1`)
      .send({ inc_votes: 'blah' })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).to.equal('Invalid inc_votes');
      }));

    it('204 DELETE deletes one article /api/articles/1', () => request
      .delete(`${url}1`)
      .expect(204)
      .then((res) => {
        expect(res.body).to.be.eql({});
      }));

    it('404 DELETE non existant article ID /api/articles/1000', () => request
      .delete(`${url}1000`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).to.equal('Non existant Article Id');
      }));

    it('400 DELETE using non integer article_id /api/articles/BLAH', () => request
      .delete(`${url}BLAH`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).to.equal('Article ID must be integer');
      }));
  });

  describe('Comments for Article ID /articles/:article_id/comments', () => {
    const url = '/api/articles/';
    const url2 = '/comments';
    it('200 GET all comments for article id 1 /api/articles/1/comments', () => request
      .get(`${url}1${url2}`)
      .expect(200)
      .then((res) => {
        expect(res.body.comments).to.have.length(10);
      }));
    it('200  GET all comments for article id 1  sorting ascending /api/articles/1/comments?sort_ascending=true', () => request
      .get(`${url}1${url2}?sort_ascending=true`)
      .expect(200)
      .then((res) => {
        expect(res.body.comments).to.have.length(10);
        expect(res.body.comments[0].created_at).to.equal(
          '2016-02-08T16:13:02.053Z',
        );
      }));

    it('404 GET all comments for non existant article_id /api/articles/100/comments', () => request
      .get(`${url}100${url2}`)
      .expect(404)
      .then((res) => {
        expect(res.body).to.eql({ msg: 'Non existant Article Id' });
      }));

    it('400 GET all comments for non integer article_id /api/topics/BLAH/comments', () => request
      .get(`${url}BLAH${url2}`)
      .expect(400)
      .then((res) => {
        expect(res.body).to.eql({ msg: 'Article ID must be integer' });
      }));
    it('201 POST add new comment for article_id 1 /api/articles/1/comments', () => request
      .post(`${url}1${url2}`)
      .send({ user_id: '1', body: 'some old rubbish' })
      .expect(201)
      .then((res) => {
        expect(res.body.comment.body).to.equal('some old rubbish');
      }));

    it('400 POST add new comment with Malformed Body /api/articles/1/comments', () => request
      .post(`${url}1${url2}`)
      .send({ user_id: '1', nonexistant: 'some old rubbish' })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).to.equal('Malformed Body');
      }));

    it('404 POST add new comment with non existant user_id /api/articles/1/comments', () => request
      .post(`${url}1${url2}`)
      .send({ user_id: '1000', body: 'some old rubbish' })
      .expect(404)
      .then((res) => {}));

    it('200 PATCH update comment vote /api/articles/1/comments/1', () => request
      .patch(`${url}1${url2}/1`)
      .send({ inc_votes: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.votes).to.equal(101);
      }));
    it('400 PATCH uodate comment vote with incorrect data type /api/articles/1/comments/1', () => request
      .patch(`${url}1${url2}/1`)
      .send({ inc_votes: 'BLAH' })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).to.equal('Invalid inc_votes');
      }));
    it('200 PATCH update with no body expect return of untouched comment /api/articles/1/comments/1', () => request
      .patch(`${url}1${url2}/1`)
      .send({})
      .expect(200)
      .then((res) => {
        expect(res.body.comment_id).to.equal(1);
      }));
    it('404 PATCH uodate with non existant comment /api/articles/1/comments/1000', () => request
      .patch(`${url}1${url2}/1000`)
      .send({ inc_votes: 1 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).to.equal('Non existant Article Id');
      }));

    it('204 delete 1 comment /api/articles/1/comments/1', () => request
      .delete(`${url}1${url2}/1`)
      .expect(204)
      .then((res) => {
        expect(res.body).to.be.eql({});
      }));
  });

  describe('Users /users', () => {
    const url = '/api/users';
    it('200 GET get all users /api/users', () => request
      .get(`${url}`)
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.length(3);
      }));

    it('200 GET get single user /api/users/:rogersop', () => request
      .get(`${url}/rogersop`)
      .expect(200)
      .then((res) => {
        expect(res.body.user_id).to.equal(3);
      }));

    it('404 GET get non existant user /api/users/:username', () => request
      .get(`${url}/invaliduser`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).to.equal('Non Existant Username');
      }));
  });

  describe('/get404', () => {
    const url = '/api/BadURL';

    it('404 GET on /BadURL', () => request.get(url).expect(404));
  });
});

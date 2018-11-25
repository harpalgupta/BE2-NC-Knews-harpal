process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const { connection } = require('../db/connection');


describe('/api', () => {
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());


  describe('/topics', () => {
    const url = '/api/topics';
    it('200 GET', () => request.get(url).expect(200)
      .then(
        (res) => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(2);
          expect(res.body[0]).to.have.all.keys('slug', 'description');
          expect(res.body[0].description).to.equal('The man, the Mitch, the legend');
          expect(res.body[0].slug).to.equal('mitch');
        },

      ));
  });

  // correct post
  describe('/topics', () => {
    const url = '/api/topics';
    it('201 POST', () => request.post(url).send({ slug: 'harpal', description: 'An Enigma' }).expect(201)
      .then(
        (res) => {
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.have.all.keys('slug', 'description');
          expect(res.body[0].description).to.equal('An Enigma');
          // expect(res.body[])
        },

      ));
    // newtopic = { slug: 'mitch', description: 'trying to overwrite' };

    it('422 POST', () => request.post(url).send({ slug: 'mitch', description: 'trying to overwrite' }).expect(422)
      .then(
        (res) => {
          expect(res.body.msg).to.equal('Duplicate key');
        },

      ));
    // post with a bad body
    it('400 POST', () => request.post(url).send({ bad: 'mitch', body: 'trying to overwrite' }).expect(400)
      .then(
        (res) => {
          expect(res.body.msg).to.equal('Malformed Body');
        },

      ));

    it('405 PATCH', () => request.patch(url).expect(405)
      .then(
        (res) => {
          expect(res.body.msg).to.equal('Method not allowed');
        },

      ));
  });


  describe('/topics/:topic/articles', () => {
    const url = '/api/topics/mitch/articles';
    it('200 GET', () => request.get(url).expect(200)
      .then(
        (res) => {
          // console.log(res.body);
          expect(res.body).to.have.length(10);
          expect(res.body[0]).to.have.all.keys('article_id', 'author', 'title', 'votes', 'comment_count', 'created_at', 'topic');
          expect(res.body[1].title).to.equal('Sony Vaio; or, The Laptop');
          // check order is descending by date default
          expect(res.body[9].created_at).to.equal('1970-01-01T00:00:00.002Z');
        },

      ));
  });
  // check queries ascending and limit
  describe('/topics/:topics/articles?sort_by=votes&sort_ascending=true&limit=2', () => {
    const url = '/api/topics/mitch/articles?sort_by=votes&sort_ascending=true&limit=2';
    it('200 GET /topics/:topics/articles?sort_by=votes&sort_ascending=true&limit=2', () => request.get(url).expect(200)
      .then(
        (res) => {
          expect(res.body).to.have.length(2);
          expect(res.body[0]).to.have.all.keys('article_id', 'author', 'title', 'votes', 'comment_count', 'created_at', 'topic');
          expect(res.body[1].votes).to.equal(0);
        },

      ));
  });
  // check queries pages and invalid sort by defaults
  describe('/topics/:topics/articles?p=2&sort_by=blah', () => {
    const url = '/api/topics/mitch/articles?p=2&sort_by=blah';
    it('200 GET /topics/:topics/articles?p=2&sort_by=blah', () => request.get(url).expect(200)
      .then(
        (res) => {
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.have.all.keys('article_id', 'author', 'title', 'votes', 'comment_count', 'created_at', 'topic');
          // expect(res.body[1].votes).to.equal(0);
        },

      ));
  });


  // 404 for non existant topic
  describe('/topics/notopic/articles', () => {
    const url = '/api/topics/notopic/articles';
    it('404 GET /api/topics/notopic/articles', () => request.get(url).expect(404)
      .then(
        (res) => {
          expect(res.body).to.eql({ msg: 'Invalid Topic' });
        },

      ));
  });


  describe('/api/topics/:topic/articles', () => {
    let url = '/api/topics/cats/articles';
    it('201 POST /api/topics/cats/articles', () => request.post(url).send({ title: 'harpal the GEEK', user_id: '2', body: 'so Geeky' }).expect(201)
      .then(
        (res) => {
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.have.all.keys('article_id', 'title', 'body', 'votes', 'topic', 'user_id', 'created_at');
          expect(res.body[0].title).to.equal('harpal the GEEK');
          // expect(res.body[])
        },

      ));
    it('400 POST with {bad: \'mitch\' body: \'rubbish\' ', () => request.post(url).send({ bad: 'mitch', body: 'rubbish' }).expect(400)
      .then(
        (res) => {
          expect(res.body.msg).to.equal('Malformed Body');
        },

      ));
    it('404 POST with non existent topic /api/topics/badTopic/articles', () => {
      url = '/api/topics/badTopic/articles';
      return request.post(url).send({ title: 'harpal the GEEK', user_id: '2', body: 'so Geeky' }).expect(404)
        .then(
          (res) => {
            expect(res.body.msg).to.equal('Page not found');
          },

        );
    });
  });


  describe('/articles', () => {
    const url = '/api/articles';
    it('200 GET /api/articles', () => request.get(url).expect(200)
      .then(
        (res) => {
          expect(res.body).to.have.length(10);
          expect(res.body[0]).to.have.all.keys('author', 'article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic');
          expect(res.body[1].title).to.equal('UNCOVERED: catspiracy to bring down democracy');
          // expect(res.body[0].slug).to.equal('mitch');
        },
      ));
  });

  describe('/articles/:article_id', () => {
    const url = '/api/articles/3';
    it('200 GET /api/articles/3', () => request.get(url).expect(200)
      .then(
        (res) => {
          // expect(res.body).to.have.length(2);
          expect(res.body[0]).to.have.all.keys('author', 'article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic');

          expect(res.body[0].title).to.equal('They\'re not exactly dogs, are they?');
          // expect(res.body[0].slug).to.equal('mitch');
        },
      ));
  });

  describe('/get404', () => {
    const url = '/api/BadURL';

    it('404 GET on /BadURL', () => request.get(url).expect(404));
  });
});

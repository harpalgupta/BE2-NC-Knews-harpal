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
          expect(res.body).to.have.length(2);
          expect(res.body[0]).to.have.all.keys('slug', 'description');
          expect(res.body[0].description).to.equal('The man, the Mitch, the legend');
          expect(res.body[0].slug).to.equal('mitch');
        },

      ));
  });


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
  });


  describe('/topics/:topics/articles', () => {
    const url = '/api/topics/cats/articles';
    it('200 GET', () => request.get(url).expect(200)
      .then(
        (res) => {
          // console.log(res.body[0]);
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.have.all.keys('article_id', 'author', 'title', 'votes', 'comment_count', 'created_at', 'topic');
          expect(res.body[0].title).to.equal('UNCOVERED: catspiracy to bring down democracy');
        },

      ));
  });
  // check queries
  describe('/topics/:topics/articles?sort_by=votes&sort_ascending=true', () => {
    const url = '/api/topics/mitch/articles?sort_by=votes&sort_ascending=true';
    it('200 GET', () => request.get(url).expect(200)
      .then(
        (res) => {
          // console.log(res.body);
          expect(res.body).to.have.length(3);
          expect(res.body[2]).to.have.all.keys('article_id', 'author', 'title', 'votes', 'comment_count', 'created_at', 'topic');
          expect(res.body[2].votes).to.equal(100);
        },

      ));
  });


  describe('/api/topics/:topic/articles', () => {
    const url = '/api/topics/cats/articles';
    it('201 POST', () => request.post(url).send({ title: 'harpal the GEEK', user_id: '2', body: 'so Geeky' }).expect(201)
      .then(
        (res) => {
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.have.all.keys('article_id', 'title', 'body', 'votes', 'topic', 'user_id', 'created_at');
          expect(res.body[0].title).to.equal('harpal the GEEK');
          // expect(res.body[])
        },

      ));
  });


  describe('/articles', () => {
    const url = '/api/articles';
    it('200 GET', () => request.get(url).expect(200)
      .then(
        (res) => {
          // expect(res.body).to.have.length(2);
          expect(res.body[0]).to.have.all.keys('author', 'article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic');
          expect(res.body[1].title).to.equal('UNCOVERED: catspiracy to bring down democracy');
          // expect(res.body[0].slug).to.equal('mitch');
        },
      ));
  });

  describe.only('/articles/:article_id', () => {
    const url = '/api/articles/3';
    it('200 GET', () => request.get(url).expect(200)
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

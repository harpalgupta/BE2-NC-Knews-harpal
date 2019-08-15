# Knews

This api connects to a back end database for news articles. It has many elements including users, comments, articles, topics

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* You will need Node Js installed and Postgres.
* You will also need to know your user name and password for your postgres database
* copy the knexfileTemplate.js to knexfile.js 
* open knexfile.js and your credentials for postgres as necessary
  * NOTE: the knexfile.js is in the .gitignore so should not be pushed to your git repo

### Installing

You will be installing Knex, express, pg (to connect to post gres) and as part of the install this will also install the following for testing: mocha, supertest, chai

* git clone this repo
* npm install 
* psql -f db/initial_seed.sql  ###this will create knews database and knews_test database
* npm run reset (this will clear existing tables and setup required tables using knex migrations stored in ./db/migrations/ and will seed necessary data into the database)



## Running the tests

To run tests run the follwing command:
npm test (this will run through suite of test checking )
these tests can be found in the ./spec directory


for example:
 * Articles for single topic /topics/:topic/articles
 *     ✓ 200 GET all articles for one topic
 *     ✓ 200 GET Check queries ascending and limit /topics/:topics/articles?sort_by=votes&sort_ascending=true&limit=2
 

## Deployment
to Deploy to Heroku:

* Sign for Heroku account: https://www.heroku.com/
* npm install -g heroku (install heroku globally)
* heroku login with your credentials (login to heroku)
* heroku create APP_NAME
* git push heroku master
* heroku open (open your app)
* goto app address /api

## Swagger
To Test Endpoints you can go to swagger
    for example http://localhost:9090/swagger

## Authors

* **Harpal Gupta** - [harpalgupta](https://github.com/harpalgupta)



## Acknowledgments

* NorthCoders who provided the knowledge


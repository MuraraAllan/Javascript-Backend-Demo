const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/DemoApp_Test';
mongoose.connect(MONGO_URL);
const User = require('../../model/mongoose/user');

chai.use(chaiHTTP);
beforeEach((done) => { 
  host = 'http://localhost:8000/'
  done();
});

describe('POST /User/Signup', () => {
  beforeEach((done) => {
    endPoint = 'user/signup';
    User.remove({}, (err) => {
      if (err) return err
      done();
    });
  });
  it('should return error with missing data', (done) => {
    chai.request(host).post(endPoint)
    .send({ username: '', password: '' })
    .end((err,res) => {
      expect(res).to.have.status(422);
      done();
    });
  });
  it('should create user and receive the auth token.', (done) => {
    chai.request(host).post(endPoint)
    .send({ username: 'signup@tests.com', password: '1234'})
    .end((err,res) => {
        if (err) return err
        expect(res).to.have.status(200);
        expect(res.body).to.have.deep.property('token')
        done();
    });
  });
});

describe('PUT /user/:email', () => {
 beforeEach((done) => {
    endPoint = 'user/signup@tests.com';
  });
  it('should return that just age and city are editable', (done) => {
    expect(1).to.be.equal(2);
    done();
  });
  it('should update signup@tests.com age to 99', (done) => {
    expect(1).to.be.equal(2);
    done();
  });
});


describe('DELETE /user', () => {
  it('should delete current logged in user.', (done) => {
    expect(1).to.be.equal(2);
    done();
  });
});

describe('GET /user', () => {
  beforeEach((done) => {
    endPoint = '/user/me';
    done();
  });
 it('Should return username if logged in (token)', (done) => {
    chai.request(host).post('auth/jwt')
      .send({ username: 'signup@tests.com', password: '1234'})
      .end((err,res) => {
        if (err) console.log(err)
        expect(res).to.have.status(200);
        expect(res.body).to.have.deep.property('token')
        chai.request(host)
        .get('me')
        .set('authorization', res.body.token)
        .end((err,res) => {
          expect(res).to.be.json;
          expect(res.body).to.have.deep.property('user');
          expect(res.body.user).to.be.equal('signup@tests.com');
          done();
        });
    });
  })
  it('Should return username if logged in (session)', (done) => {
    const agent = chai.request.agent(host)
    agent
    .post('auth/session')
    .send({ username: 'signup@tests.com', password: '1234'})
    .then((res) => {
      expect(res).to.have.status(200);
      return agent.get(endPoint)
      .then((res) => {
        expect(res).to.be.json;
        expect(res.body).to.have.deep.property('user');
        expect(res.body.user).to.be.equal('signup@tests.com');
        done();
      });
    });
  });
});

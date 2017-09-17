const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');

chai.use(chaiHTTP);
beforeEach(() => { 
  host = 'http://localhost:8000/'
});

describe('Authentication Over JWT', () => {
  describe('/signin-jwt', () => {
    beforeEach(() => {
      endPoint = 'signin-jwt';
    });
    it('should return invalid if no user or password', (done) => {
      chai.request(host).post(endPoint)
      .send({ username: '', password: ''})
      .end((err,res) => {
        expect(res).to.have.status(422);
        done();
      });
    });

    it('should return invalid if trying to login with invalid username/password combination', (done) => {  
      chai.request(host).post(endPoint)
      .send({ username: 'uuu', password: 'aaa'})
      .end((err,res) => {
        expect(res).to.have.status(422);
        done();
      });
    });
    
    it('should return status ok and a token if user and password are right', (done) => {
      chai.request(host).post(endPoint)
      .send({ username: 'testing@tests.com', password: '1234'})
      .end((err,res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.deep.property('token')
        done();
      });
    });
  });
});

describe('Authentication over Session', () => {
  describe('/signin-session', () => {
    beforeEach(() => {
      endPoint = 'signin-session';
    });
    it('should return invalid if no user or password', (done) => {
      chai.request(host).post(endPoint)
        .send({ username: '', password: ''})
        .end((err,res) => {
          expect(res).to.have.status(422);
          done();
      });
    });
    it('should return invalid if trying to login with invalid username/password combination', (done) => {  
      chai.request(host).post(endPoint)
      .send({ username: 'uuu', password: 'aaa'})
      .end((err,res) => {
        expect(res).to.have.status(422);
        done();
      });
    });
    it('should return status ok and display user testing@tests if user and password are right', (done) => {
      const agent = chai.request.agent(host)
      agent.post(endPoint)
      .send({ username: 'testing@tests.com', password: '1234'})
      .end((err,res) => {
        expect(res).to.have.status(200);
        agent.get('me')
        .then((res) => {
          expect(res).to.be.json;
          expect(res.body).to.have.deep.property('user');
          expect(res.body.user).to.be.equal('testing@tests.com');
          done();
        });
      });
    });
  });
});

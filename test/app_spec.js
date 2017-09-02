const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('express');

const expect = chai.expect;

chai.use(chaiHttp);

chai.request(app);

describe('Express', function() {
  it('Should return status code 200', function() {
    chai.request(app)
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
  });
});

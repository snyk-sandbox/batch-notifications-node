const expect = require("chai").expect;
const nock = require("nock");
const Config = require("../lib/utils/Config");
const Transactional = require("../lib/Transactional");
const fixture = require("./fixtures/transactional");
const options = require("./fixtures/options");

/**
 * @returns {Transactional}
 */
function createTransactionalHandler () {
    const cfg = new Config();
    cfg.setUserOptions(options);
    return new Transactional(cfg);
}

/**
 * @returns {String}
 */
function getURL () {
    const cfg = new Config();
    cfg.setUserOptions(options);
    return `${cfg.get("api.baseURL")}/${cfg.get("api.version")}/${cfg.get("api.devKey")}`;
}

describe("Transactional post", function () {
    it("should create a Transactional", function (done) {
        const Transactional = createTransactionalHandler();
        const batchURL = getURL();

        const payload = fixture.postMinimal.payload;
        const token = fixture.postMinimal.token;
        const status = fixture.postMinimal.statusCode;

        nock(batchURL)
        .post("/transactional/send", payload)
        .reply(status, token);

        Transactional.post(payload)
        .then(function (result) {
            expect(result).to.be.equal(token.token);
            done();
        })
        .catch((err) => done(err));
    });
});

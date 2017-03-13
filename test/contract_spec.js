var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests();
var web3 = EmbarkSpec.web3;

describe("SimpleStorage", function() {
    before(function(done) {
        var contractsConfig = {
            "SimpleStorage": {
                args: [100]
            }
        };
        EmbarkSpec.deployAll(contractsConfig, done);
    });

    it("should set constructor value", function(done) {
        SimpleStorage.storedData(function(err, result) {
            assert.equal(result.toNumber(), 100);
            done();
        });
    });

    it("set storage value", function(done) {
        SimpleStorage.set(150, function() {
            SimpleStorage.get(function(err, result) {
                assert.equal(result.toNumber(), 150);
                done();
            });
        });
    });

    it("accessing value from a", function(done) {
        SimpleStorage.a(1,function(err, result) {
            // console.log(result)
            assert.equal(result[0], 'Hola');
            assert.equal(result[1].toNumber(), 100);
            done();
        });
    });

});

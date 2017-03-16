var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests();
var web3 = EmbarkSpec.web3;

describe("ImageList", function() {
    before(function(done) {
        var contractsConfig = {
            "ImageList": {
            }
        };
        EmbarkSpec.deployAll(contractsConfig, done);
    });

    it("should set constructor value", function(done) {
            ImageList.addImage('abc', 1,1,1, {gas: 1000000}, function(){
                ImageList.getImageCount(function(e, d){
                    assert.equal(d.toNumber(), 1);
                    done();
                });              
            });
    });
});

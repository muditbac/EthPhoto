var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests();
var web3 = EmbarkSpec.web3;

describe("ImageList", function() {
    before(function(done) {
        var contractsConfig = {
            "ImageList": {
                args: []
            }
        };
        EmbarkSpec.deployAll(contractsConfig, done);
    });

    it("should add new image to list", function(done) {
        // TODO: Set up common values of gases required by transaction.
        ImageList.addImage('Sample Data Here', 1000, 1111, 156, {gas:1000000},  function() {
            ImageList.getCount(function(e, r){
                assert(r, 1);
                done();
            });
        });
    });
    it("should retrive newly added element", function(done) {
        ImageList.getImage(0, function(e, r) {
            assert(r[0], 'Sample Data Here');
            assert(r[1], 1000);
            assert(r[2], 1111);
            assert(r[3], 156);
            done();
        });
    });

});

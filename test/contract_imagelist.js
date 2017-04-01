var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests();
var web3 = EmbarkSpec.web3;


imageTestData = ['0xabcdeabcdeabcdeabcdeabcde', 'Image Caption Goes here', -100, 100, [1,2,3,4,5]];
imageTestData2 = ['0xabcdeabcdeabcdeabcdeabcde', 'Image Caption Goes here', 200, 300, [1,2,3,4,5]];

user1 = 'ethphoto123';
user2 = 'ethphoto123';

toAscii = function(s){
    return web3.toAscii(s).replace(/\0/g,'');
};

describe("Controller", function() {
    before(function(done) {
        var contractsConfig = {
            "ImageList":{
                "args": [],
                "gas": 4000000
            },
            "VotingList": {
            },
            "UserList" :{
            },
            "Controller": {
                "args": ["$ImageList", "$UserList", "$VotingList"],
                "onDeploy": [
                    "ImageList.transferOwnership(Controller.address, function(e, r){})",
                    "UserList.transferOwnership(Controller.address, function(e, r){})",
                    "VotingList.transferOwnership(Controller.address, function(e, r){})"
                ],
                "gas": 1000000
            }
        };
        EmbarkSpec.deployAll(contractsConfig, done);
    });

    it("should set constructor value", function(done) {
        Controller.userList(function (e, uList){
            Controller.imageList(function(e, iList){
                Controller.votingList(function(e, vList){
                    assert.equal(uList, UserList.address, 'UserList address not set');
                    assert.equal(iList, ImageList.address, 'ImageList address not set');
                    assert.equal(vList, VotingList.address, 'VotingList address not set');
                    done();
                });
            });
        });
    });

    it("add image to database", function(done) {
        Controller.addImage(imageTestData[0], imageTestData[1], imageTestData[2], imageTestData[3], imageTestData[4], {gas: 1000000},   function (err){
            ImageList.getImageCount(function(e, count){
                ImageList.getImage(0, function(e, data){
                    UserList.getImages(function (e, images){
                        assert.equal(count.toNumber(), 1);
                        assert.equal(images[0].toNumber(), 0, 'UserList image list mismatch');
                        assert.equal(data[0], imageTestData[0], 'Image data mismatch');
                        assert.equal(data[1], imageTestData[1], 'Image data mismatch');
                        assert.equal(data[2].toNumber(), imageTestData[2], 'Image data mismatch');
                        assert.equal(data[3].toNumber(), imageTestData[3], 'Image data mismatch');
                        assert.equal(data[4][0].toNumber(), imageTestData[4][0], 'Image data mismatch');
                        assert.equal(data[4][1].toNumber(), imageTestData[4][1], 'Image data mismatch');
                        assert.equal(data[4][2].toNumber(), imageTestData[4][2], 'Image data mismatch');
                        assert.equal(data[4][3].toNumber(), imageTestData[4][3], 'Image data mismatch');
                        assert.equal(data[4][4].toNumber(), imageTestData[4][4], 'Image data mismatch');
                        done();
                    });

                });
            });
        });
    });

    it("search images with latitude and longitude", function (done){
        // Adding addiditonal image
        Controller.addImage(imageTestData2[0], imageTestData2[1], imageTestData2[2], imageTestData2[3], imageTestData2[4], {gas: 1000000}, function(){
            // Computing count
            ImageList.getImagesWithLatLong(100, 250, 250, 0, function (e, data){
                // Getting list of points
                ImageList.getImagesWithLatLong(100, 250, 250, data[1].toNumber(), function (e, list){
                    assert.equal(list[0].length, 1, 'Number of images mismatch');
                    assert.equal(list[0][0].toNumber(), 1, 'Image index not match');
                    done();
                });
            });
        });
    });

    it("add and access images from another account", function (done){
        // Changing account
        web3.eth.getAccounts(function(_, accounts){
            account = accounts[1];
            // Finding image from another image
            UserList.getImages({from: account}, function (e, data){
                assert.equal(data.length, 0);
                // Adding image from another account
                Controller.addImage(imageTestData2[0], imageTestData2[1], imageTestData2[2], imageTestData2[3], imageTestData2[4], {gas: 1000000, from:account}, function(){
                    UserList.getImages({from: account}, function(e, list){
                        assert.equal(list.length, 1);
                        // Searching image with lat long
                        ImageList.getImagesWithLatLong(100, 250, 250, 0, function (e, data){
                            ImageList.getImagesWithLatLong(100, 250, 250, data[1].toNumber(), function (e, list){
                                assert.equal(list[0].length, 2, 'Number of images mismatch');
                                assert.equal(list[0][0].toNumber(), 1, 'Image index not match');
                                assert.equal(list[0][1].toNumber(), 2, 'Image index not match');
                                done();
                            });
                        });
                    });
                });
            })
        });
    });

    it("should delete owner's image", function (done){
        // Trying to delete another user's image
        Controller.deleteImage(2, function(){
            ImageList.getImageCount(function(_, count){
                assert.equal(count.toNumber(), 3);
                // Deleting self image
                Controller.deleteImage(1, function(){
                    ImageList.getImageCount(function(_, count){
                        assert.equal(count.toNumber(), 2);
                        // Deleting same image twice
                        Controller.deleteImage(1, function(){
                            ImageList.getImageCount(function(_, count){
                                assert.equal(count.toNumber(), 2);
                                // Checking the work of init flag
                                ImageList.getImagesWithLatLong(100, 250, 250, 0, function (e, data){
                                    ImageList.getImagesWithLatLong(100, 250, 250, data[1].toNumber(), function (e, list){
                                        assert.equal(list[0].length, 1, 'Number of images mismatch');
                                        assert.equal(list[0][0].toNumber(), 2, 'Image index not match');
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("should upvote image and avoid repeated upvoting and reward to user", function(done){
        ImageList.getUpvotes(0, function(e, data){
            assert.equal(data, 0);
            // Upvoting self images
            Controller.upvoteImage(0, function(){
                ImageList.getUpvotes(0, function (e, data){
                    assert.equal(data.toNumber(), 0);
                    // Upvoting deleted image
                    Controller.upvoteImage(1, function(){
                        ImageList.getUpvotes(1, function (e, data){
                            assert.equal(data.toNumber(), 0);
                            Controller.upvoteImage(2, function(){
                                ImageList.getUpvotes(2, function (e, data){
                                    assert.equal(data.toNumber(), 1);
                                    UserList.getReward({from: account}, function (err, data){
                                        // Upvoting same image twice
                                        assert.equal(data.toNumber(), 2);
                                        Controller.upvoteImage(2, function(){
                                            ImageList.getUpvotes(2, function (e, data){
                                                assert.equal(data.toNumber(), 1);
                                                // Upvoting from different account
                                                web3.eth.getAccounts(function(_, accounts){
                                                    account = accounts[2];
                                                    Controller.upvoteImage(2, {from: account}, function(){
                                                        ImageList.getUpvotes(2, function (e, data){
                                                            assert.equal(data.toNumber(), 2);
                                                            done();
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("should set and check username for different users", function(done){
        UserList.getUserName(function(err, username){
            assert.equal(toAscii(username),'');
            UserList.isUsernameSet(function(err, set){
                assert.equal(set, false);
                UserList.setUserName(user1, function(){
                    UserList.isUsernameSet(function(err, set){
                        assert.equal(set, true);
                        UserList.getUserName(function (err, username) {
                            assert.equal(toAscii(username),user1);
                            done();
                        });
                    });
                });
            });
        });
    });
    // TODO check downvotes

});

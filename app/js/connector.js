/**
 * Created by mudit on 23/3/17.
 */


var tags = [
    'love',
    'instagood',
    'me',
    'tbt',
    'cute',
    'follow',
    'followme',
    'photooftheday',
    'happy',
    'tagforlikes',
    'beautiful',
    'self',
    'girl',
    'picoftheday',
    'like4like',
    'smile',
    'friends',
    'fun',
    'like',
    'fashion',
    'summer',
    'instadaily',
    'igers',
    'instalike',
    'food',
    'swag',
    'amazing',
    'tflers',
    'follow4follow',
    'bestoftheday',
    'likeforlike',
    'instamood',
    'style',
    'wcw',
    'family',
    '141',
    'f4f',
    'nofilter',
    'lol',
    'life',
    'pretty',
    'repost',
    'hair',
    'my',
    'sun',
    'webstagram',
    'iphoneonly',
    'art',
    'tweegram',
    'cool',
    'followback',
    'instafollow',
    'instasize',
    'bored',
    'instacool',
    'funny',
    'mcm',
    'instago',
    'instasize',
    'vscocam',
    'girls',
    'all_shots',
    'party',
    'music',
    'eyes',
    'nature',
    'beauty',
    'night',
    'fitness',
    'beach',
    'look',
    'nice',
    'sky',
    'christmas',
    'baby'
];

(function(){
    $.each(tags, function (i, item) {
        $('#search-tags').append($('<option>', {
            value: i+1,
            text : item
        }));
        $('#tags-selector-upload').append($('<option>', {
            value: i+1,
            text : item
        }));
    });
})();
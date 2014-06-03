// ---------------------------------------------------------------------------------------------------------------------
// Test for thinky issues.
//
// @module thinky_test.js
// ---------------------------------------------------------------------------------------------------------------------

/*
var thinky = require('thinky')({ db: 'test_db' });
var r = thinky.r;
*/

var db = require('./server/models');

// ---------------------------------------------------------------------------------------------------------------------

//var db = {};

/*
db.Post = thinky.createModel('post', {
    name: String,
    content: String
}, { pk: 'name' });

db.Tag = thinky.createModel('tag', {
    name: String
}, { pk: 'name' });

db.Post.hasAndBelongsToMany(db.Tag, 'tags', 'name', 'name');
*/

/*
// Represents a feat
db.Feat = thinky.createModel('feat', {
    name: String,
    description: String
}, { pk: 'name'});

// Represents a talent
db.Talent = thinky.createModel('talent', {
    name: String,
    description: String
}, { pk: 'name'});

// Represents a mook
db.Mook = thinky.createModel('mook', {
    created: { _type: Date, default: r.now() },
    name: String
}, { pk: 'name' });

// Mook Relationships
db.Mook.hasAndBelongsToMany(db.Feat, 'feats', 'name', 'name');
db.Mook.hasAndBelongsToMany(db.Talent, 'talents', 'name', 'name');
*/

// ---------------------------------------------------------------------------------------------------------------------

/*
var post = new db.Post({
    name: "Some name 1",
    content: "This is some content."
});

var tag1 = new db.Tag({ name: "tag1" });
var tag2 = new db.Tag({ name: "tag2" });
var tag3 = new db.Tag({ name: "tag3" });

post.tags = [tag1, tag2, tag3];

post.saveAll(function()
{
    console.log('all saved!');
});
*/

var mook = new db.Mook({
    name: "Stormtrooper II"
});

var feat = new db.Feat({ name: "Some Feat", description: "This is a pretty sweet feat." });
feat.setSaved(true);

var talent = new db.Talent({ name: "Some Talent", description: "This is a pretty sweet talent." });
talent.setSaved(true);

mook.feats = [feat];
mook.talents = [talent];

mook.saveAll(function(error)
{
    if(error)
    {
        console.error(error);

        process.exit();
    }
    else
    {
        console.log('saved!');

        db.Mook.get("Stormtrooper II").getJoin().run().then(function(result)
        {
            console.log('result:', result);

            process.exit();
        });
    } // end if
});

// ---------------------------------------------------------------------------------------------------------------------
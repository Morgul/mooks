//----------------------------------------------------------------------------------------------------------------------
// Handle all websocket messages from the client.
//
// @module sockets.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var db = require('./models');

//----------------------------------------------------------------------------------------------------------------------

function SocketHandler(socket) {
    this.socket = socket;

    // Gets all mooks added in the last 2 weeks.
    this.socket.on('get recent', function(callback)
    {
        db.Mook.orderBy('created').limit(30).run().then(function(mooks)
        {
            callback(undefined, objectify(mooks));
        }).error(function(error)
        {
            console.error(error);
            callback(error.message || error.stack || error.toString());
        });
    });

    // Get all requested mooks.
    this.socket.on('get requested', function(callback)
    {
        db.Requested.filter({ locked: false }).run().then(function(requested)
        {
            callback(undefined, objectify(requested));
        }).error(function(error)
        {
            console.error(error);
            callback(error.message || error.stack || error.toString());
        });
    });

    // Get all requested mooks.
    this.socket.on('add requested', function(req, callback)
    {
        var reqInst = new db.Requested(req);
        reqInst.save().then(function()
        {
            callback();
        }).error(function(error)
        {
            console.error(error);
            callback(error.message || error.stack || error.toString());
        });
    });

    // Lock a requested mook for an hour
    this.socket.on('lock requested', function(name, callback)
    {
        db.Requested.get(name).update({ locked: true }).run().then(function()
        {
            callback();
        }).error(function(error)
        {
            console.error(error);
            callback(error.message || error.stack || error.toString());
        });
    });

    // Unlock a requested mook
    this.socket.on('unlock requested', function(name, callback)
    {
        db.Requested.get(name).update({ locked: false }).run().then(function()
        {
            callback();
        }).error(function(error)
        {
            console.error(error);
            callback(error.message || error.stack || error.toString());
        });
    });

    // Gets a mook by name
    this.socket.on('get mook', function(name, callback)
    {
        db.Mook.get(name).getJoin().run().then(function(mook)
        {
            callback(undefined, objectify(mook));
        }).error(function(error)
        {
            console.log('error:', error);
            callback(undefined, null);
        });
    });

    // Gets all mooks
    this.socket.on('get all mooks', function(callback)
    {
        db.Mook.getJoin().run().then(function(mooks)
        {
            callback(undefined, objectify(mooks));
        }).error(function(error)
        {
            console.log('error:', error);
            callback(undefined, null);
        });
    });

    // Saves a mook to the db
    this.socket.on('save mook', function(mook, callback)
    {
        // Remove any invalid objects
        mook.feats = _.reject(mook.feats, function(i){ return !i.name; });
        mook.talents = _.reject(mook.talents, function(i){ return !i.name; });
        mook.forcePowers = _.reject(mook.forcePowers, function(i){ return !i.name; });
        mook.forceTechniques = _.reject(mook.forceTechniques, function(i){ return !i.name; });
        mook.attacks = _.reject(mook.attacks, function(i){ return !i.text; });
        mook.skills = _.reject(mook.skills, function(i){ return !i.name; });

        var feats = [];
        var talents = [];
        var forcePowers = [];
        var forceTechniques = [];

        // Build new model instances for every feat, and if it is an existing feat, we set it's saved status
        // to `true`. This prevents primary key errors when calling `saveAll()`.
        mook.feats.forEach(function(featDef)
        {
            var feat = new db.Feat(featDef);

            if(featDef.exists)
            {
                delete featDef.exists;
                feat = new db.Feat(featDef);
                feat.setSaved(true);
            } // end if

            feats.push(feat);
        });

        // Build new model instances for every talent, and if it is an existing talent, we set it's saved status
        // to `true`. This prevents primary key errors when calling `saveAll()`.
        mook.talents.forEach(function(talentDef)
        {
            var talent = new db.Talent(talentDef);

            if(talentDef.exists)
            {
                delete talentDef.exists;
                talent = new db.Talent(talentDef);
                talent.setSaved(true);
            } // end if

            talents.push(talent);
        });

        // Build new model instances for every forcePower, and if it is an existing forcePower, we set it's saved status
        // to `true`. This prevents primary key errors when calling `saveAll()`.
        mook.forcePowers.forEach(function(forcePowerDef)
        {
            var forcePower = new db.ForcePower(forcePowerDef);

            if(forcePowerDef.exists)
            {
                delete forcePowerDef.exists;
                forcePower = new db.ForcePower(forcePowerDef);
                forcePower.setSaved(true);
            } // end if

            forcePowers.push(forcePower);
        });

        // Build new model instances for every forceTechnique, and if it is an existing forceTechnique, we set it's saved status
        // to `true`. This prevents primary key errors when calling `saveAll()`.
        mook.forceTechniques.forEach(function(forceTechniqueDef)
        {
            var forceTechnique = new db.Talent(forceTechniqueDef);

            if(forceTechniqueDef.exists)
            {
                delete forceTechniqueDef.exists;
                forceTechnique = new db.Talent(forceTechniqueDef);
                forceTechnique.setSaved(true);
            } // end if

            forceTechniques.push(forceTechnique);
        });

        // Due to a bug in thinky, if these are not _deleted_, the relations will not build correctly.
        delete mook.feats;
        delete mook.talents;
        delete mook.forcePowers;
        delete mook.forceTechniques;

        // Build the mook
        mook = new db.Mook(mook);
        mook.feats = feats;
        mook.talents = talents;
        mook.forcePowers = forcePowers;
        mook.forceTechniques = forceTechniques;

        console.log(mook);

        mook.saveAll(function(error)
        {
            if(error)
            {
                console.error(error);
                callback(error.message || error.stack || error.toString());
            } // end if

            callback(error, objectify(mook));
        });
    });

    // Autocomplete Feats
    this.socket.on('auto feat', function(name, callback)
    {
        db.Feat.filter(function(feat)
        {
            return feat('name').match(name);
        }).run().then(function(results)
        {
            callback(undefined, objectify(results));
        }).error(function(error)
        {
            console.error(error);
            callback(error.message || error.stack || error.toString());
        });
    });

    // Autocomplete Talents
    this.socket.on('auto talent', function(name, callback)
    {
        db.Talent.filter(function(talent)
        {
            return talent('name').match(name);
        }).run().then(function(results)
        {
            callback(undefined, objectify(results));
        }).error(function(error)
        {
            console.error(error);
            callback(error.message || error.stack || error.toString());
        });
    });

    // Autocomplete Force Powers
    this.socket.on('auto force powers', function(name, callback)
    {
        db.ForcePower.filter(function(power)
        {
            return power('name').match(name);
        }).run().then(function(results)
        {
            callback(undefined, objectify(results));
        }).error(function(error)
        {
            console.error(error);
            callback(error.message || error.stack || error.toString());
        });
    });

    // Autocomplete Force Techniques
    this.socket.on('auto force techniques', function(name, callback)
    {
        db.ForceTechnique.filter(function(technique)
        {
            return technique('name').match(name);
        }).run().then(function(results)
        {
            callback(undefined, objectify(results));
        }).error(function(error)
        {
            console.error(error);
            callback(error.message || error.stack || error.toString());
        });
    });

    // Autocomplete Mooks
    this.socket.on('auto mook', function(name, callback)
    {
        db.Mook.filter(function(mook)
        {
            return mook('name').match(name);
        }).run().then(function(results)
        {
            callback(undefined, objectify(results));
        }).error(function(error)
        {
            console.error(error);
            callback(error.message || error.stack || error.toString());
        });
    });
} // end socketHandler

//----------------------------------------------------------------------------------------------------------------------

function objectify(model)
{
    return JSON.parse(JSON.stringify(model));
} // end objectify

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    init: function(socketServer)
    {
        socketServer.on('connection', function(socket)
        {
            return new SocketHandler(socket);
        });
    } // end init
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
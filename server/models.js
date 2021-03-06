//----------------------------------------------------------------------------------------------------------------------
// Thinky models for the mooks.
//
// @module models.js
//----------------------------------------------------------------------------------------------------------------------

//var thinky = require('thinky')({ host:'209.144.228.139', db: 'mooks_and_minions' });

var thinky = require('thinky')({ db: 'mooks_and_minions' });
var r = thinky.r;

//----------------------------------------------------------------------------------------------------------------------

var db = { r:r };

// Represents a desired mook. (Book/page should be optional.)
db.Requested = thinky.createModel('requested', {
    name: String,
    book: String,
    page: Number,
    locked: { _type: Boolean, default: false }
}, { pk: 'name'});

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

// Represents a force power
db.ForcePower = thinky.createModel('force_power', {
    name: String,
    description: String
}, { pk: 'name'});

// Represents a force technique
db.ForceTechnique = thinky.createModel('force_technique', {
    name: String,
    description: String
}, { pk: 'name'});

// Represents a mook
db.Mook = thinky.createModel('mook', {
    created: { _type: Date, default: r.now() },
    name: String,
    type: String,
    cl: Number,
    destiny: Number,
    force: Number,
    darkside: Number,
    languages: String,
    senses: String,
    initiative: Number,
    baseAttack: Number,
    grapple: Number,
    ref: Number,
    fort: Number,
    will: Number,
    hp: Number,
    dr: Number,
    threshold: Number,
    speed: Number,
    abilities: {
        _type: Object,
        schema: {
            strength: Number,
            constitution: Number,
            dexterity: Number,
            intelligence: Number,
            wisdom: Number,
            charisma: Number
        },
        enforce_missing: true,
        enforce_extra: true
    },
    attacks: [{
        type: String,
        text: String
    }],
    attackOptions: String,
    specialActions: String,
    skills: [{
        name: String,
        value: Number
    }],
    possessions: String
}, { pk: 'name' });

// Mook Relationships
db.Mook.hasAndBelongsToMany(db.Feat, 'feats', 'name', 'name');
db.Mook.hasAndBelongsToMany(db.Talent, 'talents', 'name', 'name');
db.Mook.hasAndBelongsToMany(db.ForcePower, 'forcePowers', 'name', 'name');
db.Mook.hasAndBelongsToMany(db.ForceTechnique, 'forceTechniques', 'name', 'name');

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// Controller for the encounters page.
//
// @module encounter.js
// ---------------------------------------------------------------------------------------------------------------------

function LocalStore(path)
{
    this.path = path + '.';
}

LocalStore.prototype.get = function(key, defaultVal)
{
    var valStr = localStorage[this.path + key];

    if(valStr)
    {
        return angular.fromJson(valStr);
    }
    else
    {
        return defaultVal;
    } // end if
};

LocalStore.prototype.set = function(key, object)
{
    localStorage[this.path + key] = angular.toJson(object);
};

// ---------------------------------------------------------------------------------------------------------------------

function Encounter($scope)
{
    var self = this;
    this.$scope = $scope;
    this.conditions = [
        "Normal",
        "One Step Down (-1)",
        "Two Steps Down (-2)",
        "Three Steps Down (-5)",
        "Four Steps Down (-10)",
        "Helpless"
    ];
    this.mooks = [];
    this.store = new LocalStore('mooks');

    this._load();

    // Build watch
    this.$scope.$watch('encounter.mooks', function(oldVal, newVal)
    {
        self.update();
    }, true);
} // end Encounter

Encounter.prototype = {
    get notes() {
        return this.store.get('notes', "");
    },
    set notes(val) {
        this.store.set('notes', val);
    }
};

Encounter.prototype._load = function()
{
    this.mooks = this.store.get('encounter', []);
}; // end _load

Encounter.prototype.getName = function(mookName)
{
    var counts = _.countBy(this.mooks, 'name');

    if((counts[mookName] || 0) < 1)
    {
        return mookName;
    }
    else
    {
        return mookName + " " + (counts[mookName] + 1);
    } // end if
};

Encounter.prototype.add = function(mook)
{
    var mookInstance = {
        name: this.getName(mook.name),
        hp: mook.hp,
        condition: "Normal",
        notes: "",
        template: mook
    };

    // Add it to our in-memory store
    this.mooks.push(mookInstance);

    // Update the local storage
    this.update();
}; // end add

Encounter.prototype.delete = function(index)
{
    this.mooks.splice(index, 1);
    this.update();
}; // end delete

Encounter.prototype.update = function()
{
    this.store.set('encounter', this.mooks);
}; // end update

Encounter.prototype.clearAll = function()
{
    this.mooks = [];
    this.store.set('encounter', []);
}; // end clearAll

// ---------------------------------------------------------------------------------------------------------------------

function EncounterController($scope, $q, $dice)
{
    this.$scope = $scope;
    $scope.encounter = new Encounter($scope);
    $scope.numToAdd = 1;
    $scope.rollHistory = [];
    $scope.roll = {
        outerMult: 1,
        mult: 1,
        sides: 6,
        bonus: 0,
        outerBonus: 0
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.autoMook = function(completion)
    {
        var deferred = $q.defer();

        $scope.socket.emit('auto mook', completion, function(error, results)
        {
            if(error)
            {
                console.error('error:', error);
                deferred.reject(error);
            }
            else
            {
                deferred.resolve(results);
            } // end if
        });

        return deferred.promise;
    }; // end autoMook


    // Assumes a roll objects like this:
    //
    // {
    //     outerMult: 1,
    //     mult: 1,
    //     sides: 6, <-- required
    //     bonus: 0,
    //     outerBonus: 0
    // }
    $scope.rollDice = function(roll)
    {
        if(roll)
        {
            // Build title
            var title = "";
            title += roll.outerMult > 1 ? roll.outerMult + "(" : "";
            title += (roll.outerMult < 1) && (roll.outerBonus > 0) ? "(" : "";
            title += (roll.mult || 1) + "d" + roll.sides;
            title += roll.bonus > 0 ? " + " + roll.bonus : "";
            title += (roll.outerMult > 1) || (roll.outerBonus > 0) ? ")" : "";
            title += roll.outerBonus > 0 ? " + " + roll.outerBonus : "";

            var results = {
                total: 0,
                rolls: [],
                bonus: 0,
                outerBonus: 0,
                title: title,
                text: ""
            };

            for(var idx = 0; idx < (roll.outerMult || 1); idx++)
            {
                var subRoll = [];
                for(var ydx = 0; ydx < (roll.mult || 1); ydx++)
                {
                    var res = $dice.roll(roll.sides || 6);
                    results.total += res;
                    subRoll.push(res);
                } // end for

                results.rolls.push(subRoll);
                results.total += (roll.bonus || 0);
                results.bonus = roll.bonus;
            } // end for

            results.total += (roll.outerBonus || 0);
            results.outerBonus = roll.outerBonus;

            //------------------------------------------------
            // Build result
            //------------------------------------------------

            function buildSubRoll(subRoll, bonus) {
                return "( " + subRoll.join(', ') + " )" + (bonus ? " + " + bonus : "");
            }

            results.text += (results.rolls.length > 1) ? "[" : "";

            var subRolls = [];
            for(var zdx = 0; zdx < results.rolls.length; zdx++)
            {
                subRolls.push(buildSubRoll(results.rolls[zdx], results.bonus))
            } // end for

            results.text += subRolls.join(', ');
            results.text += (results.rolls.length > 1) ? "]" : "";
            results.text += results.outerBonus > 0 ? " + " + results.outerBonus : "";

            //------------------------------------------------

            // Add it to the history
            $scope.rollHistory.unshift(results);
        } // end if
    };

    $scope.add = function()
    {
        $scope.socket.emit('get mook', $scope.mookName, function(error, mook)
        {
            if(error)
            {
                console.log('error getting mook:', error);
            }
            else
            {
                $scope.mookName = "";
                $scope.$apply(function()
                {
                    for(var idx = 0; idx < $scope.numToAdd; idx++)
                    {
                        $scope.encounter.add(mook);
                    } // end for
                });
            } // end if
        });
    }; // end search

    $scope.clearAll = function()
    {
        this.encounter.clearAll();
    }; // end clearAll
} // end EncounterController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks.controllers').controller('EncounterController', ['$scope', '$q', '$dice', EncounterController]);

// ---------------------------------------------------------------------------------------------------------------------
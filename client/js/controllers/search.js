// ---------------------------------------------------------------------------------------------------------------------
// The Search page controller
//
// @module search.js
// ---------------------------------------------------------------------------------------------------------------------

function SearchController($scope, $q)
{
    //TODO: Remove! For testing only!
    //$scope.mook = JSON.parse('{"abilities":{"charisma":10,"constitution":11,"dexterity":11,"intelligence":10,"strength":12,"wisdom":10},"attackOptions":"autofire (blaster rifle)","attacks":[{"text":"unarmed +4 (1d4+1)","type":"Melee"},{"text":"blaster rifle +4 (3d8)","type":"Ranged"},{"text":"frag grenade (4d6, 2-square burst)","type":"Ranged"}],"baseAttack":3,"cl":1,"created":"2014-06-03T15:52:15.365Z","darkside":1,"feats":[{"description":"... too lazy","name":"Weapon Focus"},{"description":"... too lazy","name":"Coordinated Attack"},{"description":"You are proficient with light armor.","name":"Armor Proficiency (light)"}],"fort":12,"grapple":4,"hp":10,"initiative":2,"languages":"Basic","name":"Stormtrooper","possessions":"...too damned many.","ref":16,"senses":"low-light vision, Perception +9","skills":[{"name":"Endurance","value":7},{"name":"Perception","value":9}],"specialActions":"Coordinated Attack","speed":6,"talents":[],"threshold":12,"type":"Medium human nonheroic 4","will":10} ');
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
    };

    $scope.search = function()
    {
        $scope.socket.emit('get mook', $scope.mookName, function(error, mook)
        {
            $scope.$apply(function()
            {
                $scope.mook = mook;
            });
        })
    }
} // end SearchController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks.controllers').controller('SearchController', ['$scope', '$q', SearchController]);

// ---------------------------------------------------------------------------------------------------------------------
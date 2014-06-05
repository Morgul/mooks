// ---------------------------------------------------------------------------------------------------------------------
// The Search page controller
//
// @module search.js
// ---------------------------------------------------------------------------------------------------------------------

function SearchController($scope, $q)
{
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
            console.log('got mook:', mook);
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
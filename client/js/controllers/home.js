// ---------------------------------------------------------------------------------------------------------------------
// The Home page controller
//
// @module home.js
// ---------------------------------------------------------------------------------------------------------------------

function HomeController($scope)
{
    function loadRecent() {
        $scope.socket.emit('get recent', function(error, recent)
        {
            if(error) { console.error('Error getting recent:', error); }

            $scope.$apply(function()
            {
                $scope.recent = recent;
            });
        });
    } // end loadRecent

    // Listen for the connected event, and load our requested mooks, if it comes in.
    $scope.$on('connected', function(event, socket)
    {
        if(!$scope.requested)
        {
            loadRecent();
        } // end if
    });

    // Otherwise, when the view loads, if we have a socket, load the requested mooks.
    $scope.$on('$viewContentLoaded', function(event, socket)
    {
        if($scope.socket)
        {
            loadRecent();
        } // end if
    });

} // end HomeController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks.controllers').controller('HomeController', ['$scope', HomeController]);

// ---------------------------------------------------------------------------------------------------------------------
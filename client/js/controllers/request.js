// ---------------------------------------------------------------------------------------------------------------------
// Controller for request page.
//
// @module request.js
// ---------------------------------------------------------------------------------------------------------------------

function RequestController($scope) {
    $scope.req = {};

    function loadRequested() {
        $scope.socket.emit('get requested', function(error, requested)
        {
            if(error) { console.error('Error getting requested:', error); }

            $scope.$apply(function()
            {
                $scope.requested = requested;
            });
        });
    }

    // Listen for the connected event, and load our requested mooks, if it comes in.
    $scope.$on('connected', function(event, socket)
    {
        if(!$scope.requested)
        {
            loadRequested();
        } // end if
    });

    // Otherwise, when the view loads, if we have a socket, load the requested mooks.
    $scope.$on('$viewContentLoaded', function(event, socket)
    {
        if($scope.socket)
        {
            loadRequested();
        } // end if
    });

    $scope.addRequest = function()
    {
        if(!_.isEmpty($scope.req))
        {
            $scope.socket.emit('add requested', $scope.req, function(error)
            {
                if(error)
                {
                    console.error('Error adding request:', error);
                }
                else
                {
                    $scope.req = {};
                    loadRequested();
                } // end if
            });
        } // end if
    }; // end addRequest
} // end RequestController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks.controllers').controller('RequestController', ['$scope', RequestController]);

// ---------------------------------------------------------------------------------------------------------------------
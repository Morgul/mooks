// ---------------------------------------------------------------------------------------------------------------------
// A directive for displaying a mook.
//
// @module mook
// ---------------------------------------------------------------------------------------------------------------------

function MookFactory()
{
    function MookController($scope, $attrs)
    {
    } // end MookController

    return {
        restrict: 'E',
        scope: {
            mook: "=model"
        },
        replace: 'true',
        templateUrl: '/partials/directives/mook.html',
        controller: ['$scope', '$attrs', MookController]
    }
} // end MookFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks.directives').directive('mook', [MookFactory]);

// ---------------------------------------------------------------------------------------------------------------------
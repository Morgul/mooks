// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of kvp-list.
//
// @module kvp-list
// ---------------------------------------------------------------------------------------------------------------------

function KVPListFactory()
{
    function KVPController($scope, $attrs, $q)
    {
        if(!$scope.model)
        {
            $scope.model = [{}];
        } // end if

        $scope._name = $scope.name();
        if(!$scope._name) {
            $scope._name = $attrs.name;
        } // end try/catch

        $scope._key = $scope.key();
        if(!$scope._key) {
            $scope._key = $attrs.key;
        } // end try/catch

        $scope._keyType = $scope.keyType();
        if(!$scope._keyType)
        {
            $scope._keyType = $attrs.keyType;
        }
        else if(angular.isArray($scope._keyType))
        {
            $scope._keyType = 'list';
        } // end try/catch

        $scope._keyComplete = $scope.keyComplete();
        if(!$scope._keyComplete) {
            $scope._keyComplete = function(){ return new $q.defer().promise; };
        } // end try/catch

        $scope._value = $scope.value();
        if(!$scope._value) {
            $scope._value = $attrs.value;
        } // end try/catch

        $scope._valueType = $scope.valueType();
        if(!$scope._valueType)
        {
            $scope._valueType = $attrs.valueType;
        }
        else if(angular.isArray($scope._valueType))
        {
            $scope._valueType = 'list';
        } // end try/catch

        $scope.autocomplete = function(kvp, $item)
        {
            _.assign(kvp, $item);
            kvp.exists = true;
        };

        $scope.addItem = function()
        {
            $scope.model.push({});
        };

        $scope.removeItem = function(index)
        {
            $scope.model.splice(index, 1);
        };
    } // end KVPController

    return {
        restrict: 'E',
        scope: {
            model: "=",
            name: "&",
            key: "&",
            value: "&",
            keyType: "&",
            keyComplete: "&",
            valueType: "&"
        },
        replace: 'true',
        templateUrl: '/partials/directives/kvp.html',
        controller: ['$scope', '$attrs', '$q', KVPController]
    }
} // end KVPListFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks.directives').directive('kvpList', [KVPListFactory]);

// ---------------------------------------------------------------------------------------------------------------------
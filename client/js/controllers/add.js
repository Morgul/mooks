// ---------------------------------------------------------------------------------------------------------------------
// The Add page controller
//
// @module add.js
// ---------------------------------------------------------------------------------------------------------------------

function AddController($scope, $timeout, $q) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    var self = this;

    var mookTemplate = {
        cl: 1,
        abilities: {
            strength: 10,
            constitution: 10,
            dexterity: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        }
    };

    $scope.mook = angular.copy(mookTemplate);

    $scope.timer = {
        total: 60 * 60,
        remainingMS: function() { return (this.remaining || 0) * 1000 }
    };

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

    $scope.lockMook = function()
    {
        if($scope.mook.name)
        {
            $scope.socket.emit('lock requested', $scope.mook.name, function(error)
            {
                if(error)
                {
                    console.error('Error locking mook:', error);
                } // end if
            });

            $scope.requested = _.reject($scope.requested, function(item){ return item.name == $scope.mook.name });
            $scope.mook.locked = true;

            // Scroll the form into view
            $timeout(function(){ angular.element('#mook-form')[0].scrollIntoView(); }, 20);

            self.countDown(function()
            {
                $scope.unlockMook();
            });
        } // end if
    }; // end lockMook

    $scope.unlockMook = function()
    {
        if($scope.mook.locked)
        {
            $scope.socket.emit('unlock requested', $scope.mook.name, function(error)
            {
                if(error)
                {
                    console.log('Error unlocking mook:', error);
                }
                else
                {
                    $scope.mook.locked = false;
                    loadRequested();
                } // end if
            });
        } // end if
    }; // end unlockMook

    $scope.autoFeat = function(completion)
    {
        var deferred = $q.defer();

        $scope.socket.emit('auto feat', completion, function(error, results)
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

    $scope.autoTalent = function(completion)
    {
        var deferred = $q.defer();

        $scope.socket.emit('auto talent', completion, function(error, results)
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

    $scope.saveMook = function()
    {
        // Remove unneeded key
        $scope.mook.locked = undefined;

        $scope.socket.emit('save mook', $scope.mook, function(error)
        {
            if(error)
            {
                console.error('Error saving mook:', error);
            }
            else
            {
                $scope.mook = angular.copy(mookTemplate);
            } // end if
        });
    }; // end saveMook
} // end AddController

AddController.prototype.countDown = function (callback)
{
    var $timeout = this.$timeout;
    var timer = this.$scope.timer;
    if(!timer.remaining)
    {
       timer.remaining = timer.total;
    } // end if

    // Recursively timeout
    function timeout()
    {
        $timeout(function() {
            timer.remaining--;
            if(timer.remaining > 0)
            {
                timeout();
            }
            else
            {
                callback();
            } // end if
        }, 1000);
    } // end timeout

    timeout();
}; // end countDown

// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks.controllers').controller('AddController', ['$scope', '$timeout', '$q', AddController]);

// ---------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------
// Main Tome application.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks', [
        'ngRoute',
        'ui.bootstrap',
        'mooks.controllers',
        'mooks.directives'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {templateUrl: '/partials/home.html',   controller: 'HomeController'})
            .when('/search', {templateUrl: '/partials/search.html',   controller: 'SearchController'})
            .when('/request', {templateUrl: '/partials/request.html',   controller: 'RequestController'})
            .when('/add', {templateUrl: '/partials/add.html',   controller: 'AddController'})
            .otherwise({redirectTo: '/'});
    }])
    .run(function($rootScope, $route)
    {
        $rootScope.$route = $route;
        $rootScope.navCollapse = true;

        // Connect to unisocket
       // var socket = unisocket.connect(window.location.host);
        $rootScope.socket = io();
        $rootScope.socket.on('connected', function()
        {
            console.log('connected.');
            $rootScope.$apply(function()
            {
                $rootScope.$broadcast('connected', socket);
            });
        });
    })
    .filter('capitalize', function()
    {
        return function(input, scope)
        {
            if (input!=null)
            {
                input = input.toLowerCase();
            } // end if

            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    });

// ---------------------------------------------------------------------------------------------------------------------
// Module declarations
// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks.controllers', []);
angular.module('mooks.directives', []);

// ---------------------------------------------------------------------------------------------------------------------
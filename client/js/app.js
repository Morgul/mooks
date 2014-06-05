// ---------------------------------------------------------------------------------------------------------------------
// Main Tome application.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks', [
        'ngRoute',
        'ui.bootstrap',
        'mooks.filters',
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
// Filters
// ---------------------------------------------------------------------------------------------------------------------

// Markdown filter (Note: Must be used with ng-bind!)
angular.module('mooks.filters', []).filter('markdown', function($rootScope, $sce, $cacheFactory)
{
    function simpleHash(s)
    {
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    } // end hash

    if(!$rootScope.markdownCache)
    {
        $rootScope.markdownCache = $cacheFactory('markdown-cache', 100);
    } // end if

    return function markdown(text, skipCache)
    {
        if(text)
        {
            if(!skipCache)
            {
                var hash = simpleHash(text);
                var value = $rootScope.markdownCache.get(hash);
                if(value)
                {
                    return $sce.trustAsHtml(value);
                } // end if
            } // end if

            var mdown = marked(text);

            // Support leading newlines.
            text.replace(/^(\r?\n)+/, function(match)
            {
                mdown = match.split(/\r?\n/).join("<br>") + mdown;
            });

            if(!skipCache)
            {
                $rootScope.markdownCache.put(hash, mdown);
            } // end if

            return $sce.trustAsHtml(mdown);
        } // end if
    }; // end markdown
});

// ---------------------------------------------------------------------------------------------------------------------
// Module declarations
// ---------------------------------------------------------------------------------------------------------------------

angular.module('mooks.controllers', []);
angular.module('mooks.directives', []);

// ---------------------------------------------------------------------------------------------------------------------
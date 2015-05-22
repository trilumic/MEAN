/**
 * Main-file creating the angular application/module
 * Configures routes and states via stateProvider
 * Contains .run-method to execute code on start or on state change (reactive)
 * Created by michelt on 29.04.2015.
 */


'use strict';
(function() {

    //Application dependencies
    var dependencies = [
        'ngCookies',
        'ngRoute',
        'ui.router',
        'ui.bootstrap',
        'ngMessages'
    ];

    //Define Angular module
    var module = angular.module('CCYPApp', dependencies)

        //Define routes and states of the application
        .config(['$stateProvider','$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
            $urlRouterProvider.otherwise('/');

            //map resources to states and URLs
            $stateProvider
                .state('/', {
                    url: '/',
                    templateUrl: 'views/default.html',
                    controller: 'LoginController',
                    data: {
                        requireLogin: false
                    }
                })
                .state('restricted', {
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        requireLogin: true
                    }
                })
                .state('restricted.project', {
                    url: '/project/overview',
                    templateUrl: 'views/overviewProjects.html',
                    controller: 'ProjectController'
                })
                .state('restricted.projectEdit', {
                    url: '/project/edit/:id',
                    templateUrl: 'views/editProjectForm.html',
                    controller: 'ProjectEditController'
                })
                .state('restricted.projectDetail', {
                    url: '/project/:id',
                    templateUrl: 'views/detailProject.html',
                    controller: 'ProjectEditController'
                })
        }])


        //Defines reactive functions to be used on registered changes (page reload, state change)
        .run(['$rootScope', '$state', 'loginModal', '$cookieStore', '$http', 'UserApi', function($rootScope, $state, loginModal, $cookieStore, $http, UserApi) {

            var usrCookie = $cookieStore.get('auth');
            $rootScope.currentUser = usrCookie;
            if(usrCookie){
                $http.defaults.headers.common.Authorization = usrCookie;
            }

            $rootScope.logout = function(){
                UserApi.logout();
                $cookieStore.remove('auth');
                delete $rootScope.currentUser;
                delete $http.defaults.headers.Authorization;
                usrCookie = 'undefined';
                $state.go('/');
                alert('Logged out');
            };

            $rootScope.login = function(){
                if(typeof $rootScope.currentUser === 'undefined'){
                    if(usrCookie !== 'undefined'){
                        $http.defaults.headers.common.Authorization = usrCookie;
                        $rootScope.currentUser = usrCookie;
                    }
                }

                if(typeof  $rootScope.currentUser === 'undefined') {
                    event.preventDefault();

                    loginModal()
                        .then(function() {
                            $http.defaults.headers.common.Authorization = $rootScope.currentUser;
                            return $state.go('/');
                        })
                        .catch(function(){
                            return $state.go('/');
                        });
                }

            };
            ////////////////////////////////////////////////////////////////////////////////////////
            /* Teil der Vorarbeit (Auth-Modul) zur IPA, prüft den Login-Status des Benutzers:
                - Prüft "requireLogin" des stateProviders
                - Bei notwendigem Login wird überprüft, ob noch ein Auth-Token in den Cookies gespeichert ist
                (z.B. nach Browser-Neustart)
                - Bei fehlender Authentifizierung wird das Login-Modal angezeigt
             *///Auth-Check/////////////////////////////////////////////////////////////////
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams){

                var requireLogin = toState.data.requireLogin;
                var usrCookie = $cookieStore.get('auth');

                if(requireLogin && typeof $rootScope.currentUser === 'undefined'){
                    if(usrCookie){
                        $http.defaults.headers.common.Authorization = usrCookie;
                        $rootScope.currentUser = usrCookie;
                    }
                }

                if(requireLogin && typeof  $rootScope.currentUser === 'undefined') {
                    event.preventDefault();

                    loginModal()
                        .then(function() {
                            $http.defaults.headers.common.Authorization = $rootScope.currentUser;
                            return $state.go(toState.name, toParams);
                        })
                        .catch(function(){
                            return $state.go('/');
                        });
                };
            });
            ////////////////////////////////////////////////////////////////////////////////
        }]);
})();


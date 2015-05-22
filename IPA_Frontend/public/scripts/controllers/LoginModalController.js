/**
 * LoginModalController
 * Controller used by loginModal, is used in every loginModal to provide
 * the login-functionality throughout the application
 *
 * Created by michelt on 29.04.2015.
 */

(function(angular) {
    'use strict';
    var module = angular.module('CCYPApp')

        //Define LoginModalController
        .controller('LoginModalCtrl', [ '$scope', '$rootScope', '$http' ,'UserApi', '$cookieStore',
            function ($scope, $rootScope, $http , UserApi, $cookieStore) {

            //Cancel-Button dismisses scope
            this.cancel = $scope.$dismiss;

            this.submit = function (email, password) {

                //TODO: Intercept invalid response
                //Check auth-response from backend and create token and cookie if successful
                UserApi.login(email, password).then(function (user) {
                    if(user && user.data !== "Invalid"){
                        console.log("In UserApi.login(), " + user.data );
                        var auth = user.data;
                        $rootScope.currentUser = auth;
                        $cookieStore.put('auth', auth);
                        alert($cookieStore.get('auth'));
                        $http.defaults.headers.common.Authorization = auth;
                        $scope.$close(user);
                    }
                    else
                    {
                        alert('User not valid, please try again');
                    }
                }).catch(function(error){
                    alert("User not valid, please try again");
                });
            };
        }]);


})(angular);
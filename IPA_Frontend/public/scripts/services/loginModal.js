/**
 * Creates a modal based on the template loginModalTemplate.html,
 * using LoginModalController as Controller
 * Created by michelt on 29.04.2015.
 */


(function() {
    'use strict';
    //Fetch angular module
    var module = angular.module('CCYPApp')

        //Define loginModal-Service
        .service('loginModal', ['$modal', '$rootScope', function($modal, $rootScope){

            return function() {
                var instance = $modal.open({
                    templateUrl: 'templates/loginModalTemplate.html',
                    controller: 'LoginModalCtrl',
                    controllerAs: 'LoginModalCtrl'
                })

                return instance.result;
            };
        }]);
})(angular);
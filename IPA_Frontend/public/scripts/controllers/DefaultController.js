/**
 * DefaultController
 * Used on the welcome page
 * Contains functions to login a user
 * Contains functions to add a project from the welcome page (default.html) if logged in
 *
 * Created by michelt on 29.04.2015.
 */

(function(angular) {
    'use strict';
    //Fetch angular module/app
    var module = angular.module('CCYPApp')

        //Define LoginController
        .controller('LoginController', [ '$state', 'UserApi', '$scope', 'backend', function($state, UserApi, $scope, backend){

            //submit function, redirects data o userAPI and links back to the welcome page
            $scope.submit = function(email, password){
                UserApi.login(email, password);
                $state.go('/');
            };

    //POST project
    $scope.addProject = function(project){

        backend.saveProject(project).
            success(function(data, status, headers, config) {
                var date = new Date().toLocaleString();
                console.log(date + ': SUCCESSFUL,  ' + status);
                $scope.project = {};
                alert("Projekt wurde erfasst");
                $state.go('restricted.project');

            }).error(function(data, status, headers, config) {
                var date = new Date().toLocaleString();
                console.log(date +' ERROR: Adding project failed, ' + status);
            });
    };

    //datePicker-utility-function, sets the earliest date to be used when creating a new project
    $scope.setMinDate = function(element_id){

        var date = new Date();

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

        var today = year + "-" + month + "-" + day;
        document.getElementById(element_id).min = today;

    };

            //datePicker-utitlity-function, forces end_date to be at least the starting date
    $scope.setMaxDate = function(element_id){
        document.getElementById(element_id).min = document.getElementById('start_date').min;
    }


    $scope.today = function() {
        $scope.start_date = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.project.project.start_date = null;
        $scope.project.project.end_date = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open_start = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened_start = true;
    };
    $scope.open_end = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened_end = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    //Used after selection, checks if entered end_date is later than the defined start_date
    $scope.checkDate = function(){

        if($scope.project.project.end_date && $scope.project.project.start_date > $scope.project.project.end_date){
            $scope.projectForm.$invalid;
            alert("Enddatum muss nach dem Startdatum liegen");
            $scope.clear();
        }

    };

    $scope.formats = ['dd. MMMM yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
        }]);

})(angular);
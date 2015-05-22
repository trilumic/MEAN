/**
 * ProjectEditController
 * Contains functions to update, get and delete projects.
 * Used wherever the basic ProjectController does not cover functionality, as in project mutation
 * and detail view
 * Created by michelt on 29.04.2015.
 */

(function(angular) {
    'use strict';
    var module = angular.module('CCYPApp')

        //Define ProjectEditController
        .controller('ProjectEditController', ['$http', '$scope', 'backend', '$stateParams', '$location', '$state', function ($http, $scope, backend, $stateParams, $location, $state) {

            $scope.project = {};
            var id = $stateParams.id;

            //GET Project (byId)
            backend.getProject(id).then(function success(response){
                $scope.project = response.data;
            }, function error(error){
                var date = new Date().toLocaleString();
                console.log(date +' ERROR: Getting projectById failed, ' + error);
            });

            //PUT Project (update)
            $scope.updateProject = function(){
                backend.updateProject($scope.project, id).success(function(){
                    $location.url('/project/overview');
                }, function error(error){
                    var date = new Date().toLocaleString();
                    console.log(date +' ERROR: Updating project failed, ' + error);
                });
            };
            //DELETE Project
            $scope.deleteProject = function (project) {
                if (confirm("Das Projekt \"" + project.project.title + "\" wirklich löschen?")) {
                    backend.deleteProject(project).success(function () {

                        alert("Das Projekt wurde gelöscht");
                        $state.go('restricted.project');
                    });
                }
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

            $scope.checkDate = function(){

                if($scope.project.project.end_date && $scope.project.project.start_date > $scope.project.project.end_date){
                    $scope.projectEditForm.$invalid;
                    //TODO: Ersetzen durch Meldung/Errormessage im Formular
                    alert("Enddatum muss nach dem Startdatum liegen");
                    $scope.clear();
                }

            };

            //TODO: Format zum Speichern in der DB festlegen und anpassen
            $scope.formats = ['dd. MMMM yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

            //////////////////////////////////////////////////////////////

        }]);
})(angular);



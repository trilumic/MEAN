/**
 * ProjectController
 * Contains functions to handle project data and redirect to the backend
 * Created by michelt on 29.04.2015.
 */

(function(angular) {
    'use strict';
    var app = angular.module('CCYPApp')

        //Define ProjectController
        .controller('ProjectController', ['$http', '$scope', '$rootScope', 'backend', '$location', '$timeout', '$state', function ($http, $scope, $rootScope, backend, $location, $timeout, $state) {
            $scope.project = {};
            $scope.projects = [];

            //GET all projects, redirecting to backend-service
            backend.getProjects().then(function success(result) {
                    $scope.projects = result.data;
                },
                function failure(status) {
                    var date = new Date().toLocaleString();
                    console.log(date + ' ERROR: Getting projects failed, ' + status);
                });

            //POST add project, redirecting to backend-service
            $scope.addProject = function (project) {
                $scope.projects.push($scope.project);
                backend.saveProject(project).
                    success(function (data, status, headers, config) {
                        var date = new Date().toLocaleString();
                        console.log(date + ': SUCCESSFUL,  ' + status);
                        $scope.project = {};
                        alert("Projekt wurde erfasst");
                        $state.go('restricted.project');
                    }.error(function (data, status, headers, config) {
                            var date = new Date().toLocaleString();
                            console.log(date + ' ERROR: Adding project failed, ' + status);
                        }));
            };

            //POST update/mutate project, redirecting to backend-service
            $scope.updateProject = function (project) {

                backend.getProject(project._id).then(function success(response) {
                    $scope.training = response;
                });
            };

            //POST delete project, redirecting to backend-service
            $scope.deleteProject = function (project) {
                if (confirm("Das Projekt \"" + project.project.title + "\" wirklich löschen?")) {
                    backend.deleteProject(project).success(function () {
                        $timeout(function () {
                            $scope.projects.splice($scope.projects.indexOf(project), 1);
                        }, 600);
                        alert("Das Projekt wurde gelöscht");
                    });
                }
            }
        }]);
}) (angular);
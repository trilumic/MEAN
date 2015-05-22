/**
 * Backend-Service
 * Defines functions to access the backend/persistence-server via http-requests
 * containing the appropriate data
 * Created by michelt on 29.04.2015.
 */

'use strict';
(function() {
    var module = angular.module('CCYPApp')
        .service('backend', ['$http', function ($http) {

            var projectUrl = "http://localhost:3000/projects/";

            this.getProjects = function() {
                return $http.get(projectUrl);
            };

            this.getProject = function(id) {
                return $http.get(projectUrl + id);
            };

            this.saveProject = function(project) {
                return $http.post(projectUrl, project);
            };

            this.updateProject = function(project, id) {
                return $http.put(projectUrl + id, project);
            };

            this.deleteProject = function(project) {
                return $http.delete(projectUrl + project._id);
            };
        }]);
})();


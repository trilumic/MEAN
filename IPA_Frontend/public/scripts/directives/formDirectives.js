/**
 * Defines directives and their type, here:
 * as element for html-tags
 * Created by michelt on 29.04.2015.
 */

(function() {

    //Fetch angular module
    var module = angular.module('CCYPApp');

    //Project-form directive
    module.directive('projectFormModal', function() {
        return {
            restrict: "E",
            templateUrl: "templates/project-form-modal.html"
        }
    });
    //Project-form (edit) directive
    module.directive('editProjectFormModal', function() {
        return {
            restrict: "E",
            templateUrl: "templates/editProject-form-modal.html"
        }
    });
})();

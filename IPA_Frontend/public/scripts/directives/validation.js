/*
NG-Newsletter suggested approach to validate after input
 */
(function() {

    /*

     Used as attribute on form fields.
     Changes class from 'validate-after' to 'validate' if field is valid, signalising
     invalid form elements AFTER the user switches focus (instead of errors while typing)

     http://www.ng-newsletter.com/posts/validations.html
     */

    var app = angular.module('CCYPApp')
        .directive('validateAfter', [function() {
            var validate_class = "validate";
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {
                    ctrl.validate = false;

                    element.bind('focus', function(evt) {
                        if(ctrl.validate && ctrl.$invalid) // if we focus and the field was invalid, keep the validation
                        {
                            element.addClass(validate_class);
                            scope.$apply(function() {ctrl.validate = true;});
                        }
                        else
                        {
                            element.removeClass(validate_class);
                            scope.$apply(function() {ctrl.validate = false;});
                        }

                    }).bind('blur', function(evt) {
                        element.addClass(validate_class);
                        scope.$apply(function() {ctrl.validate = true;});
                    });
                }
            }
        }]);
})();
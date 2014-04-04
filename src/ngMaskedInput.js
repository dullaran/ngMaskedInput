var ngMaskedInput = angular.module("ngMaskedInput", ["ngMaskedInputServices"]);

ngMaskedInput.directive("mask", ["MaskedInput", function (MaskedInput) {
    "use strict";
    return {
        require: "?ngModel",
        scope: false,
        link: function (scope, elem, attrs, ctrl) {

            if (!ctrl) {
                return;
            }

            elem.bind("blur", function(){
                if (ctrl.$viewValue) {
                    if (ctrl.$viewValue.indexOf("_") === -1) {
                        scope.$apply(function() {
                            scope[attrs.ngModel] = elem.val();
                        });
                    } else {
                        scope.$apply(function() {
                            elem.val("");
                        });
                    }
                }
            });

            elem.on("keydown", function(e){
                if (e.which === 8) {
                    MaskedInput.userOperation = 8;
                } else if (e.which === 46) {
                    MaskedInput.userOperation = 46;
                }
            });

            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue) {
                    viewValue = MaskedInput.getNewViewValue(
                        viewValue, elem, attrs, ctrl);
                }
                return viewValue;
            });
        }
    };
}]);
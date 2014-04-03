var ngMaskedInput = angular.module("ngMaskedInput", ["ngMaskedInputServices"]);

ngMaskedInput.directive(
        "mask", ["MaskedInput", function (MaskedInput) {

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
                    if (ctrl.$viewValue.indexOf("_") !== -1) {
                        elem.val("");
                        scope.$apply(function() {
                            scope[attrs.ngModel] = "";
                        });
                    }
                }
            });

            elem.on("keydown", function(e){
                if (e.which === 8) {
                    MaskedInput.operation = 8;
                } else if (e.which === 46) {
                    MaskedInput.operation = 46;
                }
            });

            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue){
                    return MaskedInput.getNewViewValue(
                        viewValue, elem, attrs, ctrl
                    );
                }
                return viewValue;
            });
        }
    };
}]);
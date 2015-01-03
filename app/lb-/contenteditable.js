/* global $ */
/* global document */
/* global window */
/* global console */
"use strict";
(function(){
    var app = angular.module('myApp');
    app.directive("contenteditable", function() {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModel) {
                if(ngModel) {
                    var read = function(){
                        ngModel.$setViewValue(element.html());
                    };
                    ngModel.$render = function () {
                        element.html(ngModel.$viewValue || "");
                    };
                    element.bind("blur keyup change", function () {
                        scope.$apply(read);
                    });
                }
            }
        };
    });
})();
/* global $ */
/* global document */
/* global window */
/* global console */
"use strict";
(function(){
    var app = angular.module('myApp');
    app.directive('line', [function() {
        return {
            restrict:"E",
            require:"^lbCanvas",
            scope: {lb:"="},
            link: function (scope, element, attrs, ctrl) {
                scope.lb.lineLength = function(){
                    var x1=scope.lb.b1.x + scope.lb.b1.w()/2;
                    var y1=scope.lb.b1.y + scope.lb.b1.h()/2;
                    var x2=scope.lb.b2.x + scope.lb.b2.w()/2;
                    var y2=scope.lb.b2.y + scope.lb.b2.h()/2;
                    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
                };
                scope.lb.left = function(){
                    return scope.lb.b1.x + scope.lb.b1.w()/2;
                };
                scope.lb.top = function(){
                    return scope.lb.b1.y + scope.lb.b1.h()/2;
                };
                scope.lb.angle = function(){
                    var x1=scope.lb.b1.x + scope.lb.b1.w()/2;
                    var y1=scope.lb.b1.y + scope.lb.b1.h()/2;
                    var x2=scope.lb.b2.x + scope.lb.b2.w()/2;
                    var y2=scope.lb.b2.y + scope.lb.b2.h()/2;
                    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                };
            },
            replace:true,
            templateUrl:"lb-/line.html"
        };
    }]);
})();
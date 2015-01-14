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

                scope.lb.left = function(){
                    return getCenterPoints().x1;
                };
                scope.lb.top = function(){
                    return getCenterPoints().y1;
                };
                scope.lb.lineLength = function() {
                    var points = getCenterPoints();
                    return Math.sqrt( Math.pow(points.x1 - points.x2, 2) + Math.pow(points.y1 - points.y2, 2));
                };
                scope.lb.angle = function() {
                    var points = getCenterPoints();
                    return Math.atan2(points.y2 - points.y1, points.x2 - points.x1) * 180 / Math.PI;
                };

                function getCenterPoints() {
                    var x1 = scope.lb.b1.x + scope.lb.b1.w() / 2;
                    var y1 = scope.lb.b1.y + scope.lb.b1.h() / 2;
                    var x2 = scope.lb.b2.x + scope.lb.b2.w() / 2;
                    var y2 = scope.lb.b2.y + scope.lb.b2.h() / 2;
                    return {x1: x1, y1: y1, x2: x2, y2: y2};
                }
            },
            replace:true,
            templateUrl:"lb-/line.html"
        };
    }]);
})();
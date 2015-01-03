/* global $ */
/* global document */
/* global window */
/* global console */
"use strict";
(function(){
    var app = angular.module('myApp');
    app.directive('lbCanvas', function() {
        return {
            restrict: 'E',
            controller: function($scope,$element) {
                console.log($scope.lb);
                this.addLine = function(box1, box2){
                    $scope.lb.lines.push({b1:box1,b2:box2});
                    $scope.$apply();
                };
                var createBox = this.createBox = function(e){
                    console.log("hello");
                    $scope.lb.boxes.push({
                        text:"new box",
                        x: e.offsetX,
                        y: e.offsetY
                    });
                    $scope.$apply();
                };
                var unselectAll = function(){
                    $scope.lb.boxes.forEach(function(box){
                        box.editing = false;
                    });
                };
                $($element).on('dblclick',function(e){
                    e.preventDefault();
                    createBox(e);
                });
                $($element).on('click',function(e){
                    e.preventDefault();
                    unselectAll();
                    $scope.$apply();
                });
            },
            scope: {lb:"="},
            controllerAs: "ctrl",
            templateUrl: 'lb-/lb-canvas.html'
        };
    });
})();

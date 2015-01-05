/* global $ */
/* global document */
/* global window */
/* global console */
"use strict";
(function () {
    var app = angular.module('myApp');
    app.directive('lbCanvas', function () {
        return {
            restrict: 'E',
            controller: function ($scope, $element) {
                var vm = this;
                console.log($scope.lb);
                vm.remove = function (box) {
                    $scope.lb.boxes.splice($scope.lb.boxes.indexOf(box),1);
                    $scope.$apply();
                };
                vm.addLine = function (box1, box2) {
                    $scope.lb.lines.push({b1: box1, b2: box2});
                    $scope.$apply();
                };
                vm.createBox = function (e) {
                    console.log("hello");
                    $scope.lb.boxes.push({
                        text: "new box",
                        x: e.offsetX,
                        y: e.offsetY,
                        selected: true
                    });
                    $scope.$apply();
                };
                vm.deselectAll = function () {
                    console.log("deselecting");
                    $scope.lb.boxes.forEach(function (box) {
                        box.editing = false;
                        box.selected = false;
                    });
                };
                $($element).on('dblclick', function (e) {
                    e.preventDefault();
                    vm.createBox(e);
                });
                $($element).on('click', function (e) {
                    e.preventDefault();
                    vm.deselectAll();
                    $scope.$apply();
                });

            },
            scope: {lb: "="},
            controllerAs: "ctrl",
            templateUrl: 'lb-/lb-canvas.html'
        };
    });
})();

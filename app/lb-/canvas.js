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
            controller: function ($scope, $element,History) {
                var vm = this;
                vm.scope = $scope;
                $scope.lb.selection = [];
                vm.remove = function (box) {
                    $scope.lb.boxes.splice($scope.lb.boxes.indexOf(box), 1);
                    //$scope.$apply();
                };
                vm.addLine = function (box1, box2) {
                    $scope.lb.lines.push({b1: box1, b2: box2});
                    $scope.$apply();
                };
                vm.createBox = function (box) {

                    var cmd = {
                        execute: function () {
                            console.log("creates new box");
                            $scope.lb.boxes.push(box);
                            vm.select(box);
                        },
                        undo: function () {
                            console.log("undoes");
                            vm.remove(box);
                        }
                    };
                    History.doCmd(cmd);
                };
                vm.select = function (item) {
                    $scope.lb.selection.push(item);
                };
                vm.deselectAll = function () {
                    $scope.lb.boxes.forEach(function (box) {
                        box.editing = false;
                    });
                    $scope.lb.selection = [];
                };
                vm.isSelected = function (item) {
                    return $scope.lb.selection.indexOf(item) !== -1;
                };
                $($element).on('dblclick', function (e) {
                    e.preventDefault();
                    var box = {
                        text: "new box",
                        x: e.offsetX,
                        y: e.offsetY
                    };
                    vm.createBox(box);
                    $scope.$apply();
                });
                $($element).on('click', function (e) {
                    e.preventDefault();
                    vm.deselectAll();
                    $scope.$apply();
                });
                $(document).on("keyup",function (e) {
                    //console.log("keyup", scope.lb, e);
                    if(e.which===46){
                        var sel = $scope.lb.selection;
                        var cmd = {
                            execute: function () {
                                console.log("deletes selected things");
                                sel.forEach(function (thing) {
                                    vm.remove(thing);
                                });
                                $scope.lb.selection = [];
                            },
                            undo: function () {
                                console.log("undoes",sel);
                                sel.forEach(function (thing) {
                                    vm.createBox(thing);
                                });
                            }
                        };
                        History.doCmd(cmd);
                    }
                    $scope.$apply();
                });

            },
            scope: {lb: "="},
            controllerAs: "ctrl",
            templateUrl: 'lb-/lb-canvas.html'
        };
    });
})();

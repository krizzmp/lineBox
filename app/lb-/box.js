/* global $ */
/* global document */
/* global window */
/* global console */
"use strict";
(function () {
    var app = angular.module('myApp');
    app.directive('box', ['$timeout', 'History', function (timer, history) {
        return {
            restrict: "E",
            require: "^lbCanvas",
            link: function (scope, element, attrs, ctrl) {
                var box = scope.lb;
                box.w = function () {
                    return element.outerWidth();
                };
                box.h = function () {
                    return element.outerHeight();
                };
                box.selected = function () {
                    return ctrl.isSelected(box);
                };
                box.editing = true;

                initialize();

                function initialize() {
                    timer(function () {
                        selectElementContents(element.find("p")[0]);
                    }, 0);
                    initEvents();
                }

                function initEvents() {
                    element.on('dragstart', function (e) {
                        e.preventDefault();
                        element.addClass("dropping");
                        var oldX = e.originalEvent.screenX;
                        var oldY = e.originalEvent.screenY;
                        var old_position = element.position();
                        var transX, transY;
                        $(document).on("mousemove", function (e) {
                            var newX = e.screenX;
                            transX = newX - oldX;
                            var newY = e.screenY;
                            transY = newY - oldY;
                            box.x = old_position.left + transX;
                            box.y = old_position.top + transY;
                            scope.$apply();
                        });
                        $(document).on("mouseup", function (e) {
                            element.addClass("dropping");
                            var overlaps = element.overlaps(".box:not(.dropping)");
                            if (overlaps.length) {
                                box.x = old_position.left;
                                box.y = old_position.top;
                                scope.$apply();
                                overlaps.trigger("drop1", box);
                            } else {
                                history.move(box, old_position.left, old_position.top,
                                    old_position.left + transX, old_position.top + transY);
                                scope.$apply();
                            }
                            $(document).off("mouseup");
                            $(document).off("mousemove");
                            element.removeClass("dropping");
                        });
                    });
                    element.on("drop1", function (e, element1) {
                        ctrl.addLine(element1, box);
                    });
                    element.on("dblclick", function (e) {
                        e.stopPropagation();
                        box.editing = true;
                        scope.$apply();
                        selectElementContents(element.find("p")[0]);
                    });
                    element.on("click", function (e) {
                        e.stopPropagation();
                        if (!box.editing) {
                            if (!e.shiftKey)
                                ctrl.deselectAll();
                            select();
                            scope.$apply();
                        }
                        console.log(ctrl);
                    });
                }

                function select() {
                    console.log(ctrl);
                    ctrl.select(box);
                }

                function selectElementContents(el) {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            },
            scope: {lb: "="},
            replace: true,
            templateUrl: "lb-/box.html"
        };
    }]);
})();
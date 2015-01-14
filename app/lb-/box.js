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
                    element.on('dragstart', onDragStart);
                    element.on("drop1", onDrop);
                    element.on("dblclick", onDblClick);
                    element.on("click", onClick);
                }

                function onDragStart(e) {
                    e.preventDefault();
                    //element.addClass("dropping");
                    var oldX = e.originalEvent.screenX;
                    var oldY = e.originalEvent.screenY;
                    var oldPosition = element.position();
                    var transX, transY;
                    $(document).on("mousemove", onDragMove);
                    $(document).on("mouseup", onDragEnd);

                    function onDragMove(e) {
                        var newX = e.screenX;
                        transX = newX - oldX;
                        var newY = e.screenY;
                        transY = newY - oldY;
                        box.x = oldPosition.left + transX;
                        box.y = oldPosition.top + transY;
                        scope.$apply();
                    }

                    function onDragEnd(e) {
                        element.addClass("dropping");
                        var overlaps = element.overlaps(".box:not(.dropping)");
                        if (overlaps.length) {
                            console.log("hi");
                            createLink();
                        } else {
                            moveBox();
                        }
                        $(document).off("mouseup");
                        $(document).off("mousemove");
                        element.removeClass("dropping");

                        function createLink() {
                            box.x = oldPosition.left;
                            box.y = oldPosition.top;
                            scope.$apply();
                            overlaps.trigger("drop1", box);
                        }

                        function moveBox() {
                            history.move(box, oldPosition.left, oldPosition.top,
                                oldPosition.left + transX, oldPosition.top + transY);
                            scope.$apply();
                        }
                    }
                }

                function onDrop(e, element1) {
                    ctrl.addLine(element1, box);
                }

                function onDblClick(e) {
                    e.stopPropagation();
                    box.editing = true;
                    scope.$apply();
                    selectElementContents(element.find("p")[0]);
                }

                function onClick(e) {
                    e.stopPropagation();
                    if (!box.editing) {
                        if (!e.shiftKey) {
                            ctrl.deselectAll();
                        }
                        select();
                        scope.$apply();
                    }
                }

                function select() {
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
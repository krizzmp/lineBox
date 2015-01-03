"use strict";
(function(){
    var app = angular.module('myApp');
    app.directive('box', ['$timeout', function(timer) {
        return {
            restrict:"E",
            require:"^lbCanvas",
            link: function (scope, element, attrs, ctrl) {
                scope.lb.w = function(){
                    return element.outerWidth();
                };
                scope.lb.h = function(){
                    return element.outerHeight();
                };
                scope.lb.editing =  true;
                timer(function(){
                    scope.lb.x =  scope.lb.x - scope.lb.w()/2;
                    scope.lb.y =  scope.lb.y - scope.lb.h()/2;
                    selectElementContents(element.find("p")[0]);
                },0);
                function selectElementContents(el) {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                element.on('dragstart', function(e) {
                    e.preventDefault();
                    element.addClass("dropping");
                    var oldX = e.originalEvent.screenX;
                    var oldY = e.originalEvent.screenY;
                    var old_position = element.position();
                    var transX, transY;
                    $(document).on("mousemove",function(e){
                        var newX = e.screenX;
                        transX = newX - oldX;
                        var newY = e.screenY;
                        transY = newY - oldY;
                        scope.lb.x = old_position.left+transX;
                        scope.lb.y = old_position.top+transY;
                        scope.$apply();
                    });
                    $(document).on("mouseup",function(e){
                        element.addClass("dropping");
                        var overlaps = element.overlaps(".box:not(.dropping)");
                        if(overlaps.length){
                            scope.lb.x = old_position.left;
                            scope.lb.y = old_position.top;
                            scope.$apply();
                            overlaps.trigger("drop1",scope.lb);
                        }
                        $(document).off("mouseup");
                        $(document).off("mousemove");
                        element.removeClass("dropping");
                    });
                });
                element.on("drop1",function(e,element1){
                    ctrl.addLine(element1,scope.lb);
                });
                element.on("dblclick",function(e){
                    e.stopPropagation();
                    scope.lb.editing = true;
                    scope.$apply();
                    selectElementContents(element.find("p")[0]);
                });
                element.on("click",function(e){
                    e.stopPropagation();
                });
            },
            scope: {lb:"="},
            replace:true,
            templateUrl:"lb-/box.html"
        };
    }]);
})();
(function(){
    var app = angular.module('myApp');
    app.directive("contenteditable", function() {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModel) {
                if(ngModel) {
                    function read() {
                        ngModel.$setViewValue(element.html());
                    }

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
    app.directive('box', ['$timeout', function(timer) {

        function link(scope, element, attrs, ctrl) {
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
                ctrl.addLine(element1,scope.lb)
            });
            element.on("dblclick",function(e){
                e.stopPropagation();
                scope.lb.editing = true;
                scope.$apply();
                selectElementContents(element.find("p")[0]);
            });
            element.on("click",function(e){
                e.stopPropagation();
            })
        }

        return {
            restrict:"E",
            require:"^lbCanvas",
            link: link,
            scope: {lb:"="},
            replace:true,
            templateUrl:"lb-/box.html"
        };
    }]);
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
    app.directive('line', [function() {

        function link(scope, element, attrs, ctrl) {

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
        }

        return {
            restrict:"E",
            require:"^lbCanvas",
            scope: {lb:"="},
            link: link,
            replace:true,
            templateUrl:"lb-/line.html"
        };
    }]);
})();
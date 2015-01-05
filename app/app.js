/* global $ */
/* global document */
/* global window */
/* global console */
"use strict";
(function () {
    var app = angular.module('myApp', []);
    app.controller('tabController', ['$scope', function ($scope) {
        var tabs = this.tabs = [{
            name: "tab1",
            selected: true,
            editing: false,
            content: {boxes: [], lines: []}
        }, {
            name: "tab2",
            selected: false,
            editing: false,
            content: {boxes: [], lines: []}
        }];
        var selectTab = this.selectTab = function (tab) {
            tabs.forEach(function (tab) {
                tab.selected = false;
            });
            tab.selected = true;
        };
        this.closeTab = function (tab) {
            var i = tabs.indexOf(tab);
            if (i != -1) {
                tabs.splice(i, 1);
            }
        };
        this.addTab = function () {
            var newTab = {name: "new tab", selected: false, editing: false, content: {boxes: [], lines: []}};
            tabs.push(newTab);
            selectTab(newTab);
        };
        this.editTab = function (tab, event) {
            tab.editing = true;
            var el = event.target;
            $(el).focus();
            $(document).one('click', function (e) {
                tab.editing = false;
                window.getSelection().removeAllRanges();
                $scope.$apply();
            });
            var selectElementContents = function (el) {
                var range = document.createRange();
                range.selectNodeContents(el);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            };
            selectElementContents(el);
        };
    }]);
})();

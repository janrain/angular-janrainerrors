'use strict';
var app = angular.module('janrainErrors', []);

app.factory('janrainErrorsSvc', function($route, $location) {

  var errorArray = [];

  function ErrorObj(error) {

    /* initialize */
    if (typeof error === 'string') {

      this.type = 'default';
      this.title = 'Error';
      this.body = error;
      this.log = 'Default error: ' + error;

    } else {

      this.type = error.type;
      this.title = error.title;
      this.body = error.body;
      this.actions = error.actions;

    }

    this.dismiss = function() {
      errorArray.splice(errorArray.indexOf(this), 1);
    };

    /* log to server */

    var msg = error.log || this.body || 'Default error msg';
    log(msg);

  };

  function alert(error) {

    return errorArray.push(new ErrorObj(error));

  };

  function httpError(res, status) {
    /* normalize http error response */

    var error = {}
      , data = ""
      , httpStatus = "";

    // .success().error()
    if (typeof res === 'string') {
      data = res;
      httpStatus = status;

    // then() error
    } else {
      data = res.data;
      httpStatus = res.status;
    }

    error.type = 'HTTP ' + httpStatus;
    error.title = 'HTTP ' + httpStatus + ' Error';
    error.body = 'There was an error handling your request.';
    error.log = 'HTTP ' + httpStatus + ' error: ' + data + ' at location: ' + $location.path();


    alert(error);
  };

  function log(msg) {
      // TODO: send to error API endpoint
      console.log(msg);
  };

  function errors() {
    return errorArray;
  };

  return {
    alert: alert
  , errors: errors
  , log: log
  , httpError: httpError
  };

});

app.directive('janrainErrorsAlert', function() {
  return {
    controller: function($scope, janrainErrorsSvc) {
      $scope.show = function () {
        return janrainErrorsSvc.errors().length > 0;
      };
      $scope.errors = janrainErrorsSvc.errors();
    },
    scope: {},
    template: "<ul ng-show='show()'>"
            +   "<li ng-repeat='error in errors'>"
            +     "<h3>{{error.title}}</h3>"
            +     "<a class='close' href='' ng-click='error.dismiss()'><span class='janrain-icon-ex janrain-icon-16'></span></a>"
            +     "<span>{{error.body}}</span>"
            +     "<div ng-repeat='actionObj in error.actions'>"
            +       "<button ng-click='actionObj.action()'>{{actionObj.label}}</button>"
            +     "</div>"
            +   "</div>"
            + "</ul>"
  };
});


# Angular Module for Janrain Error-handling

### Usage

#### 1. Install the module:

    bower install --save janrain/angular-janrainerrors

#### 2. Add to scripts in html:

    <script src="bower_components/angular-janrainerrors/janrainerrors.js"></script>

#### 3. Add to angular dependencies:

E.g. in `app.js`:

    angular.module('Jiui', ['Jiui-dlman.controllers', 'Jiui-dlman.services', ... 'janrainErrors'])

#### 4. Add `janrain-errors-alert` directive to html:

E.g. in `index.html`

    <div id="errors" ng-cloak janrain-errors-alert></div>

#### 5. Inject `janrainErrorsSvc` into your controller or service:

    var app = angular.module('exampleApp');

    app.service('exampleService', function($http, ... janrainErrorsSvc){ ... }

#### 6. Report errors:

You can report `$http` errors from the `.success()` or `.then()` by simply passing in `janrainErrorsSvc.httpError`:

    $http.get(url)
    .success(function(data) { ... })
    .error(janrainErrorsSvc.httpError);

    $http.get(url)
    .then(function(data) {...}, janrainErrorsSvc.httpError);

You can also customize the report by passing explicit arguments to `janrainErrorsSvc.alert`:

    $http.get(url).then(function(data) { ... }, function(data, status) {
      janrainErrorsSvc.alert(errorObject);
    });

Where `errorObject` looks like:

    {
      type: 'HTTP 404',
      title: 'Not Found',
      body: 'Could not locate that resource!',
      log: 'This optional field will get logged to an api endpoint'
      actions: [
        {
          label: 'Retry',
          action: retryFunction
        }
      ]
    }

The `log` and `actions` fields are optional. The `actions` field is an array of 'action objects' that have a `label` and an `actin` function. Action objects will propagate to buttons on the `janrain-errors-alert` directive.

You can also substitute `errorObject` with an `errorString` which will be converted into an `errorObject` that looks like this:

    {
      type = 'default',
      title = 'Error',
      body = errorString,
      log = 'Default error: ' + errorString,
    }

If you don't want to pop up an alert modal, you can just log the error with `janrainErrorsSvc.log(msg)`.

#### 7. Get errors:

To get a list of open errors: `janrainErrorsSvc.errors()`.


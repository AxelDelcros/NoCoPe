angular.module('httpExample', [])
.controller('FetchController', ['$scope', '$http', '$templateCache',
  function($scope, $http, $templateCache) {
    $scope.method = 'GET';
    $scope.url = 'kaliazur.fr:5555/recipes';

    $scope.fetch = function() {
      $scope.code = null;
      $scope.response = null;
      console.log("TEST");
      $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
      success(function(data, status) {
        $scope.status = status;
        $scope.data = data;
      }).
      error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
      });
      console.log(data)
    };
  }]);


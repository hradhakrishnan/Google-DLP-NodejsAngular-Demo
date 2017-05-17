var app = angular.module('dlp', []);


app.controller('tdata', ['$scope', '$http', '$window', function ($scope, $http, $window) {

  var vm = this;
  vm.messages = $scope.vm.messages || [];


$scope.submit = function () {
 $scope.vm.messages.push({"text":  + $scope.user.text});

 var params = {
     "text": $scope.user.text
 };

 var req = {
     method: 'POST',
     url: '/inspect',
     headers: {
         'Content-Type': 'application/json'
     },
     data: params
 }

 $http(req).then(function successCallback(response) {
   var answer  = [];
   answer = response.data;
   $scope.user.reply = answer;

 }, function errorCallback(response) {
     console.log("error call back");
     console.log(response);
     $scope.status = "Error";
 });


}


}]);

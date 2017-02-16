var myApp = angular.module('myApp', ['ngCookies']);
myApp.controller('AppCtrl', ['$scope', '$http', '$window','$cookies','$cookieStore',function($scope, $http,$window,$cookies,$cookieStore) {

$scope.createUserFn = function(){
  console.log($scope.newUser);
  $http.post('api/createuser/',$scope.newUser).success(function(response){
    $scope.userCreated = response;
  });
  location.reload();
};


$scope.loginFn = function(){
  $http.post('/api/login/', $scope.login).success(function(response){
    console.log(response);
    if(response.status == 400){
      $window.alert('Invalid Username or Password');
    }
    $cookieStore.put("email", $scope.login.email); 
    var url = "http://" + $window.location.host + "/home.html";
    $window.location.href = url;
  }).error(function(response){
      console.log(response);
      $scope.unauthorized = response; 
    if(response.errorCode == 403){
      $window.alert('Invalid Username or Password');
    }
  });
};

 $scope.logoutFn = function(){
  $cookieStore.remove('email');
  var url = "http://" + $window.location.host + "/index.html";
  $window.location.href = url;

}

$scope.getUserInformation = function(){
  var email =  $cookieStore.get("email");
  $http.get('/api/users/'+ email).success(function(response){
    console.log(response);
    $scope.information = response;
    $scope.getBillInformation(response.Users[0].id);
  });
};

$scope.getBillInformation = function(id){
  $http.get('api/users/bill/'+id).success(function(response){
    //console.log(response);
    $scope.billInformation = response;
  });
};

$scope.getBillTypeInformation = function(){
  $http.get('/api/getBillTypeList').success(function(response){
    $scope.billType = response;
  });
};

$scope.insertBillInformation = function(id){
  console.log($scope.bill)
  $http.post('api/users/bill/'+id,$scope.bill).success(function(response){
    $scope.result = response;
    location.reload();
  });
};

$scope.edit = function(id){
  $http.get('/contactlist/' + id).success(function(response){
    $scope.contact = response;
  });
};  

$scope.update = function(){
  $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response){
  });
};

$scope.remove = function(id){
  $http.delete('/contactlist/'+id).success(function(response){
  });
};

$scope.deselect = function(){
  $scope.contact = "";
}


}]);﻿
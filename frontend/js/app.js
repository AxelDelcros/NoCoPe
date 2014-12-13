// script.js

    // create the module and name it NoCoPe
    var NoCoPe = angular.module('NoCoPe', ['ngRoute']);

    // configure our routes
    NoCoPe.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'recipes.html',
                controller  : 'recipeController'
            })

            // route for the about page
            .when('/recipes', {
                templateUrl : 'recipes.html',
                controller  : 'recipeController'
            })

            // route for the contact page
            .when('/ingredients', {
                templateUrl : 'ingredients.html',
                controller  : 'ingredientsController'
            })

            .when('/products', {
                templateUrl : 'products.html',
                controller  : 'productController'
            })
            
            .when('/signin', {
                templateUrl : 'signin.html',
                controller  : 'signinController'
            });
        });

    // create the controller and inject Angular's $scope
    NoCoPe.controller('recipeController', function($scope) {
        // create a message to display in our view
        $scope.placeholder = 'Type recipe name here...';
    });

    NoCoPe.controller('ingredientsController', function($scope) {
        $scope.placeholder = 'Type ingredient name here...';
    });

    NoCoPe.controller('productController', function($scope) {
        $scope.placeholder = 'Type product name here...';
    });

    NoCoPe.controller('signinController', ['$scope','$http', function( $scope , $http ) {

        $scope.placeholderLogin = 'john.doe@mail.com';
        $scope.placeholderPassword = 'password';
        console.log("Enter the controller");

        $scope.submitForm = function(){
            console.log("Kiki submit");

            if (!$scope.formInfo.login)
                $scope.attentionMail = 'Mail is required !';

            if (!$scope.formInfo.password)
                $scope.attentionPassword = 'Password is required !';

            console.log("ca marche avant le get");

            $http.get('http://localhost:5555/recipes',{ login:$scope.formInfo.login, password:$scope.formInfo.password } )
            .success(function(data,status,headers,config){
                console.log('LE ZIZI');
		console.log(data);
            })

            .error(function(data,status,headers,config){
                console.log('Error');
            });
        };
    }]);

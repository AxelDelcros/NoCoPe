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
            
            .when('/signup', {
                templateUrl : 'signup.html',
                controller  : 'signupController'
            })
            .when('/login', {
                templateUrl : 'login.html',
                controller  : 'loginController'
            })
            .otherwise({redirectTo: '/'});
        });

    // create a factory to handle all request in recipes data
    NoCoPe.factory('RecipesFactory', function($http, $q){

        var factory = {
         recipes : false,
         ingredient : false,
         getRecipes : function(){
            var deferred = $q.defer();
            $http.get('http://localhost:5555/recipes')
            .success(function(data, status, headers, config){
                factory.recipes = data;
                deferred.resolve(factory.recipes);
            })
            .error(function(data, status, headers, config){
                deferred.reject("Can't get recipes list");
            })
            return deferred.promise;
        },
        getIngredient : function(id){
            var deferred = $q.defer();
            $http.get('http://localhost:5555/ingredients/id/' + id)
            .success(function(data, status, headers, config){
                factory.ingredient = data;
                deferred.resolve(factory.ingredient);
            })
            .error(function(data, status, headers, config){
                deferred.reject("Can't get ingredient data");
            })
            return deferred.promise;
        }
    }
    return factory;
})


    // create the controller and inject Angular's $scope
    NoCoPe.controller('recipeController', ['$scope','$http', 'RecipesFactory', function( $scope, $http, RecipesFactory) {
        // create a message to display in our view
        $scope.loading = true;
        $scope.placeholder = 'Type recipe name here...';
        $scope.recipes = RecipesFactory.getRecipes().then(function(recipes){
            $scope.recipes = recipes;
            angular.forEach($scope.recipes, function(recipe, key1){
                angular.forEach(recipe.ingredients, function(ingredient, key2) {
                    $scope.recipes[key1].ingredients[key2] = RecipesFactory.getIngredient(ingredient).then(function(ingredient){
                        $scope.recipes[key1].ingredients[key2] = ingredient.name;
                    }, function(msg){
                        alert(msg);
                    })  
                });
            });
            $scope.loading = false;
        }, function(msg){
            alert(msg);
        });
    }]);

    NoCoPe.controller('ingredientsController', ['$scope','$http', function( $scope, $http){
      $scope.loading = true;
      $scope.placeholder = 'Type recipe name here...';
      console.log("Coucou");
      $http.get('http://localhost:5555/ingredients')
      .success(function(data,status,headers,config){
        $scope.ingredients = data;
        $scope.loading = false;
    })
      .error(function(data,status,headers,config){
        console.log('Error');
    });
  }]);


    NoCoPe.controller('productController', function($scope) {
        $scope.placeholder = 'Type product name here...';
    });    

    NoCoPe.controller('loginController', ['$scope','$http', function( $scope , $http ) {

        $scope.placeholderLogin = 'john.doe@mail.com';
        $scope.placeholderPassword = 'password';
        console.log("Enter the controller");

        $scope.submitForm = function(){
            console.log("submit");

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

    NoCoPe.controller('signupController', ['$scope','$http', function( $scope , $http ) {
        $scope.info = {login: 'DarkJoe', firstname : "John", lastname : "Doe"};
        $scope.placeholderLogin = 'john.doe@mail.com';
        $scope.placeholderPassword = 'password';
        $scope.placeholderDate = 'jj/mm/aaaa';
        console.log("Enter the controller");

        $scope.submitForm = function(data, callback){
            if (data.password !== data.password2)
            {
                $scope.errorPassword = "You didn't enter the same password";
                $scope.placeholderPassword = 'password';
            }
            else
            {
                $http.post('http://localhost:5555/users', 
                    {login:data.login, email:data.email, password:data.password,
                        firstname:data.firstname, lastname:data.lastname,
                        birth:data.birthday})
                .success(function(data, status, headers, config){
                    callback = data;
                })
                .error(function(data, status, headers, config){
                    callback = data;
                });
            }
        }
    }]);

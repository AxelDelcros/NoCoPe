// script.js

    // create the module and name it NoCoPe
    var NoCoPe = angular.module('NoCoPe', ['ngRoute']);

    // configure our routes
    NoCoPe.config(['$routeProvider', '$locationProvider', '$httpProvider',
        function ($routeProvider, $locationProvider, $httpProvider) {
            $routeProvider
                // route for the home page
                .when('/', {
                    templateUrl : 'recipes.html',
                    controller  : 'recipeController',
                    access : { requiredLogin: false}
                })

                // route for the about page
                .when('/recipes', {
                    templateUrl : 'recipes.html',
                    controller  : 'recipeController',
                    access : { requiredLogin: false}
                })

                .when('/recipes/:name_url', {
                    templateUrl : 'showrecipe.html',
                    controller  : 'showRecipeController',
                    access : { requiredLogin: false}
                })

                // route for the contact page
                .when('/ingredients', {
                    templateUrl : 'ingredients.html',
                    controller  : 'ingredientsController',
                    access : { requiredLogin: false}
                })

                .when('/ingredients/:name_url', {
                    templateUrl : 'showingredient.html',
                    controller  : 'showIngredientController',
                    access : { requiredLogin: false}
                })

                .when('/products', {
                    templateUrl : 'products.html',
                    controller  : 'productController',
                    access : { requiredLogin: false}
                })
                
                .when('/signup', {
                    templateUrl : 'signup.html',
                    controller  : 'signupController',
                    access : { requiredLogin: false}
                })
                .when('/login', {
                    templateUrl : 'login.html',
                    controller  : 'loginController',
                    access : { requiredLogin: false}
                })
                .otherwise({redirectTo: '/'});

            // $httpProvider.interceptors.push('TokenInterceptor');
        }
    ]);

    // NoCoPe.run(function ($rootScope, $location, AuthenticationService) {
    //     $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
    //         if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged) {
    //          $location.path("/login");
    //         }
    //     });
    // });

//////////////////////////////////////////////
//////////////////FACTORIES//////////////////
////////////////////////////////////////////

    // NoCoPe.factory('TokenInterceptor', ['$q', 'AuthenticationService',
    //     function ($q, $window, AuthenticationService) {
    //         return {
    //             request : function (config) {
    //                 config.headers = config.headers || {};
    //                 if ($window.sessionStorage.token) {
    //                     config.headers.Authorization = 'NoCoPe' + $window.sessionStorage.token;
    //                 }
    //                 return config;
    //             },

    //             requestError : function (rejection) {
    //                 return $q.reject(rejection);
    //             },

    //             response : function (response) {
    //                 return response || $q.when(response);
    //             },

    //             responseError : function (rejection) {
    //                 if (rejection != null && rejection.status == 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
    //                     delete $window.sessionStorage.token;
    //                     AuthenticationService.isLogged = false;
    //                     $location.path("/login");
    //                 }
    //                 return $q.reject(rejection);
    //             }
    //         };
    //     }]
    // );

    // // // Create a factory to handle connect action
    NoCoPe.factory('AuthenticationService', function () {
        var auth = {
            isLogged : false
        }

        return auth;
    });

    // create a factory to handle all request in recipes data
    NoCoPe.factory('RecipesFactory', ['$http', '$q',
        function ($http, $q) {

            var factory = {
                recipes : false,
                ingredient : false,
                getRecipes : function () {
                    var deferred = $q.defer();
                    $http.get('http://localhost:5555/recipes')
                    .success(function (data, status, headers, config) {
                        factory.recipes = data;
                        deferred.resolve(factory.recipes);
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject("Can't get recipes list");
                    })
                    return deferred.promise;
                },
                getIngredient : function(id){
                    var deferred = $q.defer();
                    $http.get('http://localhost:5555/ingredients/id/' + id)
                    .success(function (data, status, headers, config) {
                        factory.ingredient = data;
                        deferred.resolve(factory.ingredient);
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject("Can't get ingredient data");
                    })
                    return deferred.promise;
                }
            }
            return factory;
        }
    ]);

//////////////////////////////////////////////
/////////////////CONTROLLERS/////////////////
////////////////////////////////////////////

    // create the controller and inject Angular's $scope
    NoCoPe.controller('recipeController', ['$scope','$http', 'RecipesFactory',
        function recipeController ($scope, $http, RecipesFactory) {
            // create a message to display in our view
            $scope.loading = true;
            $scope.placeholder = 'Type recipe name here...';
            $scope.recipes = RecipesFactory.getRecipes().then(function (recipes) {
                $scope.recipes = recipes;
                $scope.recipes.limit = 282;
                angular.forEach($scope.recipes, function (recipe, key1) {
                    angular.forEach(recipe.ingredients, function (ingredient, key2) {
                        $scope.recipes[key1].ingredients[key2] = RecipesFactory.getIngredient(ingredient).then(function (ingredient) {
                            ingredientid = ingredient.id;
                            $scope.recipes[key1].ingredients[key2] = {
                                id: ingredientid,
                                name: ingredient.name
                            };
                        }, function (msg) {
                            alert(msg);
                        })  
                    });
                });
                $scope.loading = false;
            },  function (msg) {
                    alert(msg);
                });
        }
    ]);

    NoCoPe.controller('showRecipeController', ['$scope', '$http', '$window', '$location',
        function showRecipeController ($scope, $http, $window, $location) {
            $scope.loading = true;
            recipeid = $location.path();
            $window.alert(recipeid.split('recipes/')[1].length);
            $http.get('http://localhost:5555/recipes/name_url/' + recipeid.split('recipes/')[1])
            .success(function (data, status, headers, config) {
                $scope.recipe = data;
                $scope.loading = false;
            })
            .error(function (data, status, headers, config) {
                 $scope.callBack = data;
            })
        }
    ]); 

    NoCoPe.controller('ingredientsController', ['$scope','$http', 
        function ingredientsController ($scope, $http) {
            $scope.loading = true;
            $scope.placeholder = 'Type ingredient name here...';
            console.log("Coucou");
            $http.get('http://localhost:5555/ingredients')
                .success(function (data,status,headers,config) {
                    $scope.ingredients = data;
                    $scope.loading = false;
                })
                .error(function (data,status,headers,config) {
                    console.log('Error');
                });
        } 
    ]);

      NoCoPe.controller('showIngredientController', ['$scope', '$http', '$window', '$location',
        function showIngredientController ($scope, $http, $window, $location) {
            $scope.loading = true;
            ingredientid = $location.path();
            $window.alert(ingredientid.split('ingredients/')[1]);
            $http.get('http://localhost:5555/ingredients/name_url/' + ingredientid.split('ingredients/')[1])
            .success(function (data, status, headers, config) {
                $scope.ingredient = data;
                $scope.loading = false;
            })
            .error(function (data, status, headers, config) {
                 $scope.callBack = data;
            })
        }
    ]); 


    NoCoPe.controller('productController', ['$scope',
        function productController ($scope) {
            $scope.placeholder = 'Type product name here...';
        }
    ]);    

    NoCoPe.controller('SignOutController', ['$scope', '$location', '$window', '$http', 'AuthenticationService',
        function SignOutController ($scope , $http ,$location, $window, AuthenticationService) {
            $scope.logOut = function($scope, $location, $window, $http, AuthenticationService) {
                    if (AuthenticationService.isLogged) {
                        $http.post('http://localhost:5555/logout')
                        .success(function (data, status, headers, config) {
                            AuthenticationService.isLogged = false;
                            delete $window.sessionStorage.token;
                            $location.path("/");
                            $scope.isLogged = "disconnect";
                        })
                        .error(function (data, status, headers, config) {
                            console.log("Error while trying disconnect the user");
                        });
                    }
            }
        }
    ]);

    NoCoPe.controller('loginController', ['$scope','$http', '$location', '$window', 'AuthenticationService',
        function loginController ($scope , $http ,$location, $window, AuthenticationService) {
            $scope.placeholderLogin = 'e-mail address / login';
            $scope.placeholderPassword = 'password';

            $scope.submitForm = function () {
                if (!$scope.logIn.id)
                    $scope.attentionMail = 'Id is required !';

                if (!$scope.logIn.password)
                    $scope.attentionPassword = 'Password is required !';

                $http.post('http://localhost:5555/login',{ login:$scope.logIn.id, password:$scope.logIn.password } )
                .success(function (data,status,headers,config) {
                    $scope.logIn.back = data;
                    $window.sessionStorage.token = data.access_token;
                    AuthenticationService.isLogged = true;
                    $scope.isLogged = "connect";
                    $window.alert(data.access_token);
                    $location.path('/');
                })
                .error(function (data,status,headers,config) {
                   $scope.logIn.back = data;
               });
            };
        }
    ]);

    NoCoPe.controller('signupController', ['$scope','$http', '$window',
        function signupController ($scope , $http, $window) {
            $scope.info = {login: 'Login', firstname : "First name", lastname : "Last name"};
            $scope.placeholderLogin = 'Email';
            $scope.placeholderPassword = 'Password';
            $scope.placeholderDate = 'YYYY-MM-DD';
            console.log("Enter the controller");

            $scope.submitForm = function (sign) {
                if (sign.password !== sign.password2)
                {
                    $scope.errorPassword = "You didn't enter the same password";
                    $scope.placeholderPassword = 'Password';
                }
                else
                {
                    console.log(sign.avatar);
                    $http.post('http://localhost:5555/users', 
                        {login:sign.login, email:sign.email, password:sign.password,
                            firstname:sign.firstName, lastname:sign.lastName,
                            birth:sign.birthday, sexe:sign.gender, image:sign.avatar})
                    .success(function (data, status, headers, config) {
                        sign.back = data;
                    })
                    .error(function (data, status, headers, config) {
                        sign.back = data;
                    });
                }
            }
        }
    ]);
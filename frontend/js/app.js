// script.js

    // create the module and name it NoCoPe
    var NoCoPe = angular.module('NoCoPe', ['ngRoute']);

    // configure our routes
    NoCoPe.config(['$routeProvider', '$locationProvider', '$httpProvider',
        function ($routeProvider, $locationProvider, $httpProvider) {
            $routeProvider
                // route for the home page
                .when('/', {
                    templateUrl : 'partials/home.html',
                    controller  : 'homeController',
                    access : { requiredLogin: false}
                })

                // route for the about page
                .when('/recipes', {
                    templateUrl : 'partials/recipes.html',
                    controller  : 'recipeController',
                    access : { requiredLogin: false}
                })

                .when('/recipes/create', {
                    templateUrl : 'partials/addrecipe.html',
                    controller  : 'addRecipeController',
                    access : { requiredLogin: true}
                })

                .when('/recipes/:name_url', {
                    templateUrl : 'partials/showrecipe.html',
                    controller  : 'showRecipeController',
                    access : { requiredLogin: false}
                })

                .when('/ingredients', {
                    templateUrl : 'partials/ingredients.html',
                    controller  : 'ingredientsController',
                    access : { requiredLogin: false}
                })

                .when('/ingredients/:name_url', {
                    templateUrl : 'partials/showingredient.html',
                    controller  : 'showIngredientController',
                    access : { requiredLogin: false}
                })

                .when('/tools/:name_url', {
                    templateUrl : 'partials/showtool.html',
                    controller  : 'showToolController',
                    access : { requiredLogin: false}
                })

                .when('/products', {
                    templateUrl : 'partials/products.html',
                    controller  : 'productController',
                    access : { requiredLogin: false}
                })
                
                .when('/signup', {
                    templateUrl : 'partials/signup.html',
                    controller  : 'signupController',
                    access : { requiredLogin: false}
                })

                .when('/login', {
                    templateUrl : 'partials/login.html',
                    controller  : 'loginController',
                    access : { requiredLogin: false}
                })

                .when('/settings', {
                    templateUrl : 'partials/settings.html',
                    controller  : 'settingsController',
                    access : { requiredLogin: true}
                })

                .otherwise({redirectTo: '/'});


            $httpProvider.interceptors.push('TokenInterceptor');
        }
    ]);

    NoCoPe.run(function ($rootScope, $location, AuthenticationService, $window) {
        $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
            if (nextRoute.access){
                if (nextRoute.access.requiredLogin && !$window.sessionStorage.token) {
                 $location.path("/login");
                }
            };
        });
    });

//////////////////////////////////////////////
//////////////////FACTORIES//////////////////
////////////////////////////////////////////

    NoCoPe.factory('TokenInterceptor', ['$q', '$window', 'AuthenticationService',
        function ($q, $window, AuthenticationService) {
            return {
                request : function (config) {
                    config.headers = config.headers || {};
                    if ($window.sessionStorage.token) {
                        config.headers.Authorization = 'NoCoPe' + $window.sessionStorage.token;
                    }
                    return config;
                },

                requestError : function (rejection) {
                    return $q.reject(rejection);
                },

                response : function (response) {
                    return response || $q.when(response);
                },

                responseError : function (rejection) {
                    if (rejection != null && rejection.status == 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                        delete $window.sessionStorage.token;
                        AuthenticationService.isLogged = false;
                        $location.path("/login");
                    }
                    return $q.reject(rejection);
                }
            };
        }]
    );

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
                },
                getTool : function(id){
                    var deferred = $q.defer();
                    $http.get('http://localhost:5555/tools/id/' + id)
                    .success(function (data, status, headers, config) {
                        factory.tool = data;
                        deferred.resolve(factory.tool);
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject("Can't get tool data");
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
    NoCoPe.controller('recipeController', ['$scope','$http', 'RecipesFactory', '$window', 'AuthenticationService',
        function recipeController ($scope, $http, RecipesFactory, $window, AuthenticationService) {
            if ($window.sessionStorage.token)
                $scope.Logged = true;
            else
                $scope.Logged = false;
            // create a message to display in our view
            $scope.loading = true;
            $scope.placeholder = 'Type recipe name here...';
            console.log($window.sessionStorage.token);
            console.log("in recipeCOntroller " + $window.sessionStorage.token);

            $scope.recipes = RecipesFactory.getRecipes().then(function (recipes) {
                $scope.recipes = recipes;
                $scope.recipes.limit = 258;
                angular.forEach($scope.recipes, function (recipe, key1) {
                    angular.forEach(recipe.ingredients, function (ingredient, key2) {
                        $scope.recipes[key1].ingredients[key2] = RecipesFactory.getIngredient(ingredient).then(function (ingredient) {
                            $scope.recipes[key1].ingredients[key2] = {                                
                                name: ingredient.name,
                                name_url: ingredient.name_url
                            };
                        }, function (msg) {
                            alert(msg);
                        })  
                    });
                    angular.forEach(recipe.tools, function (tool, key2) {
                        $scope.recipes[key1].tools[key2] = RecipesFactory.getTool(tool).then(function (tool) {
                            $scope.recipes[key1].tools[key2] = {
                                name: tool.name,
                                name_url: tool.name_url
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

    NoCoPe.controller('showRecipeController', ['$scope', '$http', '$window', '$location', 'RecipesFactory',
        function showRecipeController ($scope, $http, $window, $location, RecipesFactory) {
            $scope.loading = true;
            recipeid = $location.path();
            console.log($window.sessionStorage.token);
            console.log("in the showrecopeCOntroller " + $window.sessionStorage.token);
            $http.get('http://localhost:5555/recipes/name_url/' + recipeid.split('recipes/')[1])
            .success(function (data, status, headers, config) {
                $scope.recipe = data;
                angular.forEach($scope.recipe.ingredients, function (ingredient, key2) {
                        $scope.recipe.ingredients[key2] = RecipesFactory.getIngredient(ingredient).then(function (ingredient) {
                            $scope.recipe.ingredients[key2] = {                                
                                name: ingredient.name,
                                name_url: ingredient.name_url
                            };
                        }, function (msg) {
                            alert(msg);
                        })  
                    });
                angular.forEach($scope.recipe.tools, function (tool, key2) {
                        $scope.recipe.tools[key2] = RecipesFactory.getTool(tool).then(function (tool) {
                            $scope.recipe.tools[key2] = {
                                name: tool.name,
                                name_url: tool.name_url
                            };
                        }, function (msg) {
                            alert(msg);
                        })  
                    });
                $scope.loading = false;
            })
            .error(function (data, status, headers, config) {
                 $scope.callBack = data;
            })
        }
    ]); 

    NoCoPe.controller('ingredientsController', ['$scope','$http', '$window',
        function ingredientsController ($scope, $http, $window) {
            $scope.loading = true;
            console.log($window.sessionStorage.token);
            console.log("in the ingredientsController " + $window.sessionStorage.token);

            $scope.placeholder = 'Type ingredient name here...';
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
            if ($window.sessionStorage.token)
                $scope.Logged = true;
            else
                $scope.Logged = false;
           $scope.loading = true;
            ingredientid = $location.path();
            console.log($window.sessionStorage.token);
            console.log("in the showIngredientController" + $window.sessionStorage.token);

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

    NoCoPe.controller('showToolController', ['$scope', '$http', '$window', '$location',
        function showIngredientController ($scope, $http, $window, $location) {
            $scope.loading = true;
            toolid = $location.path();
            console.log($window.sessionStorage.token);
            $http.get('http://localhost:5555/tools/name_url/' + toolid.split('tools/')[1])
            .success(function (data, status, headers, config) {
                $scope.tool = data;
                $scope.loading = false;
            })
            .error(function (data, status, headers, config) {
                 $scope.callBack = data;
            })
        }
    ]); 


    NoCoPe.controller('productController', ['$scope', '$window',
        function productController ($scope, $window) {
            console.log($window.sessionStorage.token);
            $scope.placeholder = 'Type product name here...';
        }
    ]);    

    NoCoPe.controller('loginController', ['$scope','$http', '$location', '$window', 'AuthenticationService', "$rootScope",
        function loginController ($scope , $http ,$location, $window, AuthenticationService, $rootScope) {
            $scope.placeholderLogin = 'e-mail address / login';
            $scope.placeholderPassword = 'password';
            console.log("in the loginController " + $window.sessionStorage.token);

            $scope.submitForm = function () {
                if (!$scope.logIn.id)
                    $scope.attentionMail = 'Id is required !';

                if (!$scope.logIn.password)
                    $scope.attentionPassword = 'Password is required !';

                $http.post('http://localhost:5555/login',{ login:$scope.logIn.id, password:$scope.logIn.password } )
                .success(function (data,status,headers,config) {
                    $window.sessionStorage.token = data.access_token;
                    $rootScope.user = JSON.stringify(data.user);
                    AuthenticationService.isLogged = true;
                    $location.path('/');
                })
                .error(function (data,status,headers,config) {
                    $scope.logIn.back = data.msg;
                    $scope.logIn.stat = "false";

               });
            };
        }
    ]);

    NoCoPe.controller('signupController', ['$scope','$http', '$window',
        function signupController ($scope , $http, $window) {
            $scope.info = {login: 'Login', firstname : "First name", lastname : "Last name"};
            $scope.placeholderMail = 'Email';
            $scope.placeholderPassword = 'Password';
            $scope.placeholderDate = 'YYYY-MM-DD';
            console.log($window.sessionStorage.token);
            console.log("in signupController " + $window.sessionStorage.token);

            $scope.submitForm = function (sign) {
                if (sign.password !== sign.password2)
                {
                    $scope.back = "You didn't enter the same password";
                    $scope.placeholderPassword = 'Password';
                }
                else
                {
                    $http.post('http://localhost:5555/users', 
                        {login:sign.login, email:sign.email, password:sign.password,
                            firstname:sign.firstName, lastname:sign.lastName,
                            birth:sign.birthday, sexe:sign.gender, image:sign.avatar})
                    .success(function (data, status, headers, config) {
                        $scope.back = "You have successfully create an account";
                        $scope.stat = "true";
                    })
                    .error(function (data, status, headers, config) {
                        $scope.back = data.msg;
                        $scope.stat = "false";
                    });
                }
            }
        }
    ]);

    NoCoPe.controller('userController', ['$scope', '$window', 'AuthenticationService', '$route', "$rootScope",
        function userController ($scope, $window, AuthenticationService, $route, $rootScope) {
            console.log(" authentification.islogged " + AuthenticationService.isLogged);
            $scope.logout = function () {
                delete $window.sessionStorage.token;
                console.log(" in logout function " + $window.sessionStorage.token);
                $scope.Logged = false;
                delete $rootScope.user;
                $route.reload();
            }
            if ($window.sessionStorage.token)
                $scope.Logged = true;
        }
    ]);

    NoCoPe.controller('settingsController', ['$scope', '$window', "$rootScope",
        function settingsController ($scope, $window, $rootScope) {
            console.log($window.sessionStorage.token);
            if ($window.sessionStorage.token)
                $scope.Logged = true;
            else
                $scope.Logged = false;
        }
    ]);

    NoCoPe.controller('homeController', ['$scope', '$window', "$rootScope",
        function homeController ($scope, $window, $rootScope) {
            console.log($window.sessionStorage.token);
            if ($window.sessionStorage.token)
                $scope.Logged = true;
            else
                $scope.Logged = false;
            // $scope.user = $window.sessionStorage.user;
        }
    ]);

    NoCoPe.controller('addRecipeController', ['$scope','$http', '$location', '$window', 'AuthenticationService', "$rootScope",
        function addRecipeController ($scope , $http ,$location, $window, AuthenticationService, $rootScope) {
            $scope.recipename = 'Name of the recipe';
            $scope.tag = 'Specify any tag, i.e. halal';
            $scope.description = 'Enter the description for your recipe';
            $scope.duration = 'Time needed to cook (in minutes)';
            $scope.steps = 'Here explain how you are cooking your recipe';
            $scope.ingredients = 'Please list here all the ingredients and their quantities';
            $scope.tools = 'Please list here all the ingredients and their quantities';
            $scope.products = 'Please list here all the products and their quantities';
            $scope.stepname = 'Name of the recipe';
            $scope.stepname = 'Name of the recipe';
            console.log("in the addRecipeController " + $window.sessionStorage.token);
            picture = [];
            var stepArray = [];

            $scope.submitForm = function () {
                stepArray.push( {'name' : $scope.addrecipe.step.name,
                                 'duration' : $scope.addrecipe.step.duration,
                                 'content' : $scope.addrecipe.step.content});
                $http.post('http://localhost:5555/recipes/',{ 
                    name:$scope.addrecipe.recipename, 
                    tags:$scope.addrecipe.tag,
                    description:$scope.addrecipe.description,
                    ingredients:$scope.addrecipe.ingredients,
                    tools:$scope.addrecipe.tools,
                    products:$scope.addrecipe.product,
                    steps:JSON.stringify(stepArray),
                    pictures:picture
                    })
                .success(function (data,status,headers,config) {
                        $scope.back = "You have successfully create a recipe";
                        $scope.stat = "true";
                        $scope.callBack = data;
                })
                .error(function (data,status,headers,config) {
                    $scope.back = data.msg;
                    $scope.stat = "false";
                    $scope.callBack = data;
                    $scope.error = stepArray;
               });
            };
        }
    ]);
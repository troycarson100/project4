var myApp = angular.module('myApp', ['ui.router'])
  .directive('navigationBar', navigationBar)
  .directive('suggestionMenu', suggestionMenu)

myApp.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      restricted: true
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginController as loginCtrl'
    })
    .state('logout', {
      url: '/logout',
      controller: 'logoutController'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerController as registerCtrl'
    })
    .state('search', {
      url: '/search',
      templateUrl: 'templates/search.html',
      controller: 'SearchController as sc'
    })
    .state('categories', {
      url: '/categories',
      templateUrl: 'templates/categories.html',
      controller: 'SearchController as sc'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'SingleItemController as sic',
      restricted: true
    })
    .state('itemShow', {
      url: '/item/:id',
      templateUrl: 'templates/itemShow.html',
      controller: 'SingleItemController as sic'
    })
})

  function navigationBar() {
    return {
      restrict: 'E',
      templateUrl: '/partials/nav.html'
    }
  }

  function suggestionMenu() {
    return {
      restrict: 'E',
      templateUrl: '/partials/suggestion.html',
      controller: 'SuggestionController as sug'
    }
  }


myApp.run(function ($rootScope, $location, $state, AuthService) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    AuthService.getUserStatus()
    .then(function(){
      // console.log(toState)
      if (toState.restricted && !AuthService.isLoggedIn()){
        // $location.path('/login')
        $state.go('login');
      }
    })
  })
})

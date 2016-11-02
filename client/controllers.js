angular.module('myApp')
  .controller('mainController', mainController)
  .controller('loginController', loginController)
  .controller('logoutController', logoutController)
  .controller('registerController', registerController)
  .controller('SearchController', SearchController)


  mainController.$inject = ['$rootScope', '$state', 'AuthService']
  loginController.$inject = ['$state', 'AuthService']
  logoutController.$inject = ['$state', 'AuthService']
  registerController.$inject = ['$state', 'AuthService']
  SearchController.$inject = ['$state', 'AuthService']



function mainController($rootScope, $state, AuthService) {
  var vm = this

  vm.toggleMenu = function(){
    vm.menuActive = !vm.menuActive
  }

  $rootScope.$on('$stateChangeStart', function (event) {
    // console.log("Changing states")
    AuthService.getUserStatus()
      .then(function(data){
        vm.currentUser = data.data.user
      })
  })
}

SearchController.$inject = ['$state', 'AuthService', '$http']

function SearchController($state, AuthService, $http){
  var vm = this

  // vm.normalizeResults = function(combined){
  //
  // }

  vm.termino = ""
  vm.textLimit = 100
  vm.selected = false

  AuthService.getUserStatus()
    .then(function(data){
      vm.currentUser = data.data.user
    })

  vm.toggleLike= function(){
      vm.likeActive = !vm.likeActive
    }

  vm.liked = function(obj){
    $http.post('/user/users/'+ vm.currentUser._id +'/likes', obj)
      .then(function(data){
        console.log(data)
        // vm.toggleLike = true
        // vm.blueBtn = 'backgroud: blue;'
      })
  }
  // if(vm.toggleLike){
  //   $http.delete('/user/users/' + vm.currentUser._id +'/likes'+ vm.currentUser._id.likes._id)
  //   vm.toggleLike = false
  //   vm.blueBtn = 'backgroud: white;'
  // }

  vm.etsySearch = function(word){
    etsUrl= '/search?etsyWord='+ word
    $http.get(etsUrl).then(function(response){
      console.log(response)
    })
  }
  vm.walmartSearch = function(word){
    console.log("let us search for "+ word)
    url= '/search?term='+ word
    $http.get(url).then(function(response){
      // console.log(response)
      vm.items = response.data
      console.log(vm.items)
      vm.walmart = vm.items.products.walmart.items
      vm.etsySearch(word)
    })
    vm.walmartToggle = function(){
      vm.selected = !vm.selected
    }
  }
}

// LOGIN CONTROLLER:
function loginController($state, AuthService) {
  var vm = this
  vm.login = function () {

    // initial values
    vm.error = false
    vm.disabled = true

    // call login from service
    AuthService.login(vm.loginForm.username, vm.loginForm.password)
      // handle success
      .then(function () {
        console.log("Successful login...")
        $state.go('profile')
        vm.disabled = false
        vm.loginForm = {}
      })
      // handle error
      .catch(function () {
        console.log("Whoops...")
        vm.error = true
        vm.errorMessage = "Invalid username and/or password"
        vm.disabled = false
        vm.loginForm = {}
      })
  }
}


// LOGOUT CONTROLLER:
function logoutController($state, AuthService) {
  var vm = this
  vm.logout = function () {

    // call logout from service
    AuthService.logout()
      .then(function () {
        $state.go('login')
      })
  }
}

// REGISTER CONTROLLER:
function registerController($state, AuthService) {
  var vm = this
  vm.register = function () {

    // initial values
    vm.error = false
    vm.disabled = true

    // call register from service
    AuthService.register(vm.registerForm.username, vm.registerForm.password)
      // handle success
      .then(function () {
        $state.go('profile')
        vm.disabled = false
        vm.registerForm = {}
      })
      // handle error
      .catch(function () {
        vm.error = true
        vm.errorMessage = "Something went wrong!"
        vm.disabled = false
        vm.registerForm = {}
      })
  }
}

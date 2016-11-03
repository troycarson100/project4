angular.module('myApp')
  .controller('mainController', mainController)
  .controller('loginController', loginController)
  .controller('logoutController', logoutController)
  .controller('registerController', registerController)
  .controller('SearchController', SearchController)
  .controller('SingleItemController', SingleItemController)


  mainController.$inject = ['$rootScope', '$state', 'AuthService']
  loginController.$inject = ['$state', 'AuthService']
  logoutController.$inject = ['$state', 'AuthService']
  registerController.$inject = ['$state', 'AuthService']
  SearchController.$inject = ['$state', 'AuthService', '$http']
  SingleItemController.$inject = ['$state', 'AuthService', '$http', '$stateParams']




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
        console.log(vm.currentUser)
      })
  })
}

function SingleItemController($state, AuthService, $http, $stateParams){
  var vm = this
  AuthService.getUserStatus()
    .then(function(data){
      vm.currentUser = data.data.user
    })
    $http.get('/items/'+ $stateParams.id)
    .then(function(data){
      console.log(data);
      vm.item = data.data.item
      vm.data = data
      vm.likeIt = data.data.likeIt
    })

    vm.toggleLike= function(){
        vm.likeActive = !vm.likeActive
    }


    vm.liked = function(obj){
      // for (var i = 0; i < vm.currentUser.likes.length; i++) {
      //   if(obj.itemId == vm.currentUser.likes[i].itemId){
          $http.post('/user/users/'+ vm.currentUser._id +'/likes', obj)
          .then(function(data){
            console.log(data)
            vm.data.data.likeIt = vm.data.data.likeIt ? true : false
            vm.likeIt = data.data.likeIt
          })
        // }
      // }
    }

    vm.unliked = function(item){
      console.log(vm.currentUser.likes[0].itemId);
        $http.delete('/user/users/'+ vm.currentUser._id+ '/likes/'+ item.itemId)
        .then(function(data){
          console.log(data)
          vm.likeIt = data.data.likeIt
        })
    }
}

function SearchController($state, AuthService, $http){
  var vm = this

  vm.termino = ""
  vm.textLimit = 100
  vm.selected = false

  AuthService.getUserStatus()
    .then(function(data){
      vm.currentUser = data.data.user
    })



  vm.singleView = function(id) {
    url = '/items/' + id
    $http.get(url).then(function(response){
      console.log(response)
      vm.item = response
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
      //For loop that will find all previous liked and turn button blue on request.
      // for (var i = 0; i < vm.walmart.length; i++) {
      //   for (var i = 0; i < currentUser.likes.length; i++) {
      //     if(vm.walmart[i].itemId == currentUser.likes[i].itemId){
      //       vm.walmart[i]
      //     }
      //   }
      // }
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

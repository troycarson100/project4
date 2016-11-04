angular.module('myApp')
  .controller('mainController', mainController)
  .controller('loginController', loginController)
  .controller('logoutController', logoutController)
  .controller('registerController', registerController)
  .controller('SearchController', SearchController)
  .controller('SingleItemController', SingleItemController)
  .controller('SuggestionController', SuggestionController)


  mainController.$inject = ['$rootScope', '$state', '$http', 'AuthService']
  SuggestionController.$inject = ['$state', 'AuthService', '$http']
  SingleItemController.$inject = ['$state', 'AuthService', '$http', '$stateParams']
  SearchController.$inject = ['$state', 'AuthService', '$http', '$rootScope']
  loginController.$inject = ['$state', 'AuthService']
  logoutController.$inject = ['$state', 'AuthService']
  registerController.$inject = ['$state', 'AuthService']




function mainController($rootScope, $state, $http, AuthService) {
  var vm = this

  vm.toggleMenu = function(){
    vm.menuActive = !vm.menuActive
  }

  $rootScope.$on('$stateChangeStart', function (event) {
    // console.log("Changing states")
    AuthService.getUserStatus()
      .then(function(data){
        vm.currentUser = data.data.user
        // console.log(vm.currentUser)
      })
  })

  vm.navSearch = function(word){
    console.log(word)
    vm.searchTerm = word
    $state.go('search')
    console.log(word)
    $rootScope.url = '/search?term='+ word
    $http.get($rootScope.url).then(function(response){
    vm.items = response.data
    console.log(vm.items)
    vm.walmart = vm.items.products.walmart.items
    })
  }

}

// SUGGESTION CONTROLLER
function SuggestionController($state, AuthService, $http){
  var vm = this

  AuthService.getUserStatus()
    .then(function(data){
      vm.currentUser = data.data.user

    })


  vm.printLikes = function(){
    vm.likes = vm.currentUser.likes
    vm.nodeArr = []
    vm.fiveArr = []


    for (var i = 0; i < vm.likes.length; i++) {
      vm.nodes = vm.likes[i].categoryNode
      console.log(vm.nodes)

      // vm.node = vm.nodes.split('_')

      vm.nodeArr.push(vm.nodes)
    }
    // merge all category numbers into one array
    // vm.merged = [].concat.app  ly([], vm.nodeArr);

    var frequency = {};  // array of frequency.
    var max = 0;  // holds the max frequency.
    var result;   // holds the max frequency element.
    for(var v in vm.nodeArr) {
        frequency[vm.nodeArr[v]]=(frequency[vm.nodeArr[v]] || 0)+1;
        if(frequency[vm.nodeArr[v]] > max) {
            max = frequency[vm.nodeArr[v]];
            result = vm.nodeArr[v];
        }
        console.log(result)
    }
    //Most used category of all user likes
    // console.log(result)
    vm.categorySearch = function(r){
      url= '/category?num='+ r
      $http.get(url).then(function(response){
        vm.items = response.data.item.items
        // console.log(vm.items)
        vm.items

        function shuffleArray(array) {
           for (var i = array.length - 1; i > 0; i--) {
               var j = Math.floor(Math.random() * (i + 1));
               var temp = array[i];
               array[i] = array[j];
               array[j] = temp;
           }
           return array;
          //  console.log(array)
        }
        for (var i = 0; i < 5; i++) {
          shuffleArray(vm.items)
          vm.fiveArr.push(vm.items.pop())
        }
        console.log(vm.fiveArr)
      })
    }
    vm.categorySearch(result)
  }

}

//SINGLE ITEM CONTROLLER
function SingleItemController($state, AuthService, $http, $stateParams){
  var vm = this

  AuthService.getUserStatus()
    .then(function(data){
      vm.currentUser = data.data.user
    })

    $http.get('/items/'+ $stateParams.id)
    .then(function(data){
      // console.log(data);
      vm.item = data.data.item
      vm.data = data
      vm.likeIt = data.data.likeIt
    })

    vm.liked = function(obj){
          $http.post('/user/users/'+ vm.currentUser._id +'/likes', obj)
          .then(function(data){
            // console.log(data)
            vm.likeIt = data.data.likeIt
          })
    }

    vm.unliked = function(item){
        $http.delete('/user/users/'+ vm.currentUser._id+ '/likes/'+ item.itemId)
        .then(function(data){
          console.log(data)
          vm.likeIt = data.data.likeIt
          if($state.current.name == 'profile') {
            console.log("Trying to remove item from DOM")
            vm.currentUser.likes.splice(vm.currentUser.likes.indexOf(item), 1)
          }
        })
    }

}

// SEARCH CONTROLLER
function SearchController($state, AuthService, $http, $rootScope){
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

  vm.etsySearch = function(word){
    etsUrl= '/search?etsyWord='+ word
    $http.get(etsUrl).then(function(response){
      console.log(response)
    })
  }

  vm.walmartSearch = function(word){
    if(!word) return
    console.log("let us search for "+ word)
    url= '/search?term='+ word
      $http.get(url).then(function(response){
      vm.items = response.data
      console.log(vm.items)
      vm.walmart = vm.items.products.walmart.items
    })

      // vm.etsySearch(word)

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

// TODO: Write app
var numenera = angular.module('numenera', ['ngRoute', 'ngSanitize']);

numenera.config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true)
  $routeProvider
    .when('/', {
      controller: 'MainController',
      templateUrl: '/views/main.html'
    })
    .when('/cyphers/:quantity', {
      controller: 'CyphersController',
      templateUrl: '/views/cyphers.html'
    })
    .when('/cypher-list', {
      controller: 'CypherListController',
      templateUrl: '/views/cypher-list.html'
    })
    .otherwise({redirectTo: '/'});
});

// Set up Masonry after the ngRepeat has finished.
numenera.directive('masonrySetUp', function($rootScope) {
  return function($scope, element, attrs) {
    if ($scope.$last) {
      // It takes a couple milliseconds after the "last" element for the 
      // height to render fully
      var timeoutID = window.setTimeout(function() {
        var container = document.querySelector('#masonry');
        $rootScope.msnry = new Masonry(container, {
          itemSelector: '.brick'
        });
      }, 10);
    }
  };
});

numenera.service('Dice', function diceFactory() {
  var service = {
    roll: function(dice) {
      var total = 0,
          rolls = [],
          die = dice.split('d'),
          noOfDie = parseInt(die[0], 10),
          noOfSides = parseInt(die[1], 10);

      for(var i = 0; i < noOfDie; i++) {
        var roll = parseInt((Math.random() * noOfSides + 1), 10);
        total = total + roll;
        rolls.push({
          'result': roll
        });
      }

      return {
        total: total,
        rolls: rolls
      }
    }
  };

  return service;
});

numenera.service('Cyphers', ['$http', '$rootScope', function($http, $rootScope) {
  var service = {
    cyphers: [],

    getCypher: function(id) {
      var cypher = null;

      for(var j = 0, k = service.cyphers.length; j < k; j++) {
        if(service.cyphers[j].id === id) {
          cypher = jQuery.extend({}, service.cyphers[j]);
        }
      }
      
      return cypher;
    },

    addCypher: function(cypher) {
      service.cyphers.push(cypher);
      $rootScope.$broadcast('cyphers.update');
    },

    init: function() {
      $http.get('/api/cyphers', {isArray: true})
        .then(function(result) {
          service.cyphers = result.data;
          $rootScope.$broadcast('cyphers.ready');
        });
    }
  }

  service.init();

  return service;
}]);

numenera.controller('MainController', function($scope, $location, Cyphers) {
  $scope.rollCyphers = function() {
    $location.path('/cyphers/' + $scope.quantity);
  };
});

numenera.controller('CyphersController', function($scope, $routeParams, Cyphers, Dice) {
  var intVal = 0;
  $scope.cyphers = [];
  $scope.rolls = [];
  $scope.nonRolls = [];
  $scope.number = $routeParams.quantity;

  // If specified in die form, get results of die roll
  if($scope.number.indexOf('+') > 0) {
    var points = $scope.number.split('+');

    for(var i = 0, l = points.length; i < l; i++) {
      if(points[i].indexOf('d') > 0) {
        var temp = Dice.roll(points[i])
        intVal = temp.total;
        $scope.rolls = $scope.rolls.concat(temp.rolls);
      } else {
        intVal = intVal + parseInt(points[i], 10);
        $scope.nonRolls.push({
          'result': ' + ' + points[i]
        });
      }
    }
  } else if($scope.number.indexOf('d') > 0) {
    var temp = Dice.roll($scope.number)
        intVal = temp.total;
        $scope.rolls = $scope.rolls.concat(temp.rolls);
  // Otherwise just roll up the specified number of cyphers
  } else {
    intVal = intVal + parseInt($routeParams.quantity, 10);
    $scope.nonRolls.push({
      'result': $routeParams.quantity
    });
  }

  function rollCyphers() {
    // Roll a d100 for each cypher
    for(var i = 0; i < intVal; i++) {
      var number = parseInt((Math.random() * 100 + 1), 10);
      // If the roll is 50 or less, roll again using the cypher list in the Numenera corebook
      if(number < 51) {
        number = parseInt((Math.random() * 100 + 1), 10);
      // Otherwise add 100 to use the cypher from Cypher Collection 1
      } else {
        number = number + 100;
      }
      // Then add to the array. We need to add as an object since the array wouldn't allow duplicate indexes
      var temp = Cyphers.getCypher(number);
      //temp.form = temp.form[parseInt((Math.random() * temp.form.length), 10)];
      temp = refineCypher(temp);
      $scope.cyphers.push(temp);
    }
  }

  function refineCypher(cypher) {
    cypher = rollLevel(cypher);
    cypher = determineForm(cypher);

    return cypher;
  }

  function rollLevel(cypher) {
    var level = 0,
        rolling = null;

    if(cypher.level.indexOf('+') > 0) {
      var rolling = cypher.level.split('+');
      
      for(var i = 0, l = rolling.length; i < l; i++) {
        var temp = 0;
        if(rolling[i].indexOf('d') > 0) {
          temp = Dice.roll(rolling[i]);
          level = level + temp.total;
        } else {
          level = level + parseInt(rolling[i], 10);
        }
      }
      cypher.level = level
    } else if (cypher.level.indexOf('d') > 0) {
      level = Dice.roll(cypher.level);
      cypher.level = level.total;
    }
    
    return cypher;
  }

  function determineForm(cypher) {
    cypher.form = cypher.form[parseInt((Math.random() * cypher.form.length), 10)];

    return cypher;
  }

  rollCyphers();
});

numenera.controller('CypherListController', function($scope, $rootScope, Cyphers) {
  $scope.cyphers = Cyphers.cyphers;

  $scope.rebuildMasonry = function() {
    var container = document.querySelector('#masonry');
    $rootScope.msnry = new Masonry(container);
  };
});
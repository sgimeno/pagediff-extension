var angular = require('angular');

require('./modules/loader/loader');

angular.module('com.img.chrome', [
  require('angular-ui-router'),
  'com.img.chrome.loader'
])

.config(function($urlRouterProvider){
  $urlRouterProvider.otherwise("/loader");
})
;

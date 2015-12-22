//TODO: promisify chrome API
var angular = require('angular');

function getCurrentActiveTab(cb){
  chrome.tabs.query({active:true, currentWindow: true}, cb);
}

function sendMessageToCurrentTab(body, cb){
  getCurrentActiveTab(function(tabs){
      // send the message body to the content script
      chrome.tabs.sendMessage(tabs[0].id, body, {}, cb);
  });
}

angular.module('com.img.chrome.loader',[
  require('angular-ui-router')
])
.config(function($stateProvider){
  $stateProvider
    .state('loader', {
      url: '/loader',
      templateUrl: 'modules/loader/loader.html',
      controller: 'LoaderCtrl',
      controllerAs: 'loader'
    });
})

.directive("fileread", [function () {
    return {
        restrict: 'A',
        scope: {
            fileread: "=",
            onLoadFile: '='
        },
        link: function (scope, element, attributes) {
            function handleFileSelect(evt) {
              var files = evt.target.files;

              // Loop through the FileList and render image files as thumbnails.
              for (var i = 0, f; f = files[i]; i++) {

                // Only process image files.
                if (!f.type.match('image.*')) {
                  continue;
                }

                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (function(theFile) {
                  return function(e) {
                    // Render thumbnail.
                    sendMessageToCurrentTab({ name: 'renderImage', fileName: theFile.name, imageData: e.target.result }, function(response){
                      console.log(response);
                      scope.onLoadFile();
                      // window.close();
                    });
                  };
                })(f);

                // Read in the image file as a data URL.
                reader.readAsDataURL(f);
              }
            }

            element.bind("change", handleFileSelect);
        }
    }
}])

.controller('LoaderCtrl', LoaderCtrl);

function LoaderCtrl($state, $timeout){
  var self = this;

  this.$state = $state;
  this.file = {};

  this.loadData = function(){
    sendMessageToCurrentTab({ name: 'getLocalStorage', keys: ['pd_img_src', 'pd_file_name'] }, function(response){
      $timeout(function(){
        self.file.name = response.pd_file_name;
      }, 5);
    });
  };

  this.unload = function(){
    //TODO: sendMessageToCurrentTab({ name: 'unloadImage' })
    sendMessageToCurrentTab({ name: 'unloadImage'}, function(response){
      $timeout(function(){
        delete self.file.name;
      }, 5);
    });
  };

  this.loadData();

}

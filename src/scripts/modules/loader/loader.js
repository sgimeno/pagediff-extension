var angular = require('angular');
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
            chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
                // send the imageData via a message to the content script
                chrome.tabs.sendMessage(tabs[0].id, { name: 'new_image', imageData: e.target.result }, {}, function(response) {
                  console.log(response);
                  window.close();
                });
            });

        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
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
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            // element.bind("change", function (changeEvent) {
            //     var reader = new FileReader();
            //     reader.onload = function (loadEvent) {
            //         scope.$apply(function () {
            //             // scope.fileread = loadEvent.target.result;
            //             scope.fileread = changeEvent.target.files[0];
            //             console.log(scope.fileread);
            //         });
            //     }
            //     // reader.readAsDataURL(changeEvent.target.files[0]);
            // });
            element.bind("change", handleFileSelect);
        }
    }
}])

.controller('LoaderCtrl', LoaderCtrl);

function LoaderCtrl($state){
  this.$state = $state;

}

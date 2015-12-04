console.log('Content_Script::::');
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  var tpl =
  '<div id="image-extension-wrapper">' +
      '<img id="img-placeholder" src="' + msg.imageData + '"/>'+
  '</div>';

  document.body.innerHTML += tpl;
  var wrapper = document.getElementById('image-extension-wrapper');
  sendResponse('ok');
});

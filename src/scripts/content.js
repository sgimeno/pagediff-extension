function tpl(imageData){
  return '<div id="image-extension-wrapper">' +
            '<img id="img-placeholder" src="' + imageData + '"/>'+
        '</div>';
}

var wrapper;

if (localStorage.pd_img_src){
    document.body.innerHTML += tpl(localStorage.pd_img_src);
    wrapper = document.getElementById('image-extension-wrapper');
}

function renderImage(msg, sendResponse) {
  wrapper = document.getElementById('image-extension-wrapper');
  console.log(msg);
  if (!wrapper) {
    document.body.innerHTML += tpl(msg.imageData);
  } else {
    wrapper.firstChild.src = msg.imageData;
  }

  localStorage.pd_img_src = msg.imageData;
  localStorage.pd_file_name = msg.fileName;

  sendResponse({
    pd_img_src: msg.imageData,
    pd_file_name: msg.fileName
  });
}

function getLocalStorage(keys, sendResponse){
  var data = {};
  keys.forEach(function(k){
    data[k] = localStorage[k];
  });
  sendResponse(data);
}

function setLocalStorage(data, sendResponse){
  Object.keys(data).forEach(function(k){
    localStorage[k] = data[k];
  });
  sendResponse(true);
}

function unloadImage(sendResponse){
  var img = document.getElementById('img-placeholder');
  img.src = '#';
  delete localStorage.pd_file_name;
  delete localStorage.pd_img_src;
  sendResponse(true);
}

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  switch (msg.name){
    case 'getLocalStorage':
      getLocalStorage(msg.keys, sendResponse);
      break;
    case 'setLocalStorage':
      setLocalStorage(msg.data, sendResponse);
      break;
    case 'unloadImage':
      unloadImage(sendResponse);
      break;
    case 'renderImage':
      renderImage(msg, sendResponse);
      break;
    default:
      break;
  }
});

function downloadFile(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "blob"; 

  const FINAL_NAME = 'Faithful Mods Resource Pack'
  
  try {
    req.onload = (event) => {
      if(req.status !== 200)
        throw req
      
      var blob = req.response;
      var fileName = FINAL_NAME + ' ' + new Date().getTime() + '.zip';
      var contentType = 'application/zip';
  
      if (window.navigator.msSaveOrOpenBlob) {
        // Internet Explorer
        window.navigator.msSaveOrOpenBlob(new Blob([blob], {type: contentType}), fileName);
      } else {
        var el = document.getElementById("target");
        el.href = window.URL.createObjectURL(blob);
        el.download = fileName;
        el.click();
  
        callback();
      }
    };

    req.send();
  } catch (error) {
    throw error
  }
}
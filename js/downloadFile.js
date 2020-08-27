function downloadFile(url) {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "blob";

  req.onload = function (event) {
    var blob = req.response;
    var fileName = null;
    var contentType = req.getResponseHeader("content-type");

    // IE/EDGE seems not returning some response header
    if (req.getResponseHeader("content-disposition")) {
      var contentDisposition = req.getResponseHeader("content-disposition");
      fileName = contentDisposition.substring(contentDisposition.indexOf("=")+1);
    } else {
      fileName = "unnamed." + contentType.substring(contentType.indexOf("/")+1);
    }

    if (window.navigator.msSaveOrOpenBlob) {
      // Internet Explorer
      window.navigator.msSaveOrOpenBlob(new Blob([blob], {type: contentType}), fileName);
    } else {
      var el = document.getElementById("target");
      el.href = window.URL.createObjectURL(blob);
      el.download = fileName;
      el.click();
    }
  };
  req.send();
}
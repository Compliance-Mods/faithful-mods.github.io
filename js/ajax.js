let getRequest = function(url, params, callback) {
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.response, 0);
        } else if(xhr.readyState === 4 && xhr.status !== 200) {
            callback(xhr, 1);
        }
    };
    
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    let arr = [];
    for(let key in params) {
        arr.push(key+'='+encodeURIComponent(params[key]));
    }
    xhr.send(arr.join('&'));
}
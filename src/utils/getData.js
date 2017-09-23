
export default (url, callback) => fetch(url, {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  },
}).then(res => {
  if (res.status >= 200 && res.status < 300) {
    return res.json().then(json => callback(json._embedded));
  } else {
    callback();
  }
});
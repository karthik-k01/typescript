var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic a2FydGhpazoxMzkzQEthcnRoaWs=");

var raw = "";

var requestOptions = {
  method: 'GET',
  headers: myHeaders
};

fetch("https://search-testing-api-gu3d6o5seizyqs22nr3fdqy3yy.ap-northeast-1.es.amazonaws.com/users/_search", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
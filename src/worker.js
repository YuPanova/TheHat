self.addEventListener('message', function(e) {

  const word = e.data;
  const apiUrl = `https://api.unsplash.com/search/photos?query=${word}&w=300&client_id=ppcch0zYPrPtdyQ_FPrPbWGJ3eX-373TV25KATFYkKM`;

  const requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Accept-Version': 'v1',
    })
  };

  fetch(apiUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      //cashing
      data.results.forEach(item => {
        fetch(item.urls.small, { headers:{responseType: 'arraybuffer' }})
          .then(response => {
            const blob = new Blob([response], { type: 'image/jpeg' });
            URL.createObjectURL(blob)
          })
          .catch(error => (console.error('Fetch error:', error)));
      })

      postMessage(data.results);

    })
    .catch(error => ( console.error('Fetch error:', error)))
})


const myForm = document.getElementById('my-form');
myForm.addEventListener('submit', function(event){
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/register', {
    method: 'POST',
    body: JSON.stringify({username, password}),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(function(response){
    if(response.status === 400){
      alert('username already in use');
    } else if(response.status === 201){
      alert('you are all signed up');
    } else {
      alert('something went wrong');
    }
  })
});

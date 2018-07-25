const myForm = document.getElementById('my-form');
myForm.addEventListener('submit', function(event){
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({username, password}),
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(function(response){
    if(response.status === 200){
      window.location.pathname = '/profile';
    } else {
      alert('invalid user name or password');
    }
  })
});

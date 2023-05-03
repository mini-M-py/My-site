//const nameInput = document.getElementById("name");
//const signinButton = document.getElementById("logIn");
//const signupButton = document.getElementById("register");
function login(event) {
    let formEl = document.querySelector('.form');

    formEl.addEventListener('submit', event => {
        event.preventDefault();

        let formData = new FormData(formEl);
        let data = new URLSearchParams(formData);

        fetch('https://mini-media.onrender.com/login', {
            method: 'POST',
            body: data,
        }).then(res => res.json())
            .then(data => {
                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                    window.location.href = 'index.html';
                } else {
                    alert('Invalid eamil and password. Try again!')
                }
            })
            .catch(error => console.log(error));
    })
}

function home(token) {
    fetch('https://mini-media.onrender.com/posts/', {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (res.status === 401) {
                window.location.href = 'login.html'
            } else {
                return res.json();
            }
        })
        .then(data => {
            data.forEach(post => {
                const markup =
                    `<div class="user-post"><h2 class="username"><button>${post.Post.owner.user_name}</button></h2>
                <h3 class="title">${post.Post.title}</h3>
                <p class="content">${post.Post.content}</p>
                </div>`

                document.querySelector('#section').insertAdjacentHTML('beforeend', markup);

            })
        })
        .catch(error => console.log(error));
}

function registered(event) {
    const formEl = document.querySelector('.form1');


    formEl.addEventListener('submit', event => {
        event.preventDefault();
         if (!otpSent) {
            alert("Please send OTP before registering.");
            return;
         }
        const user = {
            user_name: document.querySelector('input[name="user_name"]').value,
            email: document.querySelector('input[name="email"]').value,
            password: document.querySelector('input[name="password"]').value,
            otp: document.querySelector('input[name="otp"]').value
        }
        console.log(user)
        //const formData = new FormData(formEl)
        //console.log(formData)
        //const data = new URLSearchParams(user)

        fetch('https://mini-media.onrender.com/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)

        }).then(res => {
            if (res.status === 409) {
                alert('Email already register');
            }
            else if (res.status === 201) {
                return res.json();
            }
            else {
                alert('invalid credential, Try again!!!')
            }
        })
            .then(data => {
                console.log('success')
                window.location.href = 'login.html';
            })
            .catch(error => console.log(error))
    })
}



const formEl = document.querySelector('.form1');
const sendBtn = document.querySelector("#send");
const otpText = document.querySelector("#otp_text");
let otpSent = false;

function otp(event) {
  event.preventDefault();

  const user = {
    email: document.querySelector('input[name="email"]').value,
  };

  fetch('https://mini-media.onrender.com/user/verified', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify(user)
  }).then(res => {
    if (res.status === 500) {
      alert("Couldn't send email. Try again!!!");
    }
    else if (res.status === 422){
        alert("invalid credential")
    }
    return res.json();
  }).then(data => {
    otpSent = true;
    sendBtn.innerText = "Sent";
    otpText.innerText = "Check your email for the OTP.";
  }).catch(error => console.log(error))
}

function register(event) {
  event.preventDefault();

  if (!otpSent) {
    alert("Please send OTP before registering.");
    return;
  }

  // Rest of the registration code
}

sendBtn.addEventListener('click', otp);
formEl.addEventListener('submit', register);

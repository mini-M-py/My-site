
const notification = document.querySelector('.notification');
const message = document.querySelector('#message');
let timerId;


function showNotificationWithDelay(messageText, delay) {
    setTimeout(() => {
        showNotification(messageText);
    }, delay);
}


function showNotification(messageText) {
    message.textContent = messageText;
    notification.classList.add('active');
    timerId = setTimeout(() => {
        hideNotification();
    }, 15000);
}


function hideNotification() {
    notification.classList.remove('active');
    clearTimeout(timerId);
}


showNotificationWithDelay('Budget is low, server is slow, it will take time to load', 2000);

//submit Posts
//const //popupBackground = document.getElementById("popupBackground")
function showPopup() {
    document.getElementById("popupBackground").style.display = "block";
}

const createPost = document.querySelector("#submitPost")

function submit(token) {
    var title = document.getElementById("postTitle").value;
    var content = document.getElementById("postContent").value;
    var privacy = document.getElementById("postPrivacy").value;

    // Perform any necessary validation on the form inputs
    var published = privacy === "public";
    // Create a new post object or send the data to the server
    var post = {
        title: title,
        content: content,
        published: published
    };

    // Perform any necessary AJAX request to submit the post data
    // Example using Fetch API
    fetch("https://mini-media.onrender.com/posts/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify(post)
    })
        .then(response => {
            if (response.ok) {
                // Post submitted successfully
                showNotificationWithDelay("post submitted successfully!!", 1000)
                // Reset the form inputs
                document.getElementById("postTitle").value = "";
                document.getElementById("postContent").value = "";
                document.getElementById("postPrivacy").value = "public";
                document.getElementById("popupBackground").style.display = "none";

            } else {
                // Post submission failed
                showNotificationWithDelay("Something Went Wrong, Try again!!!", 1000)
            }
        })
        .catch(error => {
            // Error occurred during the request
            console.error("An error occurred during the post submission:", error);
        });
}

function cancel() {
    // Reset the form inputs
    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
    document.getElementById("postPrivacy").value = "public";
    document.getElementById("popupBackground").style.display = "none";
}

//home
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
            showNotificationWithDelay("Please send OTP before registering.", 1000);
            return;
        }
        const user = {
            user_name: document.querySelector('input[name="user_name"]').value,
            email: document.querySelector('input[name="email"]').value,
            password: document.querySelector('input[name="password"]').value,
            otp: document.querySelector('input[name="otp"]').value
        }


        fetch('https://mini-media.onrender.com/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)

        }).then(res => {
            if (res.status === 409) {
                showNotificationWithDelay('Email already register', 1000);
            }
            else if (res.status === 201) {
                return res.json();
            }
            else {
                showNotificationWithDelay('invalid credential, Try again!!!', 1000)
            }
        })
            .then(data => {
                console.log('success')
                window.location.href = 'login.html';
            })
            .catch(error => console.log(error))
    })
}

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
                    showNotificationWithDelay('Invalid eamil and password. Try again!', 1000);
                }
            })
            .catch(error => console.log(error));
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
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(res => {
        if (res.status === 500) {
            showNotificationWithDelay("Couldn't send email. Try again!!!", 1000);
        }
        else if (res.status === 422) {
            showNotificationWithDelay("invalid credential", 1000);
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
        showNotificationWithDelay("Please send OTP before registering.", 1000);
        return;
    }


}

sendBtn.addEventListener('click', otp);
formEl.addEventListener('submit', register);
//createPost.addEventListener('click', submit(token));

fetch('http://127.0.0.1:8000/posts/')
.then(res => {
    return res.json();
})
.then(data => {
    data.forEach(post => {
        const markup = `<div class="user-post"><h2 class="username"><button>${post.Post.owner.user_name}</button></h2>
        <h3 class="title">${post.Post.title}</h3>
        <p class="content">${post.Post.content}</p>
        </div>`
        document.querySelector('#section').insertAdjacentHTML('beforeend', markup);
    })
})
.catch(error =>console.log(error));
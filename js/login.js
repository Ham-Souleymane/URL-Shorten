const loginForm = document.getElementById('login-form');



loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('#login-form > input[name="email"]').value;
    const password = loginForm.querySelector('#login-form > input[name="password"]').value;

    const url = 'https://www.shorten-url-api.infobrains.club/api/public/auth/login'
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const jsonResponse = await result.json();

    if (result.status === 500) {
        alert('Internal server error');
    }

    if (result.status === 400) {
        alert(jsonResponse.error.details);
    }

    if (result.status === 200) {
        const token = jsonResponse.data.accessToken;
        localStorage.setItem('token', token);
        window.location.href = '/pages/shorten.html';
    }
});
// handling register
const registerToggle=document.querySelector('.Ragister-toggle');
const loginToggle=document.querySelector('.login-toggle');
const logForm=document.querySelector('.login');
const regForm=document.querySelector('.register');
registerToggle.addEventListener('click',()=>{
    logForm.classList.remove("active");
    regForm.classList.add('active');
console.log('hello');
})
loginToggle.addEventListener('click',()=>{
    regForm.classList.remove("active");
    logForm.classList.add('active');
console.log('hello');
})

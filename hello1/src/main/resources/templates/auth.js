// Handle login
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    // Simulate login logic here
    window.location.href = 'game.html'; // Redirect to game page on success
});

// Handle signup
document.getElementById('signupForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    // Simulate signup logic here
    window.location.href = 'game.html'; // Redirect to game page on success
});

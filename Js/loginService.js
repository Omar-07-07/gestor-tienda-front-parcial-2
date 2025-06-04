document.getElementById('loginForm').addEventListener('submit', function (e) {
	e.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	login(email, password);
});

function login(email, password) {
	localStorage.removeItem('token');
	let message = '';
	let alertType = '';
	const LOGIN_ENDPOINT = 'https://api.escuelajs.co/api/v1/auth/login';

	fetch(LOGIN_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	})
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Credenciales inválidas');
			}
		})
		.then(data => {
			localStorage.setItem('token', data.access_token);
			alertType = 'success';
			message = 'Inicio de sesión exitoso';
			alertBuilder(alertType, message);

			setTimeout(() => {
				location.href = 'admin/dashboard.html';
			}, 2000);
		})
		.catch(error => {
			alertType = 'danger';
			message = 'Inicio de sesión inválido o error en el servidor';
			alertBuilder(alertType, message);
			console.error(error);
		});
}

function alertBuilder(alertType, message) {
	const alert = `
	<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
		${message}
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	</div>`;
	document.getElementById('mensaje').innerHTML = alert;
}

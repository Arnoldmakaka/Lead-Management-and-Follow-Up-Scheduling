import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';

export default function Login() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const validateForm = () => {
		const newErrors = {};
		if (!email) {
			newErrors.email = 'Email is required';
		}

		if (!password) {
			newErrors.password = 'Password is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	const extractToken = (token) => {
  		return token.split('|').pop();
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}

		try {
			setLoading(true);
			const response = await api.post('/login', { email, password });
			if(response.data.status == 'error') {
				setErrors({ form: `${response.data.message}` });
			}
			if(response.data.status == 'success') {
				const token = extractToken(response.data.data.access_token);
				const userProfile = response.data.data.user;
				login(token, userProfile);
			}
		} catch (error) {
			setErrors({ form: 'Login failed. Please check your credentials.' });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="d-flex align-items-center justify-content-center vh-100" style={{backgroundColor: '#1e3c72',}}>
			<main className="form-signin w-100 m-auto p-4 rounded shadow" style={{ maxWidth: '400px', backgroundColor: 'white' }}>
				<form onSubmit={handleSubmit}>
					<h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>

					{errors.form && <div className="alert alert-danger">{errors.form}</div>}

					<div className="form-floating mb-3">
						<input
							type="email"
							className={`form-control ${errors.email ? 'is-invalid' : ''}`}
							id="floatingInput"
							placeholder="name@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<label htmlFor="floatingInput">Email address</label>
						{errors.email && <div className="invalid-feedback">{errors.email}</div>}
					</div>

					<div className="form-floating mb-3">
						<input
							type="password"
							className={`form-control ${errors.password ? 'is-invalid' : ''}`}
							id="floatingPassword"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<label htmlFor="floatingPassword">Password</label>
						{errors.password && <div className="invalid-feedback">{errors.password}</div>}
					</div>

					<button
						className="btn btn-primary w-100 py-2"
						type="submit"
						disabled={loading}
					>
						{loading ? 'Signing in...' : 'Sign in'}
					</button>
				</form>
			</main>
		</div>
	)
}
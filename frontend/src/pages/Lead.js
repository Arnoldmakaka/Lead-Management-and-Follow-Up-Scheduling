import React, { useState, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';

export default function Lead() {

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const validateForm = () => {
		const newErrors = {};
		if (!name) {
			newErrors.name = 'Name is required';
		}

		if (!email) {
			newErrors.email = 'Email is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}
		try {
			setLoading(true);
			const response = await api.post('/leads', { name, email, phone });
			if(response.data.status == 'error') {
				setErrors({ form: `${response.data.message}` });
			}
			if(response.data.status == 'success') {
				navigate('/leads', { replace: true });
			}
			
		} catch (error) {
			console.log(error)
			setErrors({ form: 'Lead submission failed. Please try again' });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<NavLink
				to="/leads"
	        	className="btn btn-secondary"
	        >
				Back
			</NavLink>

			<div className="card p-3 my-3">
				<caption>Creat a new Lead</caption>
				<form onSubmit={handleSubmit}>
					{errors.form && <div className="alert alert-danger">{errors.form}</div>}

					<div className="form-floating mb-3">
						<input
							type="text"
							className={`form-control ${errors.name ? 'is-invalid' : ''}`}
							id="floatingName"
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<label htmlFor="floatingName">Name</label>
						{errors.name && <div className="invalid-feedback">{errors.name}</div>}
					</div>
					
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
							type="text"
							className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
							id="floatingPhone"
							placeholder="Phone"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
						<label htmlFor="floatingPhone">Phone</label>
						{errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
					</div>

					<button
						className="btn btn-primary w-40 py-2"
						type="submit"
						disabled={loading}
					>
						{loading ? 'Submitting...' : 'Submit'}
					</button>
				</form>
			</div>
		</div>
	)
}
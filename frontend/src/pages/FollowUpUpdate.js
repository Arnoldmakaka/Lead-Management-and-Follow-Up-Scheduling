import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subDays, setHours, setMinutes, format } from 'date-fns';

export default function FollowUpUpdate() {

	const [selectedFollowUp, setSelectedFollowUp] = useState(null);
	const [status, setStatus] = useState(null);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { activeFollowUp, getAllFollowups, allFollowUps, getAllNotifications } = useContext(AuthContext);
	const { id } = useParams();

	useEffect(() => {
		if(activeFollowUp) {
			setSelectedFollowUp(activeFollowUp);
		} else {

			if (allFollowUps.length == 0) {
				getAllFollowups();
			}

			if(allFollowUps.length > 0) {
				const newFollowUp = allFollowUps.filter((followups) => followups.id == id);
				setSelectedFollowUp(newFollowUp[0]);
			}
		}
	}, [activeFollowUp, allFollowUps, id, getAllFollowups]);

	useEffect(() => {
		if(selectedFollowUp) {
			setStatus(selectedFollowUp.status);
		}
	}, [selectedFollowUp])

	const validateForm = () => {
		const newErrors = {};
		if (!status) {
			newErrors.status = 'Status is required';
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
			const response = await api.put(`/followups/${selectedFollowUp.id}/status`, { status });
			if(response.data.status == 'success') {
				await getAllNotifications();
				navigate('/follow-ups', { replace: true });
			} else {
				setErrors({ form: `${response.data.message}` });
			}
		} catch (error) {
			setErrors({ form: 'Update failed. Please try again' });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<NavLink
				to="/follow-ups"
	        	className="btn btn-secondary"
	        >
				Back
			</NavLink>

			<div className="card p-3 my-3">
				<p>Update schedule follow up</p>

				<div className="card p-2 mb-3">
					<span>Lead: <strong>{selectedFollowUp && selectedFollowUp.lead.name}</strong></span>
					<span>Scheduled at: <strong>{selectedFollowUp && format(selectedFollowUp.scheduled_at, "MMMM dd/yyyy hh:mm aa")}</strong></span>
				</div>

				<form onSubmit={handleSubmit}>
					{errors.form && <div className="alert alert-danger">{errors.form}</div>}

					<div className="mb-3">
						<label htmlFor="mb-1">Select Status</label>
						<select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" value={status || ""} onChange={(e) => setStatus(e.target.value)}>
							<option value="pending" disabled>Pending</option>
							<option value="completed">Completed</option>
							<option value="missed">Missed</option>
						</select>
						{errors.status && <div className="invalid-feedback">{errors.status}</div>}
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
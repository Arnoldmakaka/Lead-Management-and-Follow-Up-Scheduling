import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subDays, setHours, setMinutes, format } from 'date-fns';

export default function FollowUp() {

	const [leadDetails, setLeadDetails] = useState([]);
	const [selectedLead, setSelectedLead] = useState(null);
	const [scheduleDate, setScheduleDate] = useState(new Date());
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { allLeads, getAllLeads } = useContext(AuthContext);

	useEffect(() => {
		if(allLeads.length > 0) {
			setLeadDetails(allLeads);
		} else {
			getAllLeads();
		}
	}, [allLeads]);

	const validateForm = () => {
		const newErrors = {};
		if (!selectedLead) {
			newErrors.selectedLead = 'Lead is required';
		}

		if (!scheduleDate) {
			newErrors.email = 'Schedule date and time are required';
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
			const lead_id = selectedLead;
			const scheduled_at = format(scheduleDate, "yyyy-MM-dd HH:mm");
			
			setLoading(true);
			const response = await api.post('/followups', { lead_id, scheduled_at });
			if(response.data.status == 'error') {
				setErrors({ form: `${response.data.message}` });
			}
			if(response.data.status == 'success') {
				navigate('/follow-ups', { replace: true });
			}
			
		} catch (error) {
			console.log(error)
			setErrors({ form: 'Lead submission failed. Please try again' });
		} finally {
			setLoading(false);
		}
	}

	const getMinTime = (selectedDate) => {
		const now = new Date();
		const selectedDay = selectedDate.setHours(0, 0, 0, 0);
		const today = now.setHours(0, 0, 0, 0);
		if (selectedDay === today) {
			return new Date();
		} else {
			return setHours(setMinutes(new Date(selectedDate), 0), 8); // 8:00 AM
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
				<p>Schedule follow up</p>
				<form onSubmit={handleSubmit}>
					{errors.form && <div className="alert alert-danger">{errors.form}</div>}

					<div className="mb-3">
						<label htmlFor="mb-1">Select Lead</label>
						<select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" value={selectedLead} onChange={(e) => setSelectedLead(e.target.value)}>
							<option selected disabled>Open to select lead</option>
							{leadDetails.map((lead, index) => {
								return <option key={(`${lead.id}-index-${index}`).toString()} value={`${lead.id}`}>{lead.name}</option>
							})}
						</select>
						{errors.selectedLead && <div className="invalid-feedback">{errors.selectedLead}</div>}
					</div>

					<div className="mb-3">
						<label htmlFor="mb-1">Select date and time</label>
						
						<div>
							<DatePicker
						 		showIcon
						 		toggleCalendarOnIconClick
						 		selected={scheduleDate}
						 		onChange={(date) => setScheduleDate(date)}
						 		placeholderText="Select date and time"
						 		dateFormat="yyyy/MM/dd HH:mm aa"
						 		showTimeSelect
						 		minDate={new Date()}
						 		timeFormat="HH:mm"
						 		timeIntervals={10}
							/>
						</div>
						{errors.scheduleDate && <div className="invalid-feedback">{errors.scheduleDate}</div>}
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
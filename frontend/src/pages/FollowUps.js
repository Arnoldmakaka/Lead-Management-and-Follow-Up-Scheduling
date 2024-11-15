import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';
import { subDays, setHours, setMinutes, format } from 'date-fns';

export default function FollowUps() {

	const [followUpDetails, setFollowUpDetails] = useState([]);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [fetchingError, setFetchingError] = useState(null);
	const { setActiveFollowUpDetails, getAllFollowups, user, allFollowUps } = useContext(AuthContext);
	const navigate = useNavigate();

	const getFollowUpDetails = async () => {
		setFetchingError(null);
		try {
			setLoadingDetails(true);
			await getAllFollowups();
		} catch (error) {
			setFetchingError('Fetching follow up details failed. Please try again');
		} finally {
			setLoadingDetails(false);
		}
	}

	useEffect(() => {
		getFollowUpDetails();
	}, []);

	useEffect(() => {
		if(allFollowUps){
			setFollowUpDetails(allFollowUps)
		}
	}, [allFollowUps]);

	const handleFollowUp = (followup) => navigate(`/follow-ups/${followup.id}/update`);

	return (
		<div>
			<NavLink
				to="/follow-ups/create"
	        	className="btn btn-success mb-4"
	        >
				Schedule new follow up
			</NavLink>

			<div className="card table-responsive p-4">
				{fetchingError && <div className="alert alert-danger mb-2">{fetchingError}</div>}
				<p>List of Scheduled follow ups</p>
				<table className="table table-striped table-bordered">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col" className="text-center">Lead</th>
							<th scope="col" className="text-center">Schedule</th>
							<th scope="col" className="text-center">Status</th>
							{['admin', 'sales_manager'].includes(user.role) && (<th scope="col" className="text-center">Actions</th>)}
						</tr>
					</thead>
					<tbody>
						{loadingDetails && <tr>
								<td colSpan="5" className="text-center py-3">
									<div className="spinner-border" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</td>
							</tr>
						}
						{!loadingDetails && (followUpDetails.length > 0 ? (followUpDetails.map((followUp, index) => {
							return (
								<tr key={(`${followUp.id}-index-${index}`).toString()}>
									<td>{index + 1 }</td>
									<td className="text-center">{followUp.lead.name}</td>
									<td className="text-center">{format(followUp.scheduled_at, "MMMM dd/yyyy HH:mm aa")}</td>
									<td className="text-center text-capitalize text-small"><span className={`btn text-small ${followUp.status == 'pending' ? 'btn-primary' : (followUp.status == 'missed' ? 'btn-danger' : 'btn-success')}`}>{followUp.status}</span></td>
									<td className="text-center">
										{['admin', 'sales_manager'].includes(user.role) && (
											<button
												type="button"
												onClick={() => handleFollowUp(followUp)}
												className={`btn text-small ${followUp.status === 'pending' ? 'btn-warning' : 'btn-secondary disabled'} btn-sm`}
											>Update</button>
										)}
									</td>
								</tr>
							);
						})) : (
								<tr>
									<td colSpan="5" className="text-center py-3">No scheduled follow ups ..</td>
								</tr>
							)
						)}
			        </tbody>
			    </table>
			</div>
		</div>
	);
}
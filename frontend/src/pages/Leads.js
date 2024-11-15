import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';

export default function Leads() {

	const [leadDetails, setLeadDetails] = useState([]);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [fetchingError, setFetchingError] = useState(null);
	const { getAllLeads, allLeads } = useContext(AuthContext);

	const getLeadDetails = async () => {
		setFetchingError(null);
		try {
			setLoadingDetails(true);
			await getAllLeads()
		} catch (error) {
			setFetchingError('Fetching lead details failed. Please try again');
		} finally {
			setLoadingDetails(false);
		}
	}

	useEffect(() => {
		getLeadDetails()
	}, []);

	useEffect(() => {
		if(allLeads) {
			setLeadDetails(allLeads);
		}
	}, [allLeads]);

	return (
		<div>
			<NavLink
				to="/leads/create"
	        	className="btn btn-success mb-4"
	        >
				Create new lead
			</NavLink>

			<div className="card table-responsive p-4">
				{fetchingError && <div className="alert alert-danger mb-2">{fetchingError}</div>}
				<caption>List of Leads</caption>
				<table className="table table-striped table-bordered">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col" className="text-center">Name</th>
							<th scope="col" className="text-center">Email</th>
							<th scope="col" className="text-center">Phone</th>
						</tr>
					</thead>
					<tbody>
						{loadingDetails && <tr>
								<td colSpan="4" className="text-center py-3">
									<div className="spinner-border" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</td>
							</tr>
						}
						{!loadingDetails && (leadDetails.length > 0 ? (leadDetails.map((lead, index) => {
							return (
								<tr key={(`${lead.id}-index-${index}`).toString()}>
									<td>{index + 1 }</td>
									<td className="text-center">{lead.name}</td>
									<td className="text-center">{lead.email}</td>
									<td className="text-center">{lead.phone}</td>
								</tr>
							);
						})) : (
								<tr>
									<td colSpan="4" className="text-center py-3">No leads..</td>
								</tr>
							)
						)}
			        </tbody>
			    </table>
			</div>
		</div>
	);
}
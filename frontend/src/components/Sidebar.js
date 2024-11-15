import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ HandleLogout, UserEmail="" }) {
	return (
		<div className="bg-white shadow-md vh-100 sidebar ps-3">
			<div className="m-2">
				<i className="bi bi-bootstrap-fill me-3 fs-4"></i>
				<span className="brand-name fs-4">{UserEmail}</span>
			</div>

			<hr className="text-dark" />

			<div className="list-group list-group-flush">
				<NavLink
					to="/leads"
					className={({ isActive }) =>
						`list-group-item py-1 my-1 ${isActive ? 'active' : ''}`
					}
				>
					<i className="bi bi-people fs-5 me-3"></i>
					<span className="fs-5">Leads</span>
				</NavLink>

				<NavLink
					to="/follow-ups"
					className={({ isActive }) =>
						`list-group-item py-1 my-1 ${isActive ? 'active' : ''}`
					}
				>
					<i className="bi bi-table fs-5 me-3"></i>
					<span className="fs-5">Follow ups</span>
				</NavLink>

				<button
					onClick={HandleLogout}
					className="my-2 btn btn-danger text-white"
				>
					<i className="bi bi-power fs-5 me-3"></i>
					<span className="fs-5">Logout</span>
				</button>
			</div>
		</div>
	);
}

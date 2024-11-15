import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import './Dashboard.css';
import 'bootstrap/js/dist/dropdown';

export default function Dashboard() {

	const { logout, user } = useContext(AuthContext);
	const handleLogout = () => logout();

	const [userProfile, setUserProfile] = useState(null);

	useEffect(() => {
		if(user) {
			setUserProfile(user);
		}
	}, [user]);

	return (
		<div className="wrapper bg-light min-vh-100">
			<div className="row">
				<div className="col-2 bg-white">
					<Sidebar HandleLogout={handleLogout} UserEmail={userProfile && userProfile.email} />
				</div>

				<div className="col p-0">
					<nav className="navbar navbar-expand-sm px-5 shadow py-2" style={{backgroundColor: '#1e3c72',}}>
						<div className="collapse navbar-collapse" id="collapsibleNavId">
							<ul className="navbar-nav ms-auto mt-2 mt-lg-0">
								<li className="nav-item dropdown">
									<span className="text-white text-capitalize">{userProfile ? userProfile.role : ''}</span>
								</li>
							</ul>
						</div>
					</nav>

					<main className="p-4">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
}
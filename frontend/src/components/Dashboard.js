import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import './Dashboard.css';
import 'bootstrap/js/dist/dropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { subDays, setHours, setMinutes, format } from 'date-fns';

export default function Dashboard() {

	const location = useLocation();
	const { logout, user, getAllNotifications, notify, userNotifications } = useContext(AuthContext);
	const handleLogout = () => logout();

	const [userProfile, setUserProfile] = useState(null);

	useEffect(() => {
		if(user) {
			setUserProfile(user);
		}
	}, [user]);

	useEffect(() => {
        getNotificationDetails();
    }, [location]);

    const getNotificationDetails = () => {
    	getAllNotifications();
    	notify();
    }

	return (
		<div className="wrapper bg-light min-vh-100">
			<div className="row">
				<div className="col-2 bg-white">
					<Sidebar HandleLogout={handleLogout} UserEmail={userProfile && userProfile.email} />
				</div>

				<div className="col p-0">
					<nav className="navbar navbar-expand-sm px-4 shadow py-2" style={{backgroundColor: '#1e3c72',}}>
						<div className="collapse navbar-collapse my-1" id="collapsibleNavId">
							<ul className="navbar-nav ms-auto mt-2 mt-lg-0 ">
								<li className="nav-item dropdown">
									<span className="text-white text-capitalize">{userProfile ? userProfile.role : ''}</span>

									<button type="button" class="btn btn-small btn-secondary ms-3 position-relative" onClick={getNotificationDetails}>
										Notifications
										<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{userNotifications.length}<span class="visually-hidden">unread notifications</span></span>
									</button>

								</li>
							</ul>
						</div>
					</nav>

					<main className="p-4">
						<Outlet />
					</main>
				</div>
			</div>

			<ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                autoClose={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
		</div>
	);
}
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext  } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Leads from './pages/Leads';
import Lead from './pages/Lead';
import FollowUps from './pages/FollowUps';
import FollowUp from './pages/FollowUp';
import FollowUpUpdate from './pages/FollowUpUpdate';
import 'react-toastify/dist/ReactToastify.css';
import { subDays, setHours, setMinutes, format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';

function App() {
        
    const { userToken, user, getAllNotifications, notify} = useContext(AuthContext);

    useEffect(() => {
        getAllNotifications();
        notify();
    }, []);

    return (
        <>
        <Routes>
            {userToken ? (
                <>
                    <Route element={<Dashboard />}>
                        <Route path="/leads" element={<Leads />} />
                        <Route path="/leads/create" element={<Lead />} />
                            
                        <Route path="/follow-ups">
                            <Route index element={<FollowUps />} />
                            <Route path=":id/update" element={<FollowUpUpdate />} />
                            <Route path="create" element={<FollowUp />} />
                        </Route>

                        {/* Redirect any unauthorized access to login */}
                        <Route path="*" element={<Navigate to="/leads" replace />} />
                    </Route>
                </>
            ) : (
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </>
            )}
        </Routes>

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
        </>
    );
}
export default App;
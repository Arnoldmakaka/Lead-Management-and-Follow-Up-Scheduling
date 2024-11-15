import React, { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { subDays, setHours, setMinutes, format } from 'date-fns';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
        
    const toastId = useRef(null);

    const [user, setUser] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allLeads, setAllLeads] = useState([]);
    const [allFollowUps, setAllFollowUps] = useState([]);
    const [activeFollowUp, setActiveFollowUp] = useState(null);
    const [userNotifications, setUserNotifications] = useState([]);
    const [failedFetchingNotification, setFailedFetchingNotification] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        notify();
    }, [userNotifications]);

    // Check for token and user data on first render
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setUserToken(token);
            getAllNotifications();
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setUserToken(null);
        }
        setLoading(false);
    }, []);

    const getAllNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            if(response.data.data) {
                setUserNotifications(response.data.data.notifications);
            }
        }catch (error) {
            console.log('Failed to fetch the notifications');
        } finally {
            setFailedFetchingNotification(true);
        }
    }

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setUserToken(token);
        navigate('/leads', { replace: true });
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setUserToken(null);
        navigate('/login', { replace: true });
    }

    const getAllLeads = async (leads) => {
        if(leads) {
            setAllLeads(leads);
        } else {
            const response = await api.get('/leads');
            if(response.data.status == 'success') {
                setAllLeads(response.data.data.leads);
            }
        }
    }

    const getAllFollowups = async (followups) => {
        if(followups) {
            setAllFollowUps(followups);
        } else {
            const response = await api.get('/followups');
            if(response.data.status == 'success') {
                setAllFollowUps(response.data.data.followups);
            }
        }
    }

    const markAllNotificationsAsRead = async () => {
        try {
            const response = await api.post('/notifications/read');
        }catch (error) {
            console.log(error)
        } finally {
            setFailedFetchingNotification(true);
        }
    }

    const markCustomNotificationsAsRead = async (notification) => {
        try {
            const response = await api.post(`/notifications/${notification}/read`);
        }catch (error) {
            console.log(error)
        } finally {
            setFailedFetchingNotification(true);
        }
    }

    const setActiveFollowUpDetails = (followup) => setActiveFollowUp(followup);

    const notify = () => {
        userNotifications.map((notification) => (
            toast.error(<CustomMessage Details={notification} />, {
                toastId: notification.id,
                onClose: () => closeCurrentNotification(notification)
            })
        ));   
    }
    const CustomMessage = ({ closeToast, toastProps, Details }) => (
        <div>{`Follow up scheduled at ${format(Details.data.scheduled_at, "MMMM dd/yyyy hh:mm aa")} is overdue and has been makered as "Missed"`}</div>
    );
    const closeCurrentNotification = async (notification) => {
        try {
            await markCustomNotificationsAsRead(notification.id);
            setUserNotifications((prev) => prev.filter((n) => n.id !== notification.id));
            await getAllNotifications();
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, userToken, login, logout, getAllLeads, allLeads, setActiveFollowUpDetails, activeFollowUp, getAllFollowups, allFollowUps, getAllNotifications, notify, userNotifications}}>
            {/* Render children only when loading is false */}
            {!loading && children}
        </AuthContext.Provider>
    );
}
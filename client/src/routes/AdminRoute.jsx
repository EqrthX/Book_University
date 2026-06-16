import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <span className="loading loading-spinner loading-lg text-[#2E3192]"></span>
            </div>
        );
    }

    const userRole = user?.role || user?.user_role;

    if (!user || userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;

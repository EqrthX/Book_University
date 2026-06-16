import { Outlet } from 'react-router-dom';
import Head from '../user/Head.jsx';
import Navbar from '../user/Navbar.jsx';

const UserLayout = () => {
    return (
        <div className="bg-[#F5F5F5] min-h-screen">
            {/* Sticky Header Wrapper */}
            <div className="fixed top-0 left-0 w-full z-50 flex flex-col shadow-md">
                <Head />
                <Navbar />
            </div>

            {/* Main Page Content */}
            <div className="pt-40">
                <Outlet />
            </div>
        </div>
    );
};

export default UserLayout;

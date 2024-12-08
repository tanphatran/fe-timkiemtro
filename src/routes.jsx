import React from 'react';
import pathnames from './lib/pathnames';
import Layout from './pages/publics/Layout';
import Home from './pages/publics/Home';
import App from './App';
import Search from './pages/publics/Search';
import RoomDetail from './pages/publics/RoomDetail';
import Post from './pages/users/Post';
import ProfilePage from './pages/users/ProfilePage';
import LayoutAdmin from './components/Admin/Layout/LayoutAdmin';
import Dashboard from './pages/admin/Dashboard';
import HostManagement from './pages/admin/HostManagement';
import PostManagement from './pages/users/PostManagement';
import FavoritePosts from './pages/users/FavoritePosts';
import VerificationSteps from './pages/users/VerificationSteps';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import UserManagement from './pages/admin/UserManagement';

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: pathnames.publics.layout,
                element: <Layout />,
                children: [
                    { path: pathnames.publics.home, element: <Home /> },
                    { path: pathnames.publics.search, element: <Search /> },
                    { path: pathnames.publics.roomdetail_id, element: <RoomDetail /> },
                    {
                        path: pathnames.users.layout,
                        element: <ProfilePage />,
                        children: [
                            {
                                path: pathnames.users.postmana,
                                element: <PostManagement />,
                            },
                            {
                                path: pathnames.users.createposts,
                                element: <Post />,
                            },
                            {
                                path: pathnames.users.favoriteposts,
                                element: <FavoritePosts />,
                            },
                            {
                                path: pathnames.users.verification,
                                element: <VerificationSteps />,
                            },

                        ]
                    },
                ],
            },

            {
                path: pathnames.admin.layout,
                element: <LayoutAdmin />,
                children: [
                    {
                        path: pathnames.admin.dashboard,
                        element: <Dashboard />,
                    },
                    {
                        path: pathnames.admin.hostmanagenment,
                        element: <HostManagement />,
                    },
                    {
                        path: pathnames.admin.employeemana,
                        element: <EmployeeManagement />,
                    },
                    {
                        path: pathnames.admin.usermana,
                        element: <UserManagement />,
                    },
                ]
            }
        ]
    }
];

export default routes;

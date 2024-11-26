import React, { Children } from 'react'
import pathnames from './lib/pathnames'
import Layout from './pages/publics/Layout'
import Home from './pages/publics/Home'
import App from './App'
import Search from './pages/publics/Search'
import RoomDetail from './pages/publics/RoomDetail'
import Post from './pages/users/Post'

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: pathnames.publics.layout,
                element: <Layout />,
                children: [
                    {
                        path: pathnames.publics.home,
                        element: <Home />,
                    },
                    {
                        path: pathnames.publics.search,
                        element: <Search />,
                    },
                    {
                        path: pathnames.publics.roomdetail_id,
                        element: <RoomDetail />,
                    },
                    {
                        path: pathnames.publics.post,
                        element: <Post />,
                    }
                ]
            }
        ]
    }
]

export default routes
import React from 'react'
import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from 'react-router-dom';
import Footer from "../../components/Footer/Footer";
import { Toaster } from "@/components/ui/toaster";

const Layout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Toaster />

            <Footer />
        </>
    )
}

export default Layout;
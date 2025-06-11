import React from 'react'
import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from 'react-router-dom';
import Footer from "../../components/Footer/Footer";
import { Toaster } from "@/components/ui/toaster";
import Chatbot from '@/components/Chatbot';

const Layout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Toaster />
            <Chatbot />

            <Footer />
        </>
    )
}

export default Layout;
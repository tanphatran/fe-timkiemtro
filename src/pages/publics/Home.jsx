import React from 'react'
import NatureVid from "../../assets/video/main.mp4";
import Hero from "../../components/Hero/Hero";
import Rooms from '../../components/Rooms/Rooms';
import PopularAreas from '@/components/PopularAreas';
import AboutUs from '@/components/AboutUs';


const Home = () => {
    return (
        <div>
            <div className="h-[700px] relative">
                <video
                    autoPlay
                    loop
                    muted
                    className="absolute right-0 top-0 h-[700px] w-full object-cover z-[-1]"
                >
                    <source src={NatureVid} type="video/mp4" />
                </video>
                <Hero />
            </div>
            {/* <Rooms /> */}
            <PopularAreas />
            <AboutUs />
        </div>
    )
}

export default Home
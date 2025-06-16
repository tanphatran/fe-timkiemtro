import React from "react";
import { Card } from "@/components/ui/card";
import logo from "../assets/logo.png";

const AboutUs = () => {
    return (
        <div className=" mx-auto mt-2 mb-16 p-6">
            <div className="flex items-center mb-8">
                <div className="border-l-4 border-primary pl-3 text-xl font-bold mr-4">
                    Về chúng tôi
                </div>
            </div>
            <div className="max-w-6xl mx-auto flex flex-col gap-16">
                {/* Section 1 */}
                <div className="flex flex-col md:flex-row items-center gap-10 relative">
                    <Card className="flex-1 p-8 shadow-xl bg-white rounded-2xl z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={logo} alt="Trọ Tốt" className="h-14 w-auto" />
                            <span className="text-3xl font-bold text-primary">Trọ Tốt</span>
                        </div>
                        <p className="text-gray-700 text-lg mt-2 leading-relaxed">
                            <span className="font-bold text-primary">Trọ Tốt</span> là nền tảng kết nối người thuê và chủ trọ uy tín, cung cấp thông tin phòng trọ minh bạch, giá tốt, hỗ trợ tìm kiếm nhanh chóng và an toàn. Chúng tôi cam kết đồng hành cùng bạn trên hành trình tìm kiếm chốn an cư lý tưởng.
                        </p>
                    </Card>
                    <div className="flex-1 flex justify-center items-center relative">
                        <div className="absolute -left-6 -top-6 w-full h-full border-2 border-primary rounded-2xl opacity-20 z-0 hidden md:block"></div>
                        <Card className="overflow-hidden shadow-xl bg-white rounded-2xl w-full h-80 flex items-center justify-center z-10">
                            <img
                                src="https://www.conicaltravel.com/wp-content/uploads/2020/04/Ho-Chi-Minh-City-Travel-Guide.jpg"
                                alt="Phòng trọ đẹp"
                                className="w-full h-full object-cover"
                            />
                        </Card>
                    </div>
                </div>
                {/* Section 2 */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 relative">
                    <Card className="flex-1 p-8 shadow-xl bg-white rounded-2xl z-10">
                        <h3 className="text-2xl font-semibold text-primary mb-3">Cam kết dịch vụ</h3>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Trọ Tốt luôn đặt sự hài lòng và an toàn của khách hàng lên hàng đầu. Đội ngũ hỗ trợ tận tâm, thông tin xác thực, đa dạng lựa chọn phòng trọ, đáp ứng mọi nhu cầu từ cá nhân đến gia đình, sinh viên, người đi làm. Hãy để chúng tôi giúp bạn an tâm tìm nơi ở phù hợp nhất!
                        </p>
                    </Card>
                    <div className="flex-1 flex justify-center items-center relative">
                        <div className="absolute -right-6 -top-6 w-full h-full border-2 border-primary rounded-2xl opacity-20 z-0 hidden md:block"></div>
                        <Card className="overflow-hidden shadow-xl bg-white rounded-2xl w-full h-80 flex items-center justify-center z-10">
                            <img
                                src="https://kenh14cdn.com/2016/13-1452828317082.jpg"
                                alt="Bản đồ phòng trọ"
                                className="w-full h-full object-cover"
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs; 
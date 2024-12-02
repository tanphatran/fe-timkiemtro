import React from "react";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiChat, BiTimeFive } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";


const ProfilePage = () => {
    return (
        <div className="mt-8 container mx-auto py-8 px-4 sm:px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1">
                    <Card className="p-1">
                        <CardHeader className="flex flex-col items-center">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src="https://via.placeholder.com/150" alt="Avatar" />
                                <AvatarFallback>TP</AvatarFallback>
                            </Avatar>
                            <CardTitle className="mt-4 text-center text-xl font-bold">
                                Tấn Phát Trần
                            </CardTitle>
                            <p className="text-gray-500 text-sm text-center">Chưa có đánh giá</p>
                        </CardHeader>

                        <CardContent>
                            <Button variant="secondary" className="w-full bg-primary text-white hover:text-black ">
                                Chỉnh sửa trang cá nhân
                            </Button>
                            <Button variant="outline" className="w-full mt-2">
                                Chia sẻ trang của bạn
                            </Button>
                        </CardContent>
                        <CardContent >

                            <p className="flex items-center text-sm text-gray-600">
                                <BiTimeFive className="mr-2 text-base align-middle" />
                                Đã tham gia: <span className="ml-1 font-bold">1 năm 3 tháng</span>
                            </p>
                            <p className="flex items-center text-sm text-gray-600">
                                <AiOutlineCheckCircle className="mr-2 text-base text-green-500 align-middle" />
                                Đã xác thực: <span className="ml-1">Google</span>
                            </p>
                            <p className="flex items-center text-sm text-gray-600">
                                <HiOutlineLocationMarker className="mr-2 text-base align-middle" />
                                Địa chỉ: Chưa cung cấp
                            </p>
                        </CardContent>

                    </Card>
                </div>


                {/* Nội dung tin đăng */}
                <div className="lg:col-span-3">
                    <Tabs defaultValue="active" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="active">Đang hiển thị (0)</TabsTrigger>
                            <TabsTrigger value="pending">Đang chờ duyệt (0)</TabsTrigger>
                            <TabsTrigger value="report">Bị báo cáo (0)</TabsTrigger>

                        </TabsList>
                        <TabsContent value="active">
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-lg">Bạn chưa có tin đăng nào</p>
                                <Button variant="default" className="mt-4 bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white"
                                >Đăng tin ngay</Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="pending">
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-lg">Chưa có tin nào đang chờ duyệt</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="report">
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-lg">Chưa có tin nào bị báo cáo</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>


        </div>
    );
};

export default ProfilePage;

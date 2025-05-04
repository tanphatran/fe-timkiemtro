import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { postPackages } from "@/lib/constants";

export default function PostPackage() {
    const [selectedIndex, setSelectedIndex] = useState(1); // mặc định chọn gói thứ 2

    return (
        <div className="py-10 px-4 max-w-6xl mx-auto text-center mt-14">
            <h2 className="text-3xl font-bold mb-6">Chọn gói đăng bài phù hợp với bạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {postPackages.map((pkg, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                        <Card
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative border-2 rounded-2xl cursor-pointer transition-all duration-300 
                                ${isSelected
                                    ? "border-primary shadow-lg bg-primary/10"
                                    : "border-gray-200"
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute top-0 right-2 bg-primary text-white text-xs px-2 py-1 rounded-bl-md font-semibold">
                                    Đang chọn
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl">{pkg.title}</CardTitle>
                                <div className="text-3xl font-bold text-primary mt-2">
                                    {pkg.price}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-left mb-4 space-y-2">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-green-500 mr-2">✔</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={`w-full text-white transition-all duration-300 
                                        ${isSelected
                                            ? "bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary"
                                            : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                >
                                    {isSelected ? "Mua ngay" : "Chọn gói"}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AREAS = [
    {
        name: "TP. Hồ Chí Minh",
        image: "https://www.uncovervietnam.com/wp-content/uploads/2020/08/Landmark-81-HCMC.jpg",
        city: "Hồ Chí Minh",
        district: "Bình Thạnh"
    },
    {
        name: "TP. Hồ Chí Minh",
        image: "https://th.bing.com/th/id/R.15215fd251fcac52fde0145bc6885cc8?rik=B%2fZx78LjN4HHUw&riu=http%3a%2f%2fbitexco.com.vn%2fwp-content%2fuploads%2f2019%2f01%2fbft.jpg&ehk=vPKRefwdSdbbQGylUVeVxcOus1JRrj6TqWaqS0AcHKk%3d&risl=&pid=ImgRaw&r=0",
        city: "Hồ Chí Minh",
        district: "Quận 1"
    },
    {
        name: "Thành Phố Đà Nẵng",
        image: "https://img.thuthuatphanmem.vn/uploads/2018/10/26/anh-dep-cau-rong-da-nang-viet-nam_055418962.jpg",
        city: "Đà Nẵng",
        district: ""
    },
    {
        name: "Hà Nội",
        image: "https://www.travelassociates.com/sites/v2.travel-associates.com.au/files/fcl-blog/hanoi-hoankiem.jpg",
        city: "Hà Nội",
        district: "Hoàn Kiếm"
    },
    {
        name: "Hà Nội",
        image: "https://www.govietnam.tours/wp-content/uploads/2019/08/Ho-Chi-Minh-Mausoleum-Tour-in-Hanoi.jpg",
        city: "Hà Nội",
        district: "Ba Đình"
    },
    {
        name: "TP. Hồ Chí Minh",
        image: "https://image.vietnamnews.vn/uploadvnnews/Article/2022/1/3/193857_thuduc.jpg",
        city: "Hồ Chí Minh",
        district: "Thủ Đức"
    },
    {
        name: "TP. Hồ Chí Minh",
        image: "https://th.bing.com/th/id/R.f02934daf0951c43e6863cc23c62be32?rik=WEL4znElb%2fqcBw&riu=http%3a%2f%2fhomeless.vn%2fstatic%2fuploads%2fckeditor%2fimages%2fquan-go-vap-2.jpg&ehk=HDpSFZU9wvZLI01Brn0HRr9vC7c74s4oZMZl7OQVWdU%3d&risl=&pid=ImgRaw&r=0",
        city: "Hồ Chí Minh",
        district: "Gò Vấp"
    },
    {
        name: "Hà Nội",
        image: "https://maisonoffice.vn/wp-content/uploads/2023/12/9-cong-vien-cau-giay.jpg",
        city: "Hà Nội",
        district: "Cầu Giấy"
    },
];

const CARDS_PER_VIEW = 4;

const PopularAreas = () => {
    const [start, setStart] = useState(0);
    const navigate = useNavigate();

    const maxStart = Math.max(0, AREAS.length - CARDS_PER_VIEW);

    const handlePrev = () => {
        setStart((prev) => Math.max(prev - CARDS_PER_VIEW, 0));
    };
    const handleNext = () => {
        setStart((prev) => Math.min(prev + CARDS_PER_VIEW, maxStart));
    };

    const handleAreaClick = (area) => {
        const params = new URLSearchParams();
        if (area.city) {
            params.append("city", area.city);
        }
        if (area.district) {
            params.append("district", area.district);
        }
        navigate(`/results?${params.toString()}`);
    };

    return (
        <div className="bg-muted rounded-2xl p-10 mt-0">
            <div className="flex items-center mb-8 justify-between">
                <div className="border-l-4 border-primary pl-3 text-xl font-bold mr-4">                    Khu vực phòng trọ phổ biến
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrev}
                        disabled={start === 0}
                        className="rounded-full shadow-md bg-white border border-gray-200 hover:bg-primary/10 transition"
                    >
                        <ChevronLeft size={32} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        disabled={start >= maxStart}
                        className="rounded-full shadow-md bg-white border border-gray-200 hover:bg-primary/10 transition"
                    >
                        <ChevronRight size={32} />
                    </Button>
                </div>
            </div>
            <div className="flex gap-10 flex-1 justify-center">
                {AREAS.slice(start, start + CARDS_PER_VIEW).map((area) => (
                    <div
                        key={area.name + area.district}
                        className="relative group w-[340px] h-[340px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-300 bg-white"
                        onClick={() => handleAreaClick(area)}
                    >
                        <img
                            src={area.image}
                            alt={area.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 z-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                            <div className="text-2xl font-bold text-white drop-shadow-lg mb-1">
                                <span>{area.district ? area.district : area.city}</span>
                            </div>
                            <div className="text-lg text-white/90 font-medium drop-shadow">
                                {area.name}
                            </div>
                            <div className="mt-2">
                                <span className="inline-block bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                    Phòng trọ đa dạng, giá tốt
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularAreas; 
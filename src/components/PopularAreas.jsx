import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AREAS = [
    {
        name: "Bình Thạnh - TP. Hồ Chí Minh",
        image: "https://www.uncovervietnam.com/wp-content/uploads/2020/08/Landmark-81-HCMC.jpg",
    },
    {
        name: "Quận 1 - TP. Hồ Chí Minh",
        image: "https://th.bing.com/th/id/R.15215fd251fcac52fde0145bc6885cc8?rik=B%2fZx78LjN4HHUw&riu=http%3a%2f%2fbitexco.com.vn%2fwp-content%2fuploads%2f2019%2f01%2fbft.jpg&ehk=vPKRefwdSdbbQGylUVeVxcOus1JRrj6TqWaqS0AcHKk%3d&risl=&pid=ImgRaw&r=0",
    },
    {
        name: "Thành Phố Đà Nẵng",
        image: "https://img.thuthuatphanmem.vn/uploads/2018/10/26/anh-dep-cau-rong-da-nang-viet-nam_055418962.jpg",
    },
    {
        name: "Hoàn Kiếm - Hà Nội",
        image: "https://www.travelassociates.com/sites/v2.travel-associates.com.au/files/fcl-blog/hanoi-hoankiem.jpg",
    },
    {
        name: "Ba Đình - Hà Nội",
        image: "https://www.govietnam.tours/wp-content/uploads/2019/08/Ho-Chi-Minh-Mausoleum-Tour-in-Hanoi.jpg",
    },
    {
        name: "Thủ Đức - TP. Hồ Chí Minh",
        image: "https://image.vietnamnews.vn/uploadvnnews/Article/2022/1/3/193857_thuduc.jpg",
    },
    {
        name: "Gò Vấp - TP. Hồ Chí Minh",
        image: "https://th.bing.com/th/id/R.f02934daf0951c43e6863cc23c62be32?rik=WEL4znElb%2fqcBw&riu=http%3a%2f%2fhomeless.vn%2fstatic%2fuploads%2fckeditor%2fimages%2fquan-go-vap-2.jpg&ehk=HDpSFZU9wvZLI01Brn0HRr9vC7c74s4oZMZl7OQVWdU%3d&risl=&pid=ImgRaw&r=0",
    },


];

const CARDS_PER_VIEW = 4;

const PopularAreas = () => {
    const [start, setStart] = useState(0);

    const handlePrev = () => {
        setStart((prev) => Math.max(prev - CARDS_PER_VIEW, 0));
    };
    const handleNext = () => {
        setStart((prev) =>
            Math.min(prev + CARDS_PER_VIEW, AREAS.length - CARDS_PER_VIEW)
        );
    };

    return (
        <div className="bg-muted rounded-xl p-6 mt-8">
            <div className="flex items-center mb-4">
                <div className="border-l-4 border-primary pl-3 text-xl font-bold mr-4">
                    Khu vực phòng trọ phổ biến
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrev}
                    disabled={start === 0}
                    className="rounded-full shadow-md bg-white"
                >
                    <ChevronLeft />
                </Button>
                <div className="flex gap-8 flex-1 justify-center">
                    {AREAS.slice(start, start + CARDS_PER_VIEW).map((area) => (
                        <Card
                            key={area.name}
                            className="w-80 min-w-[280px] max-w-[320px] shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer"
                        >
                            <img
                                src={area.image}
                                alt={area.name}
                                className="h-44 w-full object-cover rounded-t-xl"
                            />
                            <CardContent className="p-4 pb-3">
                                <CardTitle className="text-base font-bold mb-1">
                                    {area.name}
                                </CardTitle>
                                <p className="text-sm text-gray-700">Phòng trọ đa dạng, giá tốt</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    disabled={start + CARDS_PER_VIEW >= AREAS.length}
                    className="rounded-full shadow-md bg-white"
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    );
};

export default PopularAreas; 
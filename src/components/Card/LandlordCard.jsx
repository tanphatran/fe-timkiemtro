import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FaRegCalendarAlt, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LandlordCard = ({ userUuid, fullName, phoneNumber, profilePicture, createdAt }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/landlord/${userUuid}`); // Chuyển hướng đến trang cá nhân của chủ nhà
    };

    return (
        <Card className="flex items-center p-4 space-x-4 cursor-pointer hover:bg-gray-100 transition"
            onClick={handleClick}
        >
            {/* Avatar */}
            <Avatar className="w-14 h-14">
                {profilePicture ? <AvatarImage src={profilePicture} alt={fullName} /> : <AvatarFallback>{fullName[0]}</AvatarFallback>}
            </Avatar>

            {/* Thông tin chính */}
            <CardContent className="flex flex-1 flex-col space-y-1 p-0">
                <h3 className="font-semibold text-lg">{fullName}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaRegCalendarAlt className="text-primary" />
                    Đã tham gia: {format(new Date(createdAt), "dd/MM/yyyy")}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaPhone className="text-primary" />
                    {phoneNumber}
                </p>
            </CardContent>

            {/* Huy hiệu xác minh */}
            <Badge variant="outline" className="text-sm">
                Đã xác thực
            </Badge>
        </Card>
    );
};

export default LandlordCard;

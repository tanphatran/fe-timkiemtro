import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FaRegCalendarAlt, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LandlordCard = ({ userUuid, fullName, phoneNumber, profilePicture, createdAt, isFollowing, onToggleFollow }) => {
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        // Tránh sự kiện từ nút theo dõi bị lan ra card
        if (e.target.closest("button")) return;
        navigate(`/landlord/${userUuid}`);
    };

    return (
        <Card
            className="flex items-center p-4 space-x-4 cursor-pointer hover:bg-gray-100 transition justify-between"
            onClick={handleCardClick}
        >
            <div className="flex items-center space-x-4">
                <Avatar className="w-14 h-14">
                    {profilePicture ? <AvatarImage src={profilePicture} alt={fullName} /> : <AvatarFallback>{fullName[0]}</AvatarFallback>}
                </Avatar>

                <CardContent className="flex flex-col space-y-1 p-0">
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
            </div>

            <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                <Badge variant="secondary">Đã xác thực</Badge>
                <Badge
                    className={`text-white font-semibold px-3 py-1 rounded-full transition-all hover:scale-105 cursor-pointer
        ${isFollowing
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-l"
                        }`
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFollow();
                    }}
                >
                    {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                </Badge>

            </div>

        </Card>
    );
};


export default LandlordCard;

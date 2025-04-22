import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa"; // Import thêm icon
import { format } from "date-fns";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";

const LandlordInfo = ({ landlord, isFollowing, handleFollowToggle }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    {landlord.profilePicture ? (
                        <AvatarImage src={landlord.profilePicture} alt={landlord.fullName} />
                    ) : (
                        <AvatarFallback className="text-2xl font-bold">
                            {landlord.fullName[0]}
                        </AvatarFallback>
                    )}
                </Avatar>

                <div className="mt-4">
                    <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                        {landlord.fullName}
                        {landlord.isLandlordActivated === "APPROVED" && (
                            <FaCheckCircle className="text-green-500" />
                        )}
                    </h2>
                    <p className="text-gray-500">{landlord.address}</p>
                    <p className="text-sm text-gray-500">
                        Đã tham gia: {format(new Date(landlord.createdAt), "dd/MM/yyyy")}
                    </p>
                </div>

                {/* Nút Theo dõi */}
                <button
                    onClick={handleFollowToggle}
                    className={`mt-4 px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-all duration-200
        ${isFollowing
                            ? "bg-gradient-to-r from-red-400 to-red-600 text-white hover:scale-105"
                            : "bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-l  transition-all text-white hover:scale-105"
                        }`}
                >
                    {isFollowing ? (
                        <>
                            <FaUserMinus />
                            Bỏ theo dõi
                        </>
                    ) : (
                        <>
                            <FaUserPlus />
                            Theo dõi
                        </>
                    )}
                </button>
            </div>

            {/* Thông tin xác nhận */}
            <div className="bg-white shadow-md rounded-2xl p-5 border">
                <h3 className="text-lg font-semibold mb-3">Thông tin đã được xác nhận</h3>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                        <FaRegCheckCircle className="text-green-500" />
                        Danh tính
                    </li>
                    <li className="flex items-center gap-2">
                        <FaRegCheckCircle className="text-green-500" />
                        Địa chỉ email
                    </li>
                    <li className="flex items-center gap-2">
                        <FaRegCheckCircle className="text-green-500" />
                        Số điện thoại
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default LandlordInfo;

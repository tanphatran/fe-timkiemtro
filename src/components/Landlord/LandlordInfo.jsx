import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa"; // Import thêm icon
import { format } from "date-fns";

const LandlordInfo = ({ landlord }) => {
    return (
        <div className="space-y-6"> {/* Tạo khoảng cách giữa các phần */}
            {/* Hồ sơ chủ nhà */}
            <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center text-center">
                {/* Avatar */}
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    {landlord.profilePicture ? (
                        <AvatarImage src={landlord.profilePicture} alt={landlord.fullName} />
                    ) : (
                        <AvatarFallback className="text-2xl font-bold">
                            {landlord.fullName[0]}
                        </AvatarFallback>
                    )}
                </Avatar>

                {/* Thông tin chủ nhà */}
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

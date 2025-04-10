import axiosClient from "@/apis/axiosClient";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import LandlordCard from "@/components/Card/LandlordCard";
import { useEffect, useState } from "react";

const LandlordList = () => {
    const [landlords, setLandlords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Giao diện hiển thị bắt đầu từ 1
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchLandlords = async () => {
            setLoading(true);
            try {
                // Truyền page - 1 vì API bắt đầu từ 0
                const result = await axiosClient.getMany("/user/landlords", { page: page - 1, size: 5 });
                console.log("API:", result);

                if (result.status === "success") {
                    setLandlords(result.data.content);
                    setTotalPages(result.data.totalPages);
                } else {
                    throw new Error(result.message || "Lỗi khi tải dữ liệu");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLandlords();
    }, [page]); // Gọi API khi page thay đổi

    if (loading) return <p className="text-center">Đang tải...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mt-14 mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold">Danh sách chủ trọ</h2>

            {landlords.map((landlord) => (
                <LandlordCard key={landlord.userUuid} {...landlord} />
            ))}

            {/* Phân trang */}
            <div className="flex justify-center mt-4">
                <PaginationAdmin total={totalPages} page={page} onChange={setPage} />
            </div>
        </div>
    );
};

export default LandlordList;

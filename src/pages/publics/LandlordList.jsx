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
                const result = await axiosClient.getMany("/user/landlords", {
                    page: page - 1,
                    size: 5,
                });

                if (result.status === "success") {
                    const fetched = result.data.content;

                    // Gọi API lấy trạng thái theo dõi cho từng landlord
                    const landlordsWithFollow = await Promise.all(
                        fetched.map(async (landlord) => {
                            try {
                                const followRes = await axiosClient.getOne(
                                    `/users/${landlord.userUuid}/is-following`
                                );
                                return {
                                    ...landlord,
                                    isFollowing: followRes.data,
                                };
                            } catch {
                                return { ...landlord, isFollowing: false };
                            }
                        })
                    );

                    setLandlords(landlordsWithFollow);
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
    }, [page]);


    if (loading) return <p className="text-center">Đang tải...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mt-14 mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold">Danh sách chủ trọ</h2>

            {landlords.map((landlord, index) => (
                <LandlordCard
                    key={landlord.userUuid}
                    {...landlord}
                    onToggleFollow={async () => {
                        try {
                            const id = landlord.userUuid;
                            if (landlord.isFollowing) {
                                await axiosClient.delete(`/users/${id}/unfollow`);
                            } else {
                                await axiosClient.post(`/users/${id}/follow`);
                            }

                            // Cập nhật lại state sau khi theo dõi
                            setLandlords((prev) =>
                                prev.map((item, i) =>
                                    i === index ? { ...item, isFollowing: !item.isFollowing } : item
                                )
                            );
                        } catch (err) {
                            console.error("Lỗi theo dõi:", err);
                        }
                    }}
                />
            ))}

            {/* Phân trang */}
            <div className="flex justify-center mt-4">
                <PaginationAdmin total={totalPages} page={page} onChange={setPage} />
            </div>
        </div>
    );
};

export default LandlordList;

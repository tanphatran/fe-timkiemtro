import React from "react";

const DepositTerms = () => (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-10">
        <h1 className="text-2xl font-bold mb-4 text-center text-primary">ĐIỀU KHOẢN ĐẶT CỌC GIỮ PHÒNG TRỌ TRÊN WEBSITE NHATOT</h1>
        <p className="mb-4 text-sm text-gray-600 text-center">Áp dụng cho các giao dịch đặt cọc trực tuyến thông qua hệ thống của chúng tôi.</p>
        <ol className="list-decimal pl-5 space-y-3 text-base text-gray-800">
            <li>
                <b>Giới thiệu chung</b><br />
                Website cung cấp nền tảng trung gian kết nối giữa người thuê và người cho thuê phòng trọ, đồng thời hỗ trợ chức năng đặt cọc giữ chỗ. Các điều khoản dưới đây quy định trách nhiệm, quyền lợi và nghĩa vụ của các bên liên quan trong quá trình đặt cọc online.
            </li>
            <li>
                <b>Quy định về đặt cọc</b>
                <ul className="list-disc pl-5">
                    <li>Người thuê có thể chọn đặt cọc để giữ chỗ một phòng cụ thể.</li>
                    <li>Số tiền đặt cọc sẽ được hiển thị rõ trên trang chi tiết phòng.</li>
                </ul>
            </li>
            <li>
                <b>Phương thức thanh toán</b>
                <ul className="list-disc pl-5">
                    <li>Người thuê có thể thanh toán tiền đặt cọc thông qua các cổng thanh toán tích hợp.</li>
                    <li>Giao dịch chỉ được xác nhận khi hệ thống nhận được thông báo thanh toán thành công từ cổng thanh toán.</li>
                </ul>
            </li>
            <li>
                <b>Trách nhiệm của người thuê</b>
                <ul className="list-disc pl-5">
                    <li>Cung cấp đầy đủ và chính xác thông tin cá nhân.</li>
                    <li>Đến xem phòng và ký hợp đồng.</li>
                    <li>Trong trường hợp không đến xem phòng hoặc không có lý do chính đáng, tiền cọc có thể không được hoàn lại.</li>
                </ul>
            </li>
            <li>
                <b>Trách nhiệm của người cho thuê</b>
                <ul className="list-disc pl-5">
                    <li>Cập nhật thông tin phòng đầy đủ, trung thực.</li>
                    <li>Đảm bảo phòng còn trống tại thời điểm người thuê đến xem.</li>
                    <li>Không được tự ý hủy cho thuê sau khi người thuê đã đặt cọc, trừ trường hợp bất khả kháng (cần có bằng chứng ảnh và video).</li>
                </ul>
            </li>
            <li>
                <b>Chính sách hoàn/hủy cọc</b>
                <ul className="list-disc pl-5">
                    <li><b>a. Người thuê yêu cầu hủy:</b>
                        <ul className="list-[circle] pl-5">
                            <li>Được hoàn cọc 100% nếu phòng không đúng mô tả hoặc có lỗi nghiêm trọng từ phía người cho thuê. <b>Bắt buộc phải chụp ảnh và quay video để làm minh chứng nếu không sẽ không được hoàn cọc.</b></li>
                            <li>Không được hoàn cọc nếu hủy không có lý do chính đáng, không đến xem phòng hoặc thay đổi ý định.</li>
                        </ul>
                    </li>
                    <li><b>b. Người cho thuê hủy:</b>
                        <ul className="list-[circle] pl-5">
                            <li>Phải hoàn trả 100% tiền cọc cho người thuê.</li>
                            <li>Có thể bị áp dụng hình phạt tùy theo mức độ vi phạm (khóa tài khoản tạm thời).</li>
                        </ul>
                    </li>
                    <li><b>c. Không có xác nhận từ cả hai bên:</b>
                        <ul className="list-[circle] pl-5">
                            <li>Hệ thống sẽ liên lạc với cả 2 bên để xác nhận thông tin.</li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li>
                <b>Biên nhận và xác nhận giao dịch</b>
                <ul className="list-disc pl-5">
                    <li>Sau khi thanh toán thành công, hệ thống sẽ gửi biên bản đặt cọc điện tử qua email cho cả hai bên.</li>
                    <li>Biên bản bao gồm đầy đủ thông tin cá nhân, phòng trọ, số tiền đặt cọc, và điều khoản hoàn/hủy.</li>
                </ul>
            </li>
            <li>
                <b>Giải quyết tranh chấp</b>
                <ul className="list-disc pl-5">
                    <li>Mọi khiếu nại cần được gửi qua kênh hỗ trợ chính thức hoặc thực hiện khiếu nại trên web: [Email/Số điện thoại].</li>
                    <li>Người dùng cần cung cấp bằng chứng xác thực (ảnh, video).</li>
                    <li>Website là bên trung gian và đưa ra quyết định cuối cùng dựa trên bằng chứng và chính sách công khai.</li>
                </ul>
            </li>
            <li>
                <b>Cam kết</b><br />
                Khi nhấn nút "Tôi đồng ý với điều khoản đặt cọc", người thuê đồng ý rằng:
                <ul className="list-disc pl-5">
                    <li>Đã đọc và hiểu toàn bộ điều khoản.</li>
                    <li>Chấp nhận các chính sách về hoàn/hủy cọc và xử lý tranh chấp.</li>
                </ul>
            </li>
        </ol>
    </div>
);

export default DepositTerms; 
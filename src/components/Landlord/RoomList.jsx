import RoomCard from "@/components/Rooms/RoomCard";

const RoomList = ({ rooms }) => {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Danh sách phòng trọ</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.length > 0 ? (
                    rooms.map((room) => <RoomCard key={room.id} room={room} />)
                ) : (
                    <p className="text-gray-500">Chưa có tin đăng nào.</p>
                )}
            </div>
        </div>
    );
};

export default RoomList;

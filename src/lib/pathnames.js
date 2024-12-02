const pathnames = {
    publics: {
        layout: "/",
        home: "/",
        search: "/search",
        roomdetail_id: "/roomdetail/:id",
        roomdetail: "/roomdetail",
        post: "/post"
    },
    users: {
        layout: "thanh-vien",
        personal: "ca-nhan",
        profilepage: "/users/profile-page",
    },
    admin: {
        layout: "/admin", // route chính của admin
        dashboard: "dashboard", // Thay đổi thành đường dẫn tương đối
    },
}

export default pathnames;

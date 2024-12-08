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
        layout: "/users",
        favoriteposts: "favorite-posts",
        profilepage: "/users/profile-page",
        postmana: "/users/postmana",
        createposts: "/users/create-posts",
        verification: "/users/verification"
    },
    admin: {
        layout: "/admin",
        dashboard: "dashboard",
        hostmanagenment: "hostmanagenment",
        employeemana: "employeemana",
        usermana: "usermana",
    },
}

export default pathnames;

const pathnames = {
    publics: {
        layout: "/",
        home: "/",
        search: "/search",
        roomdetail_id: "/roomdetail/:id",
        roomdetail: "/roomdetail",
        post: "/post",
        results: "/results",
        landlord: "/landlord",
        landlord_id: "/landlord/:id",
        resetpassword: "/reset-password",
    },
    users: {
        layout: "/users",
        favoriteposts: "favorite-posts",
        profilepage: "/users/profile-page",
        postmana: "/users/postmana",
        createposts: "/users/create-posts",
        verification: "/users/verification",
        editprofile: "/users/editprofile",
        chatapp: "/users/chat",
        changepassword: "/users/changepassword",
        postpackage: "/users/postpackage",
        paymentresult: "/users/payment-result",
        history: "/users/history",

    },

    admin: {
        layout: "/admin",
        dashboard: "dashboard",
        post: "post",
        hostmanagenment: "hostmanagenment",
        employeemana: "employeemana",
        usermana: "usermana",
    },
}

export default pathnames;

app.get("/", (req, res) => {
    const data = {
        name: "Byron",
        email: "byron@example.com"
    };

    res.render("home", data);
});

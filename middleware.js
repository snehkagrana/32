function authUser(req, res, next) {
    if (req.user == null && (!req.query.newUser || req.query.newUser !== 'true')) {
        // res.status(403);
        return res.send("You need to log in");
    }
    // Add X-Frame-Options header to prevent clickjacking
    res.header('X-Frame-Options', 'DENY');
    next();
}

function authRole(permissions) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (permissions.includes(userRole)) {
            next();
        } else {
            res.status(401);
            return res.send("Not Allowed");
        }
    };
}

module.exports = {
    authUser,
    authRole,
};


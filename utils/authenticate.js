const isAuthenticated = (req, res, next) => {
    //check session user if not, you don't have access
    if (req.session.user === undefined){
        return res.status(401).json("You do not have access.");
    }
    next();
}

module.exports = { isAuthenticated }

export const adminOnly = (req, res, next) => {
    // Skip for GET requests if we only want to restrict mutations?
    // User said: "only admin can create a purchase and master" -> Implies mutations (POST, PUT, DELETE).
    // GET might be allowed for transparency or usage?
    // Generally master data (like colors, shapes) needs to be READABLE by everyone (dropdowns).
    // So we should only block mutations.
    
    if (req.method === 'GET' || req.method === 'OPTIONS') {
        return next();
    }

    const role = req.headers['x-user-role'];
    console.log("AdminMiddleware: Role received:", role);

    if (!role || role.toLowerCase() !== 'admin') {
        return res.status(403).json({ message: "Access Denied: Only Admins can perform this action." });
    }
    next();
};

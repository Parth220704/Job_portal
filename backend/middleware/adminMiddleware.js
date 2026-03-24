export const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Admin check failed",
      error: error.message
    });
  }
};
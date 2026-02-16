export const getCurrentUser = async (req, res) => {
  try {
    // req.user comes from middleware
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
        createdAt: req.user.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user details",
      error: error.message
    });
  }
};

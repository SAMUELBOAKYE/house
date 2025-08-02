exports.getStats = (req, res) => {
  res.json({
    message: "✅ You have accessed protected stats!",
    user: req.user,
  });
};


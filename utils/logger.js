module.exports = {
  info: (msg, data) => console.log("?? ", msg, data || ""),
  error: (msg, err) => console.error("?", msg, err || "")
};

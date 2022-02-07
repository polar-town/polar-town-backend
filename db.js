const mongoose = require("mongoose");

module.exports = function () {
  mongoose.connect(process.env.DB_URL);

  const db = mongoose.connection;

  const handleOpen = () => console.log("✅ Connected to DB");
  const handleError = (error) => console.error("❌ DB Error", error);

  db.on("error", handleError);
  db.once("open", handleOpen);
};

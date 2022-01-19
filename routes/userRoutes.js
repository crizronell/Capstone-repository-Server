const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const bcrypt = require("bcrypt");
router.get("/", authorization, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE stu_id = $1", [
      req.user,
    ]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.get("/ri", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT * FROM research_incharge WHERE ri_id = $1",
      [req.user]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;

const router = require("express").Router();
const pool = require("../db");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");

// Admin Register Route
router.post("/admin-register", async (req, res) => {
  try {
    //destructure the req.body (name, email, password)
    const { username, password } = req.body;

    //check if user exist (if user exist then throw error)
    const check_admin = await pool.query(
      "SELECT * FROM admin WHERE username = $1",
      [username]
    );

    if (check_admin.rows.length !== 0) {
      return res.status(403).json({ message: "Username Already Exists" });
    } else {
      //bcrypt the user password
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);

      const create_admin = await pool.query(
        `INSERT INTO admin(id, username, password) 
        VALUES ($1,$2,$3) RETURNING *`,
        [uuid.v4(), username, bcryptPassword]
      );
      // generating a jwt token
      // const token = jwtGenerator(create_admin.rows[0]);

      // res.json({ token });
      res.json(create_admin.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin Login Route
router.post("/admin-login", async (req, res) => {
  try {
    //destructure the req.body (username, password)
    const { username, password } = req.body;
    //check if the user doesn't exist (if not then we throw error)
    const admin = await pool.query("SELECT * FROM admin WHERE username = $1", [
      username,
    ]);
    if (admin.rows.length === 0) {
      return res.status(403).json({ message: "Username  Does Not Exist" });
    } else {
      //check if the incoming password is the same in the database password
      const validPassword = await bcrypt.compare(
        password,
        admin.rows[0].password
      );

      if (!validPassword) {
        return res.status(403).json({ message: "Password is Incorrect" });
      }

      //give them the jwt token
      const token = jwtGenerator(admin.rows[0].id);
      res.json({ token });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// User Register Route
router.post("/register", async (req, res) => {
  try {
    //destructure the req.body (name, email, password)
    const { name, username, password } = req.body;

    //check if user exist (if user exist then throw error)
    const check_user = await pool.query(
      "SELECT * FROM users WHERE stu_username = $1",
      [username]
    );

    const check_id = await pool.query(
      "SELECT * FROM add_id WHERE student_id = $1",
      [username]
    );

    if (check_user.rows.length !== 0) {
      return res.status(403).json({ message: "User Already Exists" });
    } else if (check_id.rows.length > 0) {
      //bcrypt the user password
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);

      const create_user = await pool.query(
        `INSERT INTO users(stu_id, stu_name, stu_username, stu_password) 
        VALUES ($1,$2,$3,$4) RETURNING *`,
        [uuid.v4(), name, username, bcryptPassword]
      );
      // generating a jwt token
      // const token = jwtGenerator(create_user.rows[0].user_id);
      // res.json({ token });
      // res.json(create_user.rows[0]);
      res.json({ message: "Register Successfully" });
    } else {
      return res.status(403).json({
        message:
          "student id number does not exist, please contact the admin to add your id number",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  try {
    //destructure the req.body (username, password)
    const { username, password } = req.body;

    //check if the user doesn't exist (if not then we throw error)
    const user = await pool.query(
      "SELECT * FROM users WHERE stu_username = $1",
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(403).json({ message: "Username  Does Not Exist" });
    } else {
      //check if the incoming password is the same in the database password
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].stu_password
      );

      if (!validPassword) {
        return res.status(403).json({ message: "Password is Incorrect" });
      }

      //give them the jwt token
      const token = jwtGenerator(user.rows[0].stu_id);
      res.json({ token });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// new sql
// research incharge login/register
router.post("/ri/register", async (req, res) => {
  try {
    //destructure the req.body (name, email, password)
    const { name, username, password } = req.body;

    //check if user exist (if user does not exist then throw error)
    const check_ri = await pool.query(
      "SELECT * FROM research_incharge WHERE ri_username = $1",
      [username]
    );

    const check_id = await pool.query(
      "SELECT * FROM research_incharge_id WHERE id = $1",
      [username]
    );

    if (check_ri.rows.length !== 0) {
      return res
        .status(403)
        .json({ message: "Research Incharge Already Exists" });
    } else if (check_id.rows.length > 0) {
      //bcrypt the user password
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);

      const create_ri = await pool.query(
        `INSERT INTO research_incharge(ri_id, ri_name, ri_username, ri_password) 
       VALUES ($1,$2,$3,$4) RETURNING *`,
        [uuid.v4(), name, username, bcryptPassword]
      );

      res.json({ message: "Register Successfuly" });
    } else {
      return res.status(403).json({
        message:
          "Research incharge id number does not exist, please contact the admin to add your id number",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/ri/login", async (req, res) => {
  try {
    //destructure the req.body (username, password)
    const { username, password } = req.body;

    //check if the user doesn't exist (if not then we throw error)
    const check_ri = await pool.query(
      "SELECT * FROM research_incharge WHERE ri_username = $1",
      [username]
    );

    if (check_ri.rows.length === 0) {
      return res.status(403).json({ message: "Username  Does Not Exist" });
    } else if (username === "admin") {
      if (password === "adminpass") {
        const token = jwtGenerator("admin");
        res.json({ token });
      } else {
        return res.status(403).json({ message: "Password is Incorrect" });
      }
    } else {
      //check if the incoming password is the same in the database password
      const validPassword = await bcrypt.compare(
        password,
        check_ri.rows[0].ri_password
      );

      if (!validPassword) {
        return res.status(403).json({ message: "Password is Incorrect" });
      }

      //give them the jwt token
      const token = jwtGenerator(check_ri.rows[0].ri_id);
      res.json({ token });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

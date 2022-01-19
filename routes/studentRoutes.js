const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const bcrypt = require("bcrypt");
// Student search research/capstone Route
router.get("/research", authorization, async (req, res) => {
  try {
    //Select the needed information on the table research
    const research = await pool.query("SELECT * FROM research;");

    res.json(research.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/research/:id", authorization, async (req, res) => {
  try {
    //destructure the req.body (id)
    const { id } = req.params;

    //Select all the research using the research id of the research
    const research = await pool.query(
      "SELECT * FROM research Where research_id = $1;",
      [id]
    );

    res.json(research.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/profile_pass", authorization, async (req, res) => {
  try {
    const id = req.user;

    //destructure the req.body (password, oldpassword)
    const { password, oldpassword } = req.body;

    //Select all the users using the user id
    const user = await pool.query("SELECT * FROM users WHERE stu_id = $1", [
      id,
    ]);

    //check if the incoming password is the same in the database password
    const validPassword = await bcrypt.compare(
      oldpassword,
      user.rows[0].stu_password
    );

    if (!validPassword) {
      return res.status(403).json("Old Password is incorrect");
    } else {
      //bcrypt the user password
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);

      //Select all the users using the user id
      const editPassword = await pool.query(
        "UPDATE users SET stu_password = $1 WHERE stu_id = $2",
        [bcryptPassword, id]
      );

      res.json("Changed Password Successfuly");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/profile_name", authorization, async (req, res) => {
  try {
    const id = req.user;

    //destructure the req.body (password)
    const { name } = req.body;

    //Select all the users using the user id
    const editName = await pool.query(
      "UPDATE users SET stu_name = $1 WHERE stu_id = $2 RETURNING *",
      [name, id]
    );

    res.json("Edit Name Successfuly");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


module.exports = router;

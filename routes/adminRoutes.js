const router = require("express").Router();
const pool = require("../db");
const uuid = require("uuid");
const authorization = require("../middleware/authorization");
const bcrypt = require("bcrypt");

// add student id
router.post("/student_id", authorization, async (req, res) => {
  try {
    //destructure the req.body (id)
    const { student_id } = req.body;

    //check if the student id does exist (if exist throw a error message)
    const check_id = await pool.query(
      "SELECT * FROM add_id WHERE student_id = $1",
      [student_id]
    );

    if (check_id.rows.length > 0) {
      return res.status(409).json("Student id already exist");
    } else if (check_id.rows.length === 0) {
      const create_id = await pool.query(
        "INSERT INTO add_id(id, student_id) VALUES($1,$2) RETURNING *",
        [uuid.v4(), student_id]
      );

      res.json(create_id.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Edit Students id
router.put("/edit_id/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id } = req.body;
    const check_id = await pool.query(
      "SELECT * FROM add_id WHERE student_id = $1",
      [student_id]
    );
    if (check_id.rows.length > 0) {
      return res.status(409).json("ID Already Exist");
    } else if (check_id.rows.length === 0) {
      const updateStudent = await pool.query(
        "UPDATE add_id SET student_id = $1 WHERE id =$2",
        [student_id, id]
      );
      res.json("Edit Successfully");
    }
  } catch (err) {
    console.log(err.message);
  }
});

//DELETE ID
router.delete("/delete_id/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deletestudent = await pool.query("DELETE FROM add_id WHERE id= $1", [
      id,
    ]);

    res.json("Delete Successfully");
  } catch (error) {
    console.log(err.message);
  }
});

//Display ID in data table
router.get("/get_allID", async (req, res) => {
  try {
    const allID = await pool.query("SELECT * FROM add_id");

    res.json(allID.rows);
  } catch (error) {
    console.log(err.message);
  }
});

// Count total ID
router.get("/total_id", async (req, res) => {
  try {
    const totalID = await pool.query("SELECT COUNT(*) FROM add_id");

    res.json(totalID.rows);
  } catch (error) {
    console.log(err.message);
  }
});

// //DELETE STUDENT
// router.delete("/delete_idstudent/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletestudent = await pool.query("DELETE FROM add_id WHERE id = $1", [
//       id,
//     ]);

//     res.json(deletestudent.rows[0]);
//   } catch (error) {
//     console.log(err.message);
//   }
// });

//Edit Students
router.put("/edit_students/:stu_id", authorization, async (req, res) => {
  try {
    const { stu_id } = req.params;
    const { stu_password } = req.body;

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(stu_password, salt);
    const updateStudent = await pool.query(
      "UPDATE users SET  stu_password = $1 WHERE stu_id = $2",
      [bcryptPassword, stu_id]
    );
    res.json("Edit Successfully");
  } catch (err) {
    console.log(err.message);
  }
});

// // Display Students  to data table
// router.get("/get_students", async (req, res) => {
//   try {
//     const allStudents = await pool.query("SELECT * FROM users");

//     res.json(allStudents.rows);
//   } catch (error) {
//     console.log(err.message);
//   }
// });

router.get("/getstudents", async (req, res) => {
  try {
    const allStudents = await pool.query("SELECT * FROM users");
    res.json(allStudents.rows);
  } catch (error) {
    console.log(err.message);
  }
});

//DELETE STUDENT
router.delete("/delete_student/:stu_id", async (req, res) => {
  try {
    const { stu_id } = req.params;
    const deletestudent = await pool.query(
      "DELETE FROM users WHERE stu_id = $1",
      [stu_id]
    );

    res.json(deletestudent.rows[0]);
  } catch (error) {
    console.log(err.message);
  }
});

// Count total student
router.get("/total_student", async (req, res) => {
  try {
    const totalStudent = await pool.query("SELECT COUNT(*) FROM users");

    res.json(totalStudent.rows);
  } catch (error) {
    console.log(err.message);
  }
});

//ADD RESEARCH ROUTE
router.post("/research", authorization, async (req, res) => {
  try {
    //destructure the req.body (title, author, abstract, keywords)
    const { title, author, year, abstract, keywords, url, college, program } =
      req.body;

    //check if the research title does exist (if exist throw a error message)
    const check_title = await pool.query(
      "SELECT * FROM research WHERE research_title = $1",
      [title]
    );

    if (check_title.rows.length > 0) {
      return res.status(409).json("Research title already exist");
    } else if (check_title.rows.length === 0) {
      const add_research = await pool.query(
        `INSERT INTO research(research_id, research_title, research_author, research_year, research_abstract, research_keywords, research_url, research_college, research_program) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          uuid.v4(),
          title,
          author,
          year,
          abstract,
          keywords,
          url,
          college,
          program,
        ]
      );
      res.json(add_research.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Display all research into datatable
router.get("/get_research", async (req, res) => {
  try {
    const allResearch = await pool.query("SELECT * FROM research");

    res.json(allResearch.rows);
  } catch (error) {
    console.log(err.message);
  }
});

// Update research or add url to the research url column in database
router.put("/research_url", authorization, async (req, res) => {
  try {
    //destructure the req.body (url)
    const { id, url } = req.body;

    //update the research url column
    const update_url = await pool.query(
      "UPDATE research set research_url = $2 WHERE research_id = $1",
      [id, url]
    );

    res.json("ADDED SUCCESSFULY");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// // Edit Research details
// router.put("/research_edit/:research_id", authorization, async (req, res) => {
//   try {
//     const { research_id } = req.params;
//     //destructure the req.body (id, title, author, year, abstract, keywords, url )
//     const { title, author, year, abstract, keywords, url } = req.body;

//     //update the research table
//     const research_Edit = await pool.query(
//       "UPDATE research set research_title = $1, research_author = $2, research_year = $3, research_abstract = $4, research_keywords = $5, research_url = $6 WHERE research_id = $7 RETURNING *",
//       [title, author, year, abstract, keywords, url, research_id]
//     );

//     res.json(research_Edit.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });
// Edit Research details
router.put("/research_edit", authorization, async (req, res) => {
  try {
    //destructure the req.body (id, title, author, year, abstract, keywords, url, college, program )
    const {
      id,
      title,
      author,
      year,
      abstract,
      keywords,
      url,
      college,
      program,
    } = req.body;

    //update the research table
    const research_Edit = await pool.query(
      "UPDATE research set research_title = $2, research_author = $3, research_year = $4, research_abstract = $5, research_keywords = $6, research_url = $7, research_college = $8, research_program = $9 WHERE research_id = $1 RETURNING *",
      [id, title, author, year, abstract, keywords, url, college, program]
    );

    res.json(research_Edit.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// Count total capstone
router.get("/total_capstone", async (req, res) => {
  try {
    const totalCapstone = await pool.query("SELECT COUNT(*) FROM research");

    res.json(totalCapstone.rows);
  } catch (error) {
    console.log(err.message);
  }
});
// router.get("/research/:ids/:classId");
// // http:localhost:5000/admin/research/23jskdfsdis/aclass_isii34
// const { ids, classId } = req.params;

// new sql

// ADD RESEARCH INCHARGE ID ROUTE
router.post("/research_incharge_id", authorization, async (req, res) => {
  try {
    //destructure the req.body (id)
    const { id } = req.body;

    //check if the student id does exist (if exist throw a error message)
    const check_id = await pool.query(
      "SELECT * FROM research_incharge_id WHERE id = $1",
      [id]
    );

    if (check_id.rows.length > 0) {
      return res.status(409).json("Research incharge id already exist!");
    } else if (check_id.rows.length === 0) {
      const create_id = await pool.query(
        "INSERT INTO research_incharge_id(id) VALUES($1) RETURNING *",
        [id]
      );

      res.json(create_id.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// fetch pending research
router.get("/pending_research", authorization, async (req, res) => {
  try {
    //Select the needed information on the table research
    const research = await pool.query(
      `SELECT * FROM pending_research WHERE research_status = 'pending'`
    );

    res.json(research.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// update pending research / reject pending research
router.put("/pending_research", authorization, async (req, res) => {
  try {
    const { id } = req.body;
    await pool.query(
      `UPDATE pending_research SET research_status = 'rejected' WHERE research_id = $1`,
      [id]
    );

    res.json("Rejected research successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

const router = require("express").Router();
const pool = require("../db");
const uuid = require("uuid");
const authorization = require("../middleware/authorization");

router.post("/research", authorization, async (req, res) => {
  try {
    //destructure the req.body (title, author, abstract, keywords)
    const {
      title,
      author,
      year,
      abstract,
      keywords,
      url,
      college,
      program,
      ri_name,
      ri_id,
    } = req.body;

    //check if the research title does exist (if exist throw a error message)
    const check_title = await pool.query(
      "SELECT * FROM pending_research WHERE research_title = $1",
      [title]
    );

    if (check_title.rows.length > 0) {
      return res.status(409).json("Research Title Already Exist");
    } else if (check_title.rows.length === 0) {
      const add_research = await pool.query(
        `INSERT INTO pending_research(research_id, research_title, research_author, research_year, research_abstract, research_keywords, research_url, research_college, research_program, research_status, ri_id, ri_name) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
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
          "pending",
          ri_id,
          ri_name,
        ]
      );
      res.json(add_research.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update research or add url to the research url column in database
router.put("/research_url", authorization, async (req, res) => {
  try {
    //destructure the req.body (url)
    const { id, url } = req.body;

    //update the research url column
    const update_url = await pool.query(
      "UPDATE pending_research set research_url = $2 WHERE research_id = $1",
      [id, url]
    );

    res.json("Research Added Successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// fetch pending research
router.get("/research", authorization, async (req, res) => {
  try {
    //Select the needed information on the table research
    const research = await pool.query(
      "SELECT * FROM pending_research WHERE ri_id =$1",
      [req.user]
    );

    res.json(research.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// delete pending research
router.delete("/research/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM pending_research WHERE research_id = $1", [
      id,
    ]);
    res.json("Deleted Successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

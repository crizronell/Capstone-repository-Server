const Pool = require("pg").Pool;

const pool = new Pool({
  user: "dcqlozvklaxagm",
  password: "4688d0f4a36a86df91ddef4d033bbc81231c74c09f110ea72ebe808b507215c3",
  host: "ec2-3-230-219-251.compute-1.amazonaws.com",
  port: 5432,
  database: "df3f7f2a6418c5",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;

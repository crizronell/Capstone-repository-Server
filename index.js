const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

//Routes

//register and login routes
app.use("/auth", require("./routes/userAuth"));

//admin add student id and add research routes
app.use("/admin", require("./routes/adminRoutes"));

//User routes
app.use("/user", require("./routes/userRoutes"));

//Student search Routes
app.use("/student", require("./routes/studentRoutes"));

// Research incharge Routes
app.use("/research_incharge", require("./routes/researchInchargeRoutes"));

app.listen(PORT, () => {
  console.log("server is running on port 5000");
});

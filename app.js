const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const path = require("path");

const port = process.env.PORT || 3001;

const passport = require("passport");

const app = express();

app.use(bodyparser.json({ limit: "10mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "10mb" }));

if (app.get("env") === "development") {
  const cors = require("cors");
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: `http://localhost:3000`
    })
  );
}

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Authentication
app.use(passport.initialize());
require("./middleware/passport")(passport);

// Routers
const authRouter = require("./routes/authenticate");
app.use("/api/auth", authRouter);

const assignmentRouter = require("./routes/assignment.route");
app.use("/api/assignment", assignmentRouter);

const progressRouter = require("./routes/progress.route");
app.use("/api/progress", progressRouter);

const groupRouter = require("./routes/group");
app.use("/api/group", groupRouter);

const studentAddCode = require("./routes/students");
app.use("/api/group", studentAddCode);

const organisationRouter = require("./routes/organisation");
app.use("/api/organisation", organisationRouter);

const authorTool = require("./routes/author-tool/index");
app.use("/api/author-tool", authorTool);

const contentRouter = require("./routes/content.route");
app.use("/api/content", contentRouter);

// TODO: NEEDED?
const treeRouter = require("./routes/tree.route");
app.use("/api/tree", treeRouter);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname + "/client/build/index.html"))
  );
}

app.listen(port, () => {
  console.log("Listening on port: ", port);
});

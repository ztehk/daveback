const express = require("express");
const cron = require("node-cron");
const compression = require("compression");
const { updateTech } = require("./controllers/techcont");
const { updateAthletics } = require("./controllers/athleticscont");
const { updateBox } = require("./controllers/boxingcont");
const { updateCeleb } = require("./controllers/celebritycont");
const { updateCourses } = require("./controllers/coursecont");
const { updateFinance } = require("./controllers/financecont");
const { updateFootball } = require("./controllers/footballcont");
const { updateForex } = require("./controllers/forexcont");
const { updateGist } = require("./controllers/gistcont");
const { updateMusic } = require("./controllers/musiccont");
const { updatePolitics } = require("./controllers/politicscont");
const { updateMoney } = require("./controllers/moneycont");
const app = express();

app.use(compression());
const userRoutes = require("./routes/user");
const athleticsRoute = require("./routes/athletics");
const musicRoutes = require("./routes/music");
const boxroutes = require("./routes/box");
const searchroute = require("./routes/search");
const newsrout = require("./routes/gist");
const newsvideorout = require("./routes/newsvideo");
const footballroute = require("./routes/football");
const celebroute = require("./routes/celebrity");
const financeroute = require("./routes/finance");
const politicsroute = require("./routes/politics");
const forexroute = require("./routes/forex");
const tech = require("./routes/tech");
const tenroute = require("./routes/ten");
const tennisroute = require("./routes/tennis");
const coursesroute = require("./routes/courses");
const moneyroute = require("./routes/money");

const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const { updateTen } = require("./controllers/tencont");

cron.schedule("0 */5 * * *", async () => {
  try {
    updateTech();
    updateAthletics();
    updateBox();
    updateMusic();
    updateCeleb();
    updateCourses();
    updateFinance();
    updateFootball();
    updateForex();
    updateGist();
    updatePolitics();
    updateTech();
    updateTen;
    updateMoney();
  } catch (error) {
    console.error("Error updating documents:", error);
  }
});

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

app.use(express.json({ limit: "200mb" }));
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/athletics", athleticsRoute);
app.use("/api/music", musicRoutes);
app.use("/api/boxing", boxroutes);
app.use("/api/gist", newsrout);
app.use("/api/search", searchroute);
app.use("/api/newsvideo", newsvideorout);
app.use("/api/football", footballroute);
app.use("/api/tech", tech);
app.use("/api/celebrity", celebroute);
app.use("/api/finance", financeroute);
app.use("/api/politics", politicsroute);
app.use("/api/forex", forexroute);
app.use("/api/top-ten", tenroute);
app.use("/api/tennis", tennisroute);
app.use("/api/courses", coursesroute);
app.use("/api/money", moneyroute);

mongoose
  .connect(process.env.STRING)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `connected to db && listening to pport ${process.env.PORT}!!!`
      );
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

// file deepcode ignore UseCsurfForExpress: CSRF Protection will disallow Socket to function properly!
const app = require("express")();
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require("http").Server(app);

const { dbConfig } = require("./utils/db");
const APIRouter = require("./utils/router");
const { socketConfig } = require("./utils/socket");
const PORT = process.env.PORT || 4000;

app
  .use(cors())
  .use(morgan("dev"))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(helmet());

/**
 * @dev configuration utils
 * 1. Database Configuration
 */
dbConfig();
socketConfig(http);

/**
 * @dev Router Configuration
 */
app.use("/", APIRouter).get("*", (req, res) =>
  res.json({
    msg: "404 Not Found! 🦟",
  })
);

http.listen(PORT, () => {
  console.log(`👾 : Server listening on ${PORT}!`);
});

module.exports = http;

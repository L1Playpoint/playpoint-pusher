// file deepcode ignore UseCsurfForExpress: CSRF Protection will disallow Socket to function properly!
const app = require("express")();
const helmet = require("helmet");
app.use(helmet());
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { socketConfig } = require("./utils/socket");
const { dbConfig } = require("./utils/db");
const APIRouter = require("./utils/router");
const PORT = process.env.POR || 4000;
const http = require("http").Server(app);

app
  .use(cors())
  .use(morgan("dev"))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

/**
 * @dev configuration utils
 * 1. Database Configuration
 * 2. Socket Configuration
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

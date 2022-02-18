const apiRouter = require("express").Router();

const { getEndpoints } = require("../controllers/api");
apiRouter.route("/").get(getEndpoints);

const { fetchEndpoints } = require("../models/api");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((endPoints) => {
      res.status(200).send({ endPoints });
    })
    .catch(next);
};

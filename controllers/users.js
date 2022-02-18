const { fetchUsers, fetchUser } = require("../models/users");
const { checkExists } = require("../utils/utils");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  const username = req.params.username;
  Promise.all([fetchUser(username), checkExists("users", "username", username)])
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

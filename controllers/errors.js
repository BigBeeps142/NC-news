exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Bad request" });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal sever error");
};

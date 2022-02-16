const fs = require("fs/promises");

exports.fetchEndpoints = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((endpoints) => {
    const parsedEndpoints = JSON.parse(endpoints);
    return parsedEndpoints;
  });
};

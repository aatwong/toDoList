var fs        = require("fs");
var path      = require("path");

var SequelizeLibrary = require('sequelize');
var sequelizeDb = new SequelizeLibrary('toDoApp', 'andrew.atwong', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

var db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelizeDb.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelizeDb;
db.Sequelize = SequelizeLibrary;

module.exports = db;  //e.g. used in routes/to-do.js

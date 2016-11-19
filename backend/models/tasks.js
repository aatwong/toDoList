
//tasks table model in toDoData Database
module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("tasks", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    task: {type: DataTypes.STRING},
    isComplete: { type: DataTypes.BOOLEAN, defaultValue: false},
    dueDate: {type: DataTypes.DATE}
  }, {
    timestamps: false
  });

  return Task;
};

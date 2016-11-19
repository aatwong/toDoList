var express = require('express');
var router = express.Router();

var Models = require('../models'); // db variable!!

/* GET path: /tasks  */
router.get('/', function(req, res, next) {   //Get request endpoint
  Models.tasks.findAll().then(function(taskTableData) {
    res.json({"results": taskTableData}); //results is the key to access the array. in json key-value pair format
  });
  //res.json({"foo": ["bar", "none"]});
});

// POST path: /tasks
router.post('/', function(req, res, next) {   //This is called a POST ENDPOINT
  console.log(req.body.task);
  console.log(req.body.dueDate);
  Models.tasks.create({ task: req.body.task, dueDate: req.body.dueDate}).then(function(task){
    res.send(task);
  });
});

module.exports = router;

//DELETE path: /tasks
router.delete('/', function(req, res, next) {  //This is the DELETE endpoint
  Models.tasks.destroy({
    where: {
      id: req.body.id
    }
  }).then(function(totalRowsDeleted) {
    res.send("successfuly deleted " + totalRowsDeleted);
  })
})

var express = require('express');
var router = express.Router();
var cors = require('cors');

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

// Edit Task and Date Endpoint
router.put('/:id', function(req, res, next) {
  Models.tasks.update({ task: req.body.task, dueDate: req.body.dueDate}, {
      where: {
        id: req.params.id  //params because id is passed in as a parameter in url
      }
    })
    .then(function(totalRowsUpdated){
    res.send("successfully updated " + totalRowsUpdated)
  });
});

router.put('/complete/:id', function(req, res, next) {
  Models.tasks.update({isComplete : req.body.isComplete}, {
    where: {
      id: req.params.id
    }
  })
  .then(function(changedCompleteStatus) {
    res.send("successfully changed isComplete status of " + changedCompleteStatus + " row");
  });
});

//DELETE path: /tasks
router.delete('/:id', function(req, res, next) {  //This is the DELETE endpoint, ":id" indicates from the client request which task to delete
  Models.tasks.destroy({
    where: {
      id: req.params.id  //params because id is passed in as a parameter in url
    }
  }).then(function(totalRowsDeleted) {
    res.send("successfully deleted " + totalRowsDeleted + " row");
  })
})

module.exports = router;

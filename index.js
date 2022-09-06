
const express = require("express");
const app = express();

const port = 4000;

const db = require('./config/mongoose');

const Task = require("./models/task");

const path = require('path');

// set a view engine here its ejs
app.set("view engine", "ejs");

//  set a path to find the view engine(ejs) folder
app.set("views", path.join(__dirname, "views"));

app.use(express.static('assets'));

// parsing data which is coing from server
app.use('/',express.urlencoded({ extended: true }) );

app.get("/", function (req, res) {

  console.log("inside get method");

  Task.find({}, function (err, tasks) {

    if (err) {
      console.log("Error in fetching contatcs from databse");
      return;
    }

    console.log("tasks doc",tasks);
    return res.render("home", {

      title: "TO DO APP",
      taskList: tasks,

    });

  });

});

// add router.post for adding new tasks and router.delete for deleting a task.
var months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEPT','OCT','NOV','DEC'];

app.post("/create-task", function (req, res) {

  let d=`${req.body.date}`+"";
  console.log(d,typeof(d),req.body.date);

  const dateString = new Date(`${d}`);
  console.log(dateString,typeof(dateString));

  let m=dateString.getMonth();
  console.log(m);

  let monthName= months[m-1];
  console.log(monthName);

  let dateNew=monthName+" "+( dateString.getDate()+"" )+","+( dateString.getFullYear()+"" )
  console.log(dateNew);

  Task.create( {

      description: req.body.description,
      date: dateNew,
      typeOfTask : req.body.typeOfTask,

    }, function (err, newTask) {
      //this is a callback function it is a part of the syntax
      // to handle errors and redirect the user
      //if contact document is created sucessfully.
      if (err) {
        console.log("error in creating contact",err);
        return;
      }
      console.log("***********", newTask);
      return res.redirect("back");
    }
  );
});

app.get("/delete-task", function (req, res) {

  //fetch the collection from database traverse the document and check which of the
  //documents are checked now put all the id's of checked documents in the checked Array
  //and we will traverse the checked array and find the docment by its id that we will
  //get from checked array and delete that document from the collection in the database.

  // console.log(req);
  // console.log(" query parameter of req object req.query --->",req.query);

//why only the value of _id for the checked tasks are sent to req.query and not all the _id are sent to req.query ??
    // getting the id from the query
    let id = req.query;//req.query will give us the _id value of the checkboxes that are selected as they 
    //are passed from the html form inside which delete button is present .the _id will be passed to 
    //the javascript file to be referenced when we submit the form or click on the delete button
    // ( the delete button submits the form basically)
    //So all the checkboxes that are checked there values of _id will be passed from the form 
    //in ejs that has the delete button inside it to the route that handles delete operaions.
    //The data will be passed from the ejs form to javascript using the name attribute of input tag when the form is submitted.
    //name="<%= taskList[i]._id %>" the input tags i.e those checkboxes thata are checked will
    //have the value of name attribute as taskList[i]._id and this will be passed in the req objects query 
    /*property like this ------------------>>>> query: {
                                                         '6314ac84181f884fc43cc3c5': 'on', <-- here 'on' indicates that the checkbox with that particular id has been selected or that it is checked
                   key of req.query object------------->>'6315595c50ca89b412f46366': 'on' <<----- value of req.query object
                                                        }       
                [6314ac84181f884fc43cc3c5,6315595c50ca89b412f46366] 
                */
    // checking the number of tasks selected to delete
    let count = Object.keys(id).length;
    console.log(Object.keys(id));///Object.keys(id) will basically return an array contaning all the 
    //keys of req.query object.
    //Since the keys inside the req.query object is the _id property(we can see this _id property 
    //in the mongoDB database where the tasks are stored. _id is a unique property of every document that is stored in MongoDB)
    // of the selected tasks  
/*
Object.keys(id) or Object.keys(req.query()) will give us the array containing all the keys of req.query object.
Object.keys(id).length will give us the length of the array that contains the keys of req.query object
*/
    for(let i=0; i < count ; i++){
        
        // finding and deleting tasks from the database one by one using id
        Task.findByIdAndDelete(Object.keys(id)[i], function(err){
        if(err){
            console.log('error in deleting task');
            }
        })
    }
    return res.redirect('back');
 
  
});

app.listen(port, function (err) {
  if (err) {
    console.log(`Error  in running server ${err}`);
    return;
  }

  console.log(`Server up and running on port ${port}`);
});

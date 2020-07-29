// var conn = require('../config')
var express = require('express')
var app = express()
var mysql = require('mysql');
// var mysql = require('mysql');
var connn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
	database: 'nodejs_tasks',
	server:{
		host: '127.0.0.1',
		port: '3000'
	}
});

connn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        connn.query('SELECT * FROM tbl_tasks  WHERE completed = 0',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('task/list', {
                    title: 'Task List', 
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('task/list', {
                    title: 'Task List', 
                    data: rows
                })
            }
        })
    })
})
 

// SHOW LIST OF completed task USERS
app.get('/completed', function(req, res, next) {
    req.getConnection(function(error, conn) {
        connn.query('SELECT * FROM tbl_tasks WHERE completed = 1',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('task/completed', {
                    title: 'Task List', 
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('task/completed', {
                    title: 'Task List', 
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('task/add', {
        title: 'Add New Task',
        task_name: '',    
    })
})
 
// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){    
    req.assert('task_name', 'Name is required').notEmpty() 
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var task = {
            task_name: req.sanitize('task_name').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            connn.query('INSERT INTO tbl_tasks SET ?', task, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('task/add', {
                        title: 'Add New Task',
                        task_name: task.task_name,               
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('task/add', {
                        title: 'Add New User',
                        task_name: '',                  
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('user/add', { 
            title: 'Add New User',
            task_name: req.body.task_name,
        })
    }
})
 
// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn) {
        connn.query('SELECT * FROM tbl_tasks WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id)
                res.redirect('/tasks')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('task/edit', {
                    title: 'Edit Task', 
                    //data: rows[0],
                    id: rows[0].id,
                    task_name: rows[0].task_name,
                    completed: rows[0].completed,                   
                })
            }            
        })
    })
})
 
// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
    req.assert('task_name', 'completed').notEmpty()           //Validate name
    // req.assert('complete', 'Status required').notEmpty()
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var task = {
            task_name: req.sanitize('task_name').escape().trim(),
            completed:req.sanitize('completed').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            connn.query('UPDATE tbl_tasks SET ? WHERE id = ' + req.params.id, task, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('task/edit', {
                        title: 'Edit Task',
                        id: req.params.id,
                        task_name: req.body.task_name,
                        completed: req.body.completed
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('task/edit', {
                        title: 'Edit Task',
                        id: req.params.id,
                        task_name: req.body.task_name,
                        completed: req.body.completed
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('task/edit', { 
            title: 'Edit Task',            
            id: req.params.id,
            name: req.body.task_name,
            completed:req.body.completed
        })
    }
})
 
// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
    var user = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        connn.query('DELETE FROM tbl_tasks WHERE id = ' + req.params.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/tasks')
            } else {
                req.flash('success', 'User deleted successfully! id = ' + req.params.id)
                // redirect to users list page
                res.redirect('/tasks')
            }
        })
    })
})
 
module.exports = app
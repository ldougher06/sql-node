'use strict';

var pg = require('pg');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./Northwind.sl3');

var client = new pg.Client(db);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
    client.end();
  });
  client.query("SELECT * FROM Categories", function(err, result){
    // console.log(result.rows);
  });
  client.query("SELECT * FROM Products INNER JOIN Categories ON Products.CategoryID = Categories.CategoryID LIMIT 10", function (err, row) {
    console.log(row);
  });
});

var query = client.query('CREATE TABLE NewTable(ProductID SERIAL PRIMARY KEY)');
query.on('end', function(){
  client.end();
});

var createCatFavTable = function (db) {
  client.query('', function(err, row) {
    console.log('=========');
    console.log('Create Table');
    console.log('=========');
  });
  client.on('CREATE TABLE CategoryFavorites( ' +
    'FavoriteID INTEGER NOT NULL, '+
    'CategoryID INTEGER NOT NULL, '+
    'PRIMARY KEY (FavoriteID), ' +
    'FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)) ', function(err, ROW) {
      console.log(err);
  })
}
var insertData = function(db) {
  client.query('', function(err, row) {
    console.log('=========');
    console.log('Insert Data');
    console.log('=========');
  });
  client.on('INSERT INTO CategoryFavorites(CategoryID) ' +
    'VALUES (2), (4), (6), (8); ', function(err, ROW) {
      console.log(err);
  });
};
var getCatFavorites = function (db) {
  client.query('', function(err, row) {
    console.log('=========');
    console.log('Category Favorites');
    console.log('=========');
  });
  client.on('SELECT Categories.Description as CatDec, CategoryFavorites.FavoriteID ' +
    'FROM CategoryFavorites '+
    'LEFT OUTER JOIN Employees AS Supervisors ' +
    'ON Employees.ReportsTo = Supervisors.EmployeeID ', function (err, row) {
    if (row.SupervisorLastName) {
      console.log('Employee ' + row.EmployeeLastName + " supervisors's last name is " + ROW.SupervisorLastName)
    } else {
      console.log(ROW.EmployeeLastName + ' has no supervisor')
    }
  });
};
// db.serialize(function() {
//   getCategories();
//   getProducts();
//   getEmployeeSupers();
//   createCatFavTable();
//   insertData();
//   getCatFavorites();
//   client.end();
// });


// Tuto sqlite: https://www.sqlitetutorial.net/sqlite-create-table/
// Autre tuto: https://codeforgeek.com/node-sqlite-tutorial/

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');

db.serialize(function() {

  db.run("DROP IF EXISTS TABLE User_info");

  db.run("CREATE TABLE IF NOT EXISTS User_info (pseudo TEXT PRIMARY KEY, passwd TEXT, role TEXT)");
  var stmt = db.prepare("INSERT INTO User_info VALUES (?, ?, ?)");
  for (var i = 0; i < 10; i++) {
    stmt.run("user" + i, "pass" + i, "utilisateur");
  }
  stmt.finalize();

  db.each("SELECT pseudo, passwd, role FROM User_info", function(err, row) {
    console.log(row.pseudo + ": " + row.passwd + ", " + row.role);
  });
});

db.close();

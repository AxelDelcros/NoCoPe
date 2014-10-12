var express = require('express');
 
var app = express();
 
app.get('*', function (req, res) {
  res.send('hello j');
});
 
app.listen(3000);
console.log("Server started on port 3000");
module.exports = app;
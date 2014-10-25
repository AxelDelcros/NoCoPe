var express = require('express');
 
var app = express();
 
app.get('*', function (req, res) {
  res.send('Nocope');
});
 
app.listen(3000);
console.log("Server started on port 3000");
console.log("Please open your browser and hit http://localhost:3000/");
console.log("[Type Ctrl+C to stop the server]");
module.exports = app;
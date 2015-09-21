var express = require('express');
var app = express();
var path = require('path');

// Set port
app.set('port', process.env.PORT || 4000);
// Set root directory for static files
app.use(express.static(__dirname + '/public'));

// Wildcard for any URL requested - send them to the index page
// Angular then deals with displaying different views for different URLs
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
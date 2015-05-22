/**
 * Created by michelt on 29.04.2015.
 */

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(7777);

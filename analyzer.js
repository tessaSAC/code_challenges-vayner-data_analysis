const fs = require('fs')
var parse = require('csv-parse')
fs.readFile('source1.csv', function (err, data) {
  parse(data, {columns: false, trim: true}, function(err, rows) {
    // Your CSV data is in an array of arrys passed to this callback as rows.
    console.log(rows);
  })
})
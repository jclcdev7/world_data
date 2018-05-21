'use strict';

var pouchdb = require('pouchdb')
var db = new pouchdb('http://localhost:5984/world', {username: 'admin', password: 'admin'});

function showDocs() {
   db.allDocs({include_docs: true}).then(function (doc) {
      doc.rows.forEach((item, idx) => {
         //if (idx < 2) {
            console.log(item.doc._id)
            db.remove(item.doc);
         //}
      })

   }).catch(function (err) {
      console.log(err);
   });
}

showDocs();
db.compact();

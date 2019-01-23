const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
// const async = require('async');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //data is the new id
  counter.getNextUniqueId(function(err, data){
    fs.writeFile(exports.dataDir + `/${data}.txt`, text, function(err){
      if(err) {
        callback(err, null)
      } else {
        callback(null, { id: data, text }); 
      }
    })
  });
  // items[id] = text;//don't need
};

// exports.create = (text, callback) =>{
//   var id = counter.getNextUniqueId();
//   items[id] = text;
//   fs.readFile('counter.txt', (err, data)=>{
//     if(err) throw error;
//     return callback(null, data);
    
//   })
//   // (callback(null, { id, text }));
// }

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};
// exports.readAll = async(callback) => {
//   var data = _.map(items, (text, id) => {
//     return { id, text };
//   });
//   await new Promise(callback(null, data));
// };

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

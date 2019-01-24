const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const counterTxt = require('./counter.txt');
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
        // itemsArr.push({ id: data, text });//copy of the object at index???
        callback(null, { id: data, text }); 
        
      }
    })
  });
  // items[id] = text;//don't need
};
exports.readAll = (callback) => {
  //data is the new id
  fs.readdir(exports.dataDir, function(err, data){
    if(err){
      callback(err, null);
    } else{
      console.log(data);
      callback(null, data.map(filename=>{
        let fileId = filename.slice(0, filename.length - 4);
        return {id: fileId, text: fileId };
      }));
      //want to look like dis ===>   [{ id: data, text }];
            
    }
  });
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

// exports.readAll = (callback) => {
//   var data = _.map(items, (text, id) => {
//     return { id, text };
//   });
//   callback(null, data);
// };

//implement onclick function? when press edit 

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir+`/${id}.txt`, 'utf-8', (err, data)=>{
    if(err){
      callback(err, null);
    } else {
      callback(null, {id, text: data});
    }
  })
}


// exports.readOne = (id, callback) => {
//   var text = items[id];
//   if (!text) {
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback(null, { id, text }); //readFile
//   }
// };

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text }); //fs.exists, fs.write
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`)); //fs.unlinked
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

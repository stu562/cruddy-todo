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
  // function promised(){
  //     return new Promise((resolve, reject) => {
  //     fs.readdir(exports.dataDir, (err, data)=>{
  //       if(err){
  //         reject(err);
  //       } 
  //       resolve(data);
  //     })
  //   })
  // }
  
  // promised()
  //   .then(data => data.map(filename => {
  //     let fileId = filename.slice(0, filename.length-4);
  //     return filename.text;
  //   }))
  //   .catch(console.log('There is an error!'))

  fs.readdir(exports.dataDir, function(err, data){
    if(err){
      callback(err, null);
    } else{
      Promise.all(
        data.map(filename=>{
          let fileId = filename.slice(0, filename.length - 4);
          return new Promise((resolve, reject) => {
            exports.readOne(fileId, (err, data)=>{
              if(err){
                reject(err);
              } else { 
                resolve(data);
              }
            })
          })
        })
      )
      .then(data => callback(null, data))
      .catch(err => callback(err, null));         
    }
  });
};

// function httpAsync () {
//   return new Promise((resolve,reject) => {
//     http.get('www.google.com', (err, data) => {
//       if (err) {
//         reject(err)
//       } 
//       resolve(data)
//     })
//   })
// }

// httpAsync()
//   .then(data => data)
//   .catch()

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir+`/${id}.txt`, 'utf-8', (err, data)=>{
    if(err){
      callback(err, null);
    } else {
      callback(null, {id, text: data});
    }
  })
}

exports.update = (id, text, callback) => {
  fs.access(exports.dataDir+`/${id}.txt`, (err, data)=>{
    if(err){      
      console.log( `${id} not found`);
    } else {
      fs.writeFile(exports.dataDir+`/${id}.txt`, text, (err, data)=>{
        if(err){
          // console.log('error')

          callback(err, null)
        } else {
          callback(null, text);
        }
      })
    }
  })
};


exports.delete = (id, callback) => {
  fs.access(exports.dataDir+`/${id}.txt`, (err, data)=>{
    if(err){      
      callback(err, null);
    } else {
      fs.unlink(exports.dataDir+`/${id}.txt`, (err, data)=>{
        if(err){
          // console.log('error')
          callback(err, null)
        } else {
          callback(null, data);
        }
      })
    }
  })
};


// exports.delete = (id, callback) => {
//   var item = items[id];
//   delete items[id];
//   if (!item) {
//     // report an error if item not found
//     callback(new Error(`No item with id: ${id}`)); //fs.unlinked
//   } else {
//     callback();
//   }
// };

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

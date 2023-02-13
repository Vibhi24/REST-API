const fs = require("fs");

const readPromise = (path) => {
    return new Promise((resolve,reject)=>{
    fs.readFile(path, "utf-8", (err,data)=>{
        if(err){
            reject(err);
        }else{
            resolve(data);
        }
    })
});
}

module.exports = readPromise;
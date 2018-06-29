const fs = require('fs');
const asyncLib = require('async');
const targetDirectory = `C:\\Users\\ajshiff\\Documents\\git\\d2l-to-canvas\\unassociated-grade-items\\node_modules\\child-development-kit\\factory\\unzipped\\Conversion Test Gauntlet 1`;
const phrase = 'grade';
var fileArray = [];
var directoryArray = [];

function filesInDirectory (){
    // Rewrite this to edit existing array to give desired results using array methods.
    fs.readdir(targetDirectory, function(err, files){
        if (err){
            console.log('Something went wrong!\n' + err)
        } else {
            files.forEach(function(file){
                if(file.includes('.')) {
                    fileArray.push(file);
                } else {
                    directoryArray.push(file);
                }
            });
        }
        
    });
}


function main (){
    filesInDirectory();
    console.log(fileArray);
    console.log(directoryArray);
}

main();
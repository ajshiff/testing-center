/********************************************************************
 * 
 * 
 * 
 * 
 * 
 ********************************************************************/

// DECLARE DEPENDENCIES AND CONSTANTS
const fs = require('fs');
const d3 = require('d3-dsv');
// const dsv_location = 'C:\\Users\\ajshiff\\Documents\\git\\d3-countries-map\\src\\copy-of-countries.csv';
const dsv_location = process.argv[2];
var outputLocation = process.argv[3];
var outputName = process.argv[4];

/********************************************************************
 * 
 ********************************************************************/
const checkUserVariables = function () {
    let err;
    let doNotContinue = false;
    // console.log(fs.accessSync(dsv_location));
    // CHECK ARGUEMENT 1
    if (!fs.existsSync(dsv_location)) {
        err = 'That File Might Not Exist!';
        doNotContinue = true
    } 
    else if (dsv_location.slice(-4) !== '.csv') {
        err = 'This Program Requires a .csv File-Type!';
        doNotContinue = true
    }
    if(doNotContinue){process.exit(console.log(err));}

    // CHECK ARGUEMENT 2
    if(!process.argv[3]) {outputLocation = './'}
    // console.log(outputLocation.slice(-1));
    // if(outputLocation.slice(-1) !== '/' || outputLocation.slice(-1) !== '\\'){
    //     err = 'It looks like your output location is not a directory. Try Again.';
    //     doNotContinue = true;
    // }
    if(doNotContinue){process.exit(console.log(err));}
    // CHECK ARGUEMENT 3
    if(!process.argv[4]) {outputName = 'new.csv'}
    if(outputName.slice(-4) !== '.csv'){outputName += '.csv';}
    
    // console.log(dsv_location.slice(-4));
    // console.log(dsv_location + '\n' + outputLocation + '\n' + outputName + '\n');
}

/********************************************************************
 * conversionSeries() takes a d3-dsv input variable and runs it
 * through a series of loops to change the data into dummy-information
 * while still maintaining the same length and structure of the original
 * data-set. It returns the new dummy data-set.
 ********************************************************************/
const conversionSeries = function (data) {
    var newData;
    // let columnCounter = 0
    data.columns.forEach(column => {
        let rowCounter = 0;
        newData = data.map(value => {
            let returnValue = '';
            // console.log(value[column]);
            if (value[column].toLowerCase() !== 'no data'){
                returnValue = column + '_name_' + rowCounter;
            } else {
                returnValue = value[column]+ '_' + column + '_' + rowCounter;
            }
            rowCounter += 1;
            // console.log(newData);
            return returnValue;
        });
        // columnCounter += 1;
        data.forEach((row, index) => {
            row[column] = newData[index];
        });
    });
    // console.log(data);
    return data;
}

/********************************************************************
 * 
 ********************************************************************/
const createCSV = function (dummyData) {
    var output = '';
    dummyData.columns.forEach( (column) => {
        output += (column + ',');
    });
    // output += '\n';
    dummyData.forEach( (row) => {
        output += '\n';
            dummyData.columns.forEach( (column) => {
                output += row[column] + ',';
            });
        output = output.slice(0,-1);
    });
    // console.log(output);
    return output;
}

/********************************************************************
 * 
 ********************************************************************/
const exportCSV = function (exportData) {
    fileOpenError = { 
        errno: -4082,
        code: 'EBUSY',
        syscall: 'open'
    }
    fs.writeFile(outputLocation + outputName, exportData, function(err){
        if (err) {
            if (err.errno === -4082 || err.code === 'EBUSY') {
                console.error('You need to close this file before you can overwrite its contents.')
            } else{
                console.error('Something Definitely Went Wrong: ');
                console.error(err);
            }
        } else {
            console.log('Successfully Output new file: ' + outputName);
        }
    });
}


/********************************************************************
 * 
 ********************************************************************/
function main () {
    checkUserVariables();
    const csvData = fs.readFileSync(dsv_location, 'utf-8');
    // console.log(csvData);
    var data = d3.csvParse(csvData);
    // console.log(data);
    var dummyData = conversionSeries(data);
    // console.log(dummyData);
    var exportData = createCSV(dummyData);
    // console.log(exportData);
    exportCSV(exportData);
}

main();
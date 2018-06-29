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
    //DECLARE LOCAL VARIABLES
    let err;
    let doNotContinue = false;

    // CHECK ARGUEMENT 1
    if (!dsv_location) {
        err = 'Enter the full path to the initial .csv file.';
        doNotContinue = true;
    } else if (!fs.existsSync(dsv_location)) {
        err = 'That File Might Not Exist!';
        doNotContinue = true;
    } 
    else if (dsv_location.slice(-4) !== '.csv') {
        err = 'This Program Requires a .csv File-Type!';
        doNotContinue = true;
    } 
    if (doNotContinue){process.exit(console.log(err));}

    // CHECK ARGUEMENT 2
    if (!outputLocation) {outputLocation = './'}
    if (!fs.existsSync(outputLocation)) {
        err = 'It looks like your output location is not an existing directory. Try Again.';
        doNotContinue = true;
    }
    if(doNotContinue){process.exit(console.log(err));}

    // CHECK ARGUEMENT 3
    if(!process.argv[4]) {outputName = 'new.csv'}
    if(outputName.slice(-4) !== '.csv'){outputName += '.csv';}
    
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
    fs.writeFile(outputLocation + outputName, exportData, function(err){
        if (err) {
            if (err.errno === -4082 || err.code === 'EBUSY') {
                console.error('Close the existing file before you can overwriting its contents.');
            } else if (err.errno === -4058 || err.code === 'ENOENT') {
                console.error('It looks like your target directory doesn\'t exist.')
            }else{
                console.error('Something Definitely Went Wrong: ');
            }
            console.error(err);
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
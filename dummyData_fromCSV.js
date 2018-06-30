/********************************************************************
 * dummyData_fromCSV.js
 * Creates a .csv file based on an existing .csv file, but replaces all
 * initial values with dummy-placeholder information. The column values
 * and number of rows is maintained during conversion.
 * The End result is a new .csv file populated with dummy-data.
 * 
 * USAGE: 
 * > node ./dummyData_fromCSV.js <dsv_location> [new_dsv_location] [new_dsv_name]
 ********************************************************************/

// DECLARE DEPENDENCIES AND CONSTANTS
const fs = require('fs');
const d3 = require('d3-dsv');
const dsv_location = process.argv[2];
var outputLocation = process.argv[3];
var outputName = process.argv[4];

/********************************************************************
 * checkUserVariables() checks the command-line user input to determine
 * whether the program can complete the task with the information given
 * by the user and terminates with an error if it can't. It also sets
 * default values for the outputLocation and outputName if either
 * isn't specified.
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
    if (!outputLocation) {
        outputLocation = './';
    } else if (!fs.existsSync(outputLocation)) {
        err = 'It looks like your output location is not an existing directory. Try Again.';
        doNotContinue = true;
    } else if (outputLocation.slice(-4) === '.csv') {
        err = 'Make the name of the new file the 3rd arguement.';
        doNotContinue = true;
    } else if (!outputLocation.endsWith('/') || !outputLocation.endsWith('\\')) {
        outputLocation += '/';
    }
    if (doNotContinue) {process.exit(console.log(err));}
    
    // CHECK ARGUEMENT 3
    if (!outputName) {outputName = 'new.csv'}
    else if (outputName.slice(-4) !== '.csv') {outputName += '.csv';}
    
}

/********************************************************************
 * conversionSeries() takes a d3-dsv input variable and runs it
 * through a series of loops to change the data into dummy-information
 * while still maintaining the same length and structure of the original
 * data-set. It returns the new dummy data-set.
 ********************************************************************/
const conversionSeries = function (data) {
    var newData;
    data.columns.forEach(column => {
        let rowCounter = 0;
        // Collect dummy data one column at a time
        newData = data.map(() => {
            let returnValue = column + '_name_' + rowCounter;
            rowCounter += 1;
            return returnValue;
        });
        // Overwrite the existing data input with dummy data from newData variable.
        data.forEach((row, index) => {
            row[column] = newData[index];
        });
    });
    return data;
}

/********************************************************************
 * createCSV takes a piece of data with the same structure as 
 * d3.csv() would return, then reformats it back into a .csv format.
 * It returns the .csv formatted string.
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
    return output;
}

/********************************************************************
 * exportCSV() takes a string in writes that string to a .csv document 
 * at target location (determined by command-line input). 
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
 * The core of the program. Runs everything in order, ultimately producing
 * a .csv populated with dummy-data based on the original .csv.
 ********************************************************************/
function main () {
    checkUserVariables();
    const csvData = fs.readFileSync(dsv_location, 'utf-8');
    var data = d3.csvParse(csvData);
    var dummyData = conversionSeries(data);
    var exportData = createCSV(dummyData);
    exportCSV(exportData);
}

main();
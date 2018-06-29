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
const dsv_location = 'C:\\Users\\ajshiff\\Documents\\git\\d3-countries-map\\src\\copy-of-countries.csv';

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
    console.log(output);
    return output;
}

/********************************************************************
 * 
 ********************************************************************/
const exportCSV = function (exportData) {
    
}


/********************************************************************
 * 
 ********************************************************************/
function main () {
    const csvData = fs.readFileSync(dsv_location, 'utf-8');
    console.log(csvData);
    var data = d3.csvParse(csvData);
    // console.log(data);
    var dummyData = conversionSeries(data);
    // console.log(dummyData);
    var exportData = createCSV(dummyData);
    // console.log(exportData);
    exportCSV(exportData);
}

main();
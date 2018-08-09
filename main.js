// Required libraries
const IOTA = require('iota.lib.js');
const SQLite3 = require('sqlite3');

// Required app components
const entryPoint = require('./entryPoint');
const rightsManager = require('./rightsManager');
const sensor = require('./sensor');
global.mam = require('./mam');
global.buyer = require('./buyer');
global.seller = require('./seller');

// Global APIs
global.iota = new IOTA({ provider: 'https://node.iota.moe:443' });
global.db = new SQLite3.Database('log.db');

// Global variables
global.myPort = 81;
global.myName = 'http://localhost:' + myPort;
global.mySeed = 'COQLKSDWGGSWQNCVYALRIXPNSGNZ9IAJDHMCTPDLRWBXXCJRPACTLIRXP9DJNQNFOOYVI9LAYDHJDIHNW';
global.minWeightMagnitude = 14;
global.depth = 3;

// Init app
exports.init = function () {
    iota.api.getNewAddress(mySeed, { 'returnAll': true }, function (error, addresses) {
        if (error) {
            console.error(error);
        } else {
            global.addressIndex = addresses.length - 1;
            entryPoint.run();
            rightsManager.run();
            sensor.run();
        }
    });
}

// Useful function for sending transfers
/*global.doPromotes = function (transactionHash, currentHash) {
    for (let index = 0; index < 3; index++) {
        iota.api.getLatestInclusion([transactionHash], function (error, included) {
            if (error) {
                console.error(error);
            } else if (included[0]) {
                console.log('Transaction confirmed');
                console.log('--------------------------------');
                process.exit();
            }
        });
        iota.api.promoteTransaction(
            currentHash, depth, minWeightMagnitude,
            [{ 'address': '9'.repeat(81), 'value': 0 }],
            { 'delay': 0 },
            function (error, promote) {
                if (error) {
                    console.error(error);
                } else {
                    let promoteHash = promote[0].hash;
                    console.log('Promote:', promoteHash);
                    doPromotes(transactionHash, promoteHash);
                }
            }
        );
    }
}*/

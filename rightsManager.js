// Required libraries
const Mam = require('mam.client.js');
const TimerJob = require('timerjobs').TimerJobs;
const request = require('request-promise');

// Periodic function
function manageRights(done) {
    // Get all inputs (balances) of the main seed ==> result
    iota.api.getInputs(mySeed, function (error, result) {
        if (error) {
            console.error(error);
            done();
        } else {
            // Get all pending sales stored
            db.all('SELECT * FROM Sales;', async function (error, sales) {
                if (error) {
                    console.error(error);
                    done();
                } else {
                    // For each pending sale
                    for (let sale of sales) {
                        // If an existing input corresponds to the sale
                        if (result.inputs.find(i => i.address == sale.address && i.balance == sale.value)) {
                            await sendAccess(sale);
                            console.log('--------------------------------');
                        }
                    }
                }
            });
            done();
        }
    });
}

function sendAccess(sale) {
    // Printing sale infos
    console.log('Sale confirmed:');
    console.log(sale);
    // Creating new stream with new random seed associated
    console.log('Creating new stream...');
    let mamState = Mam.init(iota);
    mamState = Mam.changeMode(mamState, 'private');
    // Sending stream to buyer
    console.log('Sending stream\'s root to buyer...');
    sale.root = Mam.getRoot(mamState)
    return request({
        url: sale.to,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        json: sale,
        resolveWithFullResponse: true
    }).then(function (response) {
        console.log(`Status: ${response.statusCode} - ${response.statusMessage}`);
        console.log('Closing sale...');
        db.run('INSERT INTO Streams VALUES (?, ?, ?);', mamState.seed, sale.amount, 0);
        db.run('DELETE FROM Sales WHERE "address" = ?;', sale.address);
    }).catch(function (response) {
        if (response.statusCode) {
            console.log(`Status: ${response.statusCode} - ${response.response.statusMessage}`);
            console.error(`Error ${response.statusCode}, keeping sale stored...`);
        } else {
            console.error(response.error);
            console.error('No response, keeping sale stored...');
        }
    });
}

// Run this component
exports.run = function () {
    const timer = new TimerJob({ autoStart: true, interval: 5000, immediate: true, ignoreErrors: true, infinite: true }, manageRights);
    console.log('Rights manager running...');
    console.log('--------------------------------');
}

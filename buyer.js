const request = require('request');

exports.run = function () {

    const targetName = 'http://localhost:82';

    const purchase = {
        item: 'tpg1',
        amount: 1,
        from: targetName + '/info',
        to: myName + '/post',
        timestamp: Math.floor(Date.now() / 1000)
    }

    request({
        url: targetName + '/buy',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        json: purchase,
        resolveWithFullResponse: true
    }, function (error, response, body) {
        if (error) {
            console.error(error);
            console.error('No response, canceling...');
        } else {
            let purchase = body;
            console.log('--------------------------------');
            console.log('Request purchase:', purchase.from);
            console.log(`Status: ${response.statusCode} - ${response.statusMessage}`);
            if (response.statusCode < 200 || response.statusCode >= 300) {
                console.error(`Error ${response.statusCode}, canceling...`);
            } else {
                console.log('Purchase:');
                console.log(purchase);
                console.log('Saving...');
                db.run('INSERT INTO Purchases VALUES (?,?,?,?,?,?,?);', purchase.item, purchase.amount, purchase.from, purchase.to, purchase.timestamp, purchase.address, purchase.value);
                console.log('--------------------------------');
                console.log(`Sending ${purchase.value} to ${purchase.address}...`);
                iota.api.sendTransfer(mySeed, depth, minWeightMagnitude, [{ 'address': purchase.address, 'value': parseInt(purchase.value) }], function (error, transaction) {
                    if (error) {
                        console.error(error);
                    } else {
                        let transactionHash = transaction[0].hash;
                        console.log('Transaction sent:', transactionHash);
                        console.log('--------------------------------');
                        //console.log('Sending promotes...');
                        //doPromotes(transactionHash, transactionHash);
                    }
                });
            }        
        }
    });

}

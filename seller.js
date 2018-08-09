const request = require('request');

exports.run = function () {

    const targetName = 'http://localhost:82';

    iota.api.getNewAddress(mySeed, { 'index': addressIndex }, function (error, address) {
        const sale = {
            item: 'position',
            amount: 10,
            from: myName + '/info',
            timestamp: Math.floor(Date.now() / 1000),
            address: address,
            value: 10
        }
        
        request({
            url: targetName + '/sell',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            json: sale,
            resolveWithFullResponse: true
        }, function (error, response, body) {
            if (error) {
                console.error(error);
                console.error('No response, canceling...');
            } else {
                let sale = body;
                console.log('--------------------------------');
                console.log('Request sale:', sale.to);
                console.log(`Status: ${response.statusCode} - ${response.statusMessage}`);
                if (response.statusCode < 200 && response.statusCode >= 300) {
                    console.error(`Error ${response.statusCode}, canceling...`);
                } else {
                    console.log('Sale:');
                    console.log(sale);
                    console.log('Saving...');
                    db.run('INSERT INTO Sales VALUES (?,?,?,?,?,?,?);', sale.item, sale.amount, sale.from, sale.to, sale.timestamp, sale.address, sale.value);
                    console.log('--------------------------------');
                }        
            }
        });
    });

}

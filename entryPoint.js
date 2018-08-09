// Required libraries
const express = require('express');
const bodyParser = require('body-parser');

// Init libraries
const app = express();
app.use(bodyParser.json());

// GET Infos
app.get('/info', function (request, response) {
    iota.api.getNodeInfo(function (error, infos) {
        if (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.write(error.toString());
        } else {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(infos));
        }
        response.end();
    });
})

// POST Sale
app.post('/buy', function (request, response) {
    let thisIndex = addressIndex;
    addressIndex++;
    iota.api.getNewAddress(mySeed, { 'index': thisIndex }, function (error, address) {
        if (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.write(error.toString()); 
        } else {
            // Attach new address to tangle
            iota.api.sendTransfer(mySeed, depth, minWeightMagnitude, [{ 'address': address, 'value': 0 }], (error) => {if(error) console.error(error)});
            let sale = request.body;
            sale.address = address;
            sale.value = sale.amount;
            console.log('Received sale:');
            console.log(sale);
            console.log('Saving...');
            db.run('INSERT INTO Sales VALUES (?,?,?,?,?,?,?);', sale.item, sale.amount, sale.from, sale.to, sale.timestamp, sale.address, sale.value);
            console.log('Replying...');
            response.writeHead(202, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(sale));
            console.log('--------------------------------');
        }
        response.end();
    });
});

// POST Purchase
app.post('/sell', function (request, response) {
    let purchase = request.body;
    purchase.to = myName + '/post';
    console.log('Received purchase:');
    console.log(purchase);
    console.log('Saving...');
    db.run('INSERT INTO Purchases VALUES (?,?,?,?,?,?,?);', purchase.item, purchase.amount, purchase.from, purchase.to, purchase.timestamp, purchase.address, purchase.value);
    console.log('Replying...');
    response.writeHead(202, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(purchase));
    console.log(`Sending ${purchase.value} to ${purchase.address}...`);
    iota.api.sendTransfer(mySeed, depth, minWeightMagnitude, [{ 'address': purchase.address, 'value': parseInt(purchase.value) }], function (error, transaction) {
        if (error) {
            console.error(error);
        } else {
            let transactionHash = transaction[0].hash;
            console.log('Transaction sent:', transactionHash);
            console.log('--------------------------------');
            //console.log('Sending promotes...');
            //buyer.doPromotes(transactionHash, transactionHash);
        }
    });
    response.end();
});

// POST Stream
app.post('/post', function (request, response) {
    var subscription = request.body;
    console.log('Received subscription:');
    console.log(subscription);
    console.log('Saving...');
    db.run('INSERT INTO Subscriptions VALUES (?,?);', subscription.root, subscription.amount);
    console.log('--------------------------------');
    response.writeHead(201);
    response.end();
});

// Run this component
exports.run = function () {
    app.listen(myPort);
    console.log('--------------------------------');
    console.log('Entry point running...');
    console.log('Index:', addressIndex);
    console.log('Listening on:', myName)
    console.log('--------------------------------');
}

const Mam = require('mam.client.js');

exports.run = function () {
    let mamState = Mam.init(iota);
    mamState = Mam.changeMode(mamState, 'private');

    db.each('SELECT * FROM Subscriptions;', function (error, subscription) {
        Mam.fetch(subscription.root, 'private', null).then(function (stream) {
            console.log('--------------------------------');
            console.log('Reading subscriptions...')
            console.log('--------------------------------');
            console.log('Subscription:')
            console.log(subscription);
            console.log('Values:')
            for (let message of stream.messages) {
                console.log(JSON.parse(iota.utils.fromTrytes(message)));
            }
            console.log('--------------------------------');
        });
    });
}

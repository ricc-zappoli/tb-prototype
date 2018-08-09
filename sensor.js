// Required libraries
const Mam = require('mam.client.js');
const TimerJob = require('timerjobs').TimerJobs;
const crypto = require('crypto');

// Periodic function
function publishData (done) {
    data = {
        item: 'position',
        format: 'decimal degrees',
        value: (crypto.randomBytes(1)[0]/256*179-89) + ', ' + (crypto.randomBytes(1)[0]/256*359-179),
        timestamp: Math.floor(Date.now() / 1000)
    }
    trytes = iota.utils.toTrytes(JSON.stringify(data));
    db.each('SELECT * FROM Streams;', function (error, stream) {
        if (error) {
            console.error(error);
            done();
        } else {
            let mamState = Mam.init(iota, stream.seed);
            mamState = Mam.changeMode(mamState, 'private');
            mamState.channel.start = stream.index;
            let message = Mam.create(mamState, trytes);
            if (stream.index < stream.amount) {
                db.run('UPDATE Streams SET "index" = ? WHERE "seed" = ?;', stream.index+1, stream.seed);
            } else {
                db.run('DELETE FROM Streams WHERE "seed" = ?;', stream.seed);
            }
            Mam.attach(message.payload, message.address).then((result) => {
                console.log('Data published');
                console.log('Hash:', result[0].hash);
                console.log('Address:', result[0].address);
                console.log('Root:', message.root);
                console.log('--------------------------------');
            });
        }
    });
    done();
}

// Run this component
exports.run = function () {
    const timer = new TimerJob({ autoStart: true, interval: 60000, immediate: true, ignoreErrors: true, infinite: true }, publishData);
    console.log('Sensor running...');
    console.log('--------------------------------');
}

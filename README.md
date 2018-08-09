# tb-prototype
This is the prototype developed for my bachelor thesis.

It is an app of an automated and decentralized payment and resource dispatch system based on the IOTA cryptocurrency and its distributed ledger, the Tangle.

More information here: (in french).
## Prerequisites
### Full node
You need to use or run a full node in order to use IOTA.

Here is a good tutorial on how to run your own node: http://iota.partners/
### Node.js
The app use Node.js: https://nodejs.org/en/.
### Npm install
To install the needed packages, you need to run a `npm install` while in the root directory.
## Getting started
The app is replicable on different instances. 

First, you need to manually update the myPort, myName and mySeed variables in main.js. You should take different values for each instance.

Then, you can set whatever metadata you want in the payloads used by buyer.js and seller.js. Don't forget to adjust the destination names and ports accordingly of what you set just before.
### Run
To run the app, open a node.js command line console and run `require('./main.js').init();`.

The app is now idling, waiting for incoming requests.
### Request a purchase or a sale
You can initiate a purchase or a sale using `require('./buyer').run()` and `require('./seller').run()` respectively.
### Looking for bought data
You can see what's in subscribed streams using `require('./mam').run()`.

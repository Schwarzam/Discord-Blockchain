const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// const key = ec.genKeyPair();
// const publicKey = key.getPublic('hex');
// const privateKey = key.getPrivate('hex');

// console.log();
// console.log('Your public key (also your wallet address, freely shareable)\n', publicKey);

// console.log();
// console.log('Your private key (keep this secret! To sign transactions)\n', privateKey);


function randomizeInteger(min, max) {
  	if(max == null) {
    	max = (min == null ? Number.MAX_SAFE_INTEGER : min);
      	min = 0;
    }

    min = Math.ceil(min);  // inclusive min
    max = Math.floor(max); // exclusive max

  	if(min > max - 1) {
    	throw new Error("Incorrect arguments.");
    }

    return min + Math.floor((max - min) * Math.random());
}



module.exports.randomizeInteger = randomizeInteger;
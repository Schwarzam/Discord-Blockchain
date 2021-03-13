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
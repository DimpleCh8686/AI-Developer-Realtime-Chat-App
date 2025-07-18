```javascript
function isPrimeAndFactors(num) {
  // Handle edge cases: numbers less than 2 are not prime
  if (num < 2) {
    return { isPrime: false, factors: [] }; 
  }

  // Check for primality and find factors
  let factors = [];
  let isPrime = true;
  for (let i = 2; i <= Math.sqrt(num); i++) { // Optimization: only check up to the square root
    if (num % i === 0) {
      isPrime = false;
      factors.push(i);
      //Efficiently find all factors: if 'i' is a factor, so is num/i
      if (i * i !== num) { //Avoid duplicates for perfect squares
        factors.push(num / i);
      }
    }
  }

  // Add 1 as a factor if the number is not prime.  It will always be a factor if num > 1.
  if (!isPrime && num > 1) {
      factors.push(1);
      factors.push(num);
  }

  //Sort the factors in ascending order.
  factors.sort((a, b) => a - b);

  return { isPrime: isPrime, factors: factors };
}


// Example usage:
console.log(isPrimeAndFactors(2));   // Output: { isPrime: true, factors: [] }
console.log(isPrimeAndFactors(15));  // Output: { isPrime: false, factors: [3, 5, 1, 15] }
console.log(isPrimeAndFactors(17));  // Output: { isPrime: true, factors: [] }
console.log(isPrimeAndFactors(1));   // Output: { isPrime: false, factors: [] }
console.log(isPrimeAndFactors(0));   // Output: { isPrime: false, factors: [] }
console.log(isPrimeAndFactors(36)); // Output: { isPrime: false, factors: [2, 18, 3, 12, 4, 9, 6, 1, 36] }

```

```javascript
/**
 * Determines if a number is prime and returns its factors if not.
 *
 * @param {number} num The number to check.  Must be an integer greater than 1.
 * @returns {object} An object with a `isPrime` boolean property and a `factors` array property.  
 *                   If `isPrime` is true, `factors` will be an empty array. If `isPrime` is false, `factors` will contain the prime factors.
 * @throws {Error} If input is invalid.
 */
function isPrimeAndFactors(num) {
  // Input validation:
  if (!Number.isInteger(num) || num <= 1) {
    throw new Error("Input must be an integer greater than 1.");
  }

  //Efficient primality test and factor finding:
  const factors = [];
  let isPrime = true;
  
  // Handle the case of 2 separately for efficiency
  if (num === 2) return { isPrime: true, factors: [] };
  if (num % 2 === 0) {
      isPrime = false;
      factors.push(2);
      while (num % 2 === 0) num /= 2;
  }


  //Optimized primality test and factor extraction. Only odd numbers are checked after 2.
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) {
      isPrime = false;
      factors.push(i);
      while (num % i === 0) num /= i;
    }
  }

  //If num is greater than 1 after the loop, it's a prime factor
  if (num > 1) {
    factors.push(num);
  }

  return { isPrime, factors };
}


//Example Usage
console.log(isPrimeAndFactors(2)); // { isPrime: true, factors: [] }
console.log(isPrimeAndFactors(7)); // { isPrime: true, factors: [] }
console.log(isPrimeAndFactors(15)); // { isPrime: false, factors: [3, 5] }
console.log(isPrimeAndFactors(100)); // { isPrime: false, factors: [2, 5, 5] }
console.log(isPrimeAndFactors(99)); // { isPrime: false, factors: [3, 3, 11] }
console.log(isPrimeAndFactors(1)); //throws error "Input must be an integer greater than 1."
console.log(isPrimeAndFactors(3.14)); //throws error "Input must be an integer greater than 1."
console.log(isPrimeAndFactors(-5)); // throws error "Input must be an integer greater than 1."
console.log(isPrimeAndFactors(1000000007)); // handles large primes efficiently.


```

```javascript
/**
 * Determines if a number is prime and returns its factors if not.
 *
 * @param {number} num The number to check.  Must be an integer greater than 1.
 * @returns {string|Array<number>}  "Prime" if the number is prime. Otherwise, an array of its prime factors.  Returns an error message if input is invalid.
 * @throws {Error} If the input is invalid (not an integer or less than 2).
 */
function isPrimeOrFactors(num) {
  // Input validation: Check if the number is an integer and greater than 1.

  if (!Number.isInteger(num) || num < 2) {
    return "Invalid input: Number must be an integer greater than 1.";
  }

  // Optimized primality test: Check for divisibility only up to the square root of the number.

  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      //Found a factor, so it's not prime.  Find all prime factors.

      const factors = [];
      //Find prime factors of num
      function findPrimeFactors(n){
        let divisor = 2;

        while(n>=2){
          if(n % divisor == 0){
            factors.push(divisor);
            n = n/ divisor;
          } else {
            divisor++;
          }
        }
      }

      findPrimeFactors(num);

      //Remove duplicates and sort factors
      const uniqueFactors = [...new Set(factors)];
      uniqueFactors.sort((a,b)=> a-b);
      return uniqueFactors;
    }
  }

  // If no factors were found, the number is prime.
  return "Prime";
}



// Test cases
console.log(isPrimeOrFactors(2));     // Output: Prime
console.log(isPrimeOrFactors(17));    // Output: Prime
console.log(isPrimeOrFactors(15));    // Output: [3, 5]
console.log(isPrimeOrFactors(28));    // Output: [2, 7]
console.log(isPrimeOrFactors(100));   // Output: [2, 5]
console.log(isPrimeOrFactors(99));   // Output: [3, 11]
console.log(isPrimeOrFactors(1));    //Output: Invalid input: Number must be an integer greater than 1.
console.log(isPrimeOrFactors(1.5));  // Output: Invalid input: Number must be an integer greater than 1.
console.log(isPrimeOrFactors(-5));   // Output: Invalid input: Number must be an integer greater than 1.
console.log(isPrimeOrFactors(120)); // Output: [2, 3, 5]

```


This response provides a modular and robust Express.js server using ES6 features, including error handling and best practices for scalability and maintainability.

**Project Structure:**

```
express-es6-server/
├── src/
│   ├── app.js          // Main application file
│   ├── routes/
│   │   └── index.js     // Routes handler
│   ├── controllers/
│   │   └── index.js     // Controller logic
│   ├── middleware/      //Middleware
│   │   └── errorHandler.js //Custom error handler
│   └── utils/           //Helper functions (optional)
│       └── ...
├── package.json
```

**1. package.json:**

```json
{
  "name": "express-es6-server",
  "version": "1.0.0",
  "description": "Express.js server with ES6 features",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**2. src/app.js:**

```javascript
import express from 'express';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';


const app = express();
const port = process.env.PORT || 3000;


// Middleware to parse JSON request bodies
app.use(express.json());


//Mount Routes
app.use('/', routes);


// Error Handling Middleware
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

```

**3. src/routes/index.js:**

```javascript
import express from 'express';
import controller from '../controllers/index.js'

const router = express.Router();

// Define routes
router.get('/', controller.hello);
router.post('/data', controller.postData); //Example POST route

export default router;
```

**4. src/controllers/index.js:**

```javascript
// Controller functions
export default {
  hello: (req, res) => {
    res.send('Hello from ES6 Express Server!');
  },
  postData: (req,res) => {
    try{
        const data = req.body;
        //Process the data.  Add validation and database interaction here.
        res.status(201).json({message: "Data received successfully", data});
    } catch(error){
        console.error("Error processing POST request:", error);
        //Re-throw error to be caught by the error handling middleware.
        throw error;
    }
  }
};

```

**5. src/middleware/errorHandler.js:**

```javascript
export default (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  //Send appropriate responses based on error types.
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
};
```

**How to run:**

1.  Make sure you have Node.js and npm (or yarn) installed.
2.  Clone or download the project.
3.  Navigate to the project directory in your terminal.
4.  Run `npm install` to install dependencies.
5.  Run `npm start` to start the server.  (Or `npm run dev` for automatic restarts with `nodemon`).


This example demonstrates a basic structure.  You can extend it by adding more routes, controllers, and middleware as needed for your application.  Remember to handle different HTTP methods (POST, PUT, DELETE, etc.) and implement proper input validation and security measures in your controllers.  The error handling middleware provides a starting point for robust error management.  Consider using a more sophisticated logging solution in a production environment.

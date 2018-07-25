const bcrypt = require('bcrypt');

// Each round of hashing doubles the cost of hashing. 12 is generally recommended level these days.
const SALT_ROUNDS = 12;
const password = 'Sup3rSecur3';

// generate a salt for password hashing
bcrypt.genSalt(SALT_ROUNDS)
  .then( salt => {
    return bcrypt.hash(password, salt);
  })
  .then( hashedPassword => {
    // save hashed password to db
    console.log(hashedPassword);
  });

function compare(plainTextPassword, hashedPassword) {
  bcrypt.compare(plainTextPassword, hashedPassword)
    .then( matches => {
      // matches will be true if plain text password is the same as hashedPassword once it has been hashed.
      console.log(matches);
    });
}

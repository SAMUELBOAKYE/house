const bcrypt = require('bcryptjs');

async function createHash() {
  const hash = await bcrypt.hash('123456', 12);
  console.log(hash);
}

createHash();

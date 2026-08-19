const bcrypt = require("bcryptjs");

const plainPassword = "Welcome@123";

bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.log("Error:", err);
        return;
    }

    console.log("Original Password:", plainPassword);
    console.log("Hashed Password:");
    console.log(hash);
});
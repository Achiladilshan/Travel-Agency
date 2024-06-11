const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../Config/db');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { authGuard } = require('../utils/validator');
const { sendmail } = require('../services/SendEmail');

const router = express.Router();


router.post('/registerCustomer', (req, res) => {
    const { Password, FirstName, LastName, Email, PhoneNumber, Role, Country } = req.body;

    // Hash password
    if (Role != "Customer" && Role != "customer") {
        res.status(400).send('Role Error');
        return;
    }
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Check if username, NIC, email, and phone number already exist
        connection.query('SELECT * FROM User WHERE Email = ? OR PhoneNumber = ?', [Email, PhoneNumber], (err, rows) => {
            if (err) {
                console.error('Error querying MySQL database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (rows.length > 0) {
                const existingFields = rows[0];
                let errors = {};

                if (existingFields.Email === Email) {
                    errors.Email = 'Email already exists';
                }

                if (existingFields.PhoneNumber === PhoneNumber) {
                    errors.PhoneNumber = 'Phone number already exists';
                }

                res.status(400).json({ error: 'Fields already exist', errors });
                return;
            }

            // Insert new user into database with hashed password
            connection.query('INSERT INTO User (FirstName, LastName, Email, PhoneNumber, Password, Role) VALUES (?, ?, ?, ?, ?, ?)',
                [FirstName, LastName, Email, PhoneNumber, hashedPassword, Role],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting into MySQL database:', err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    connection.query('INSERT INTO Customer (UserId, Country) VALUES (?, ?)', [result.insertId, Country], (err, result) => {
                        if (err) {
                            console.error('Error inserting into MySQL database:', err);
                            res.status(500).send('Internal Server Error');
                            return;
                        }
                        const currentURL = req.protocol + '://' + req.get('host') + req.originalUrl;
                        const loginURL = currentURL + '/login';
                        sendmail(Email, "Welcome to SWEN Tours & Travels", `You have been registered as a Customer. \nPlease login to your account to view your profile and update your details.\n\n${loginURL}`);
                        res.status(201).json({ message: 'Customer registered successfully' });
                    });
                });


        });
    });
});


router.post('/registerGuide', (req, res) => {
    const { Password, FirstName, LastName, Email, PhoneNumber, Role, Languages, GuiType, Qualifications, VehicleType, VehicleMake, Capacity, VehicleNumber, Description } = req.body;
    if (Role != "Guide") {
        res.status(400).send('Role Error');
        return;
    }
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Check if email and phone number already exist
        connection.query('SELECT * FROM User WHERE Email = ? OR PhoneNumber = ?', [Email, PhoneNumber], (err, userRows) => {
            if (err) {
                console.error('Error querying MySQL database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (userRows.length > 0) {
                const existingUser = userRows[0];
                let errors = {};

                if (existingUser.Email === Email) {
                    errors.Email = 'Email already exists';
                }

                if (existingUser.PhoneNumber === PhoneNumber) {
                    errors.PhoneNumber = 'Phone number already exists';
                }

                res.status(400).json({ error: 'Fields already exist', errors });
                return;
            }

            // Check if vehicle number already exists
            connection.query('SELECT * FROM Vehicle WHERE VehicleNumber = ?', [VehicleNumber], (err, vehicleRows) => {
                if (err) {
                    console.error('Error querying MySQL database:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                if (vehicleRows.length > 0) {
                    res.status(400).json({ error: 'Vehicle number already exists' });
                    return;
                }

                // Insert user details into the User table
                connection.query('INSERT INTO User (FirstName, LastName, Email, PhoneNumber, Password, Role) VALUES (?, ?, ?, ?, ?, ?)',
                    [FirstName, LastName, Email, PhoneNumber, hashedPassword, Role],
                    (err, userResult) => {
                        if (err) {
                            console.error('Error inserting into User table:', err);
                            res.status(500).send('Internal Server Error');
                            return;
                        }

                        // Insert vehicle details into the Vehicle table
                        connection.query('INSERT INTO Vehicle (Type, Make, Capacity, VehicleNumber, Description) VALUES (?, ?, ?, ?, ?)',
                            [VehicleType, VehicleMake, Capacity, VehicleNumber, Description],
                            (err, vehicleResult) => {
                                if (err) {
                                    console.error('Error inserting into Vehicle table:', err);
                                    res.status(500).send('Internal Server Error');
                                    return;
                                }

                                // Associate vehicle with the guide
                                connection.query('INSERT INTO Guide (UserID, VehicleID, Languages, GuiType, Qualifications) VALUES (?, ?, ?, ?, ?)',
                                    [userResult.insertId, vehicleResult.insertId, Languages, GuiType, Qualifications],
                                    (err, guideResult) => {
                                        if (err) {
                                            console.error('Error inserting into Guide table:', err);
                                            res.status(500).send('Internal Server Error');
                                            return;
                                        }
                                        sendmail(Email, "Welcome to Travel Management System", "You have been registered as a guide in Travel Management System. Please login to your account to view your profile and update your details.");
                                        res.status(201).json({ message: 'Guide registered successfully' });
                                    });
                            });
                    });
            });
        });
    });
});


router.post('/registerStaff', (req, res) => {
    const { Password, FirstName, LastName, Email, PhoneNumber, Role } = req.body;
    if (Role != "Staff" ) {
        res.status(400).send('Role Error');
        return;
    }
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Check if username, NIC, email, and phone number already exist
        connection.query('SELECT * FROM User WHERE Email = ? OR PhoneNumber = ?', [Email, PhoneNumber], (err, rows) => {
            if (err) {
                console.error('Error querying MySQL database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (rows.length > 0) {
                const existingFields = rows[0];
                let errors = {};

                if (existingFields.Email === Email) {
                    errors.Email = 'Email already exists';
                }

                if (existingFields.PhoneNumber === PhoneNumber) {
                    errors.PhoneNumber = 'Phone number already exists';
                }

                res.status(400).json({ error: 'Fields already exist', errors });
                return;
            }
            connection.query('INSERT INTO User (FirstName, LastName, Email, PhoneNumber, Password, Role) VALUES (?, ?, ?, ?, ?, ?)',
                [FirstName, LastName, Email, PhoneNumber, hashedPassword, Role],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting into MySQL database:', err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    res.status(201).json({ message: 'Staff registered successfully' });
                });

        });
    });
});


router.post('/registerAdmin', (req, res) => {
    const { Password, FirstName, LastName, Email, PhoneNumber, Role } = req.body;
    if (Role != "Admin") {
        res.status(400).send('Role Error');
        return;
    }
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Check if username, NIC, email, and phone number already exist
        connection.query('SELECT * FROM User WHERE Email = ? OR PhoneNumber = ?', [Email, PhoneNumber], (err, rows) => {
            if (err) {
                console.error('Error querying MySQL database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (rows.length > 0) {
                const existingFields = rows[0];
                let errors = {};

                if (existingFields.Email === Email) {
                    errors.Email = 'Email already exists';
                }

                if (existingFields.PhoneNumber === PhoneNumber) {
                    errors.PhoneNumber = 'Phone number already exists';
                }

                res.status(400).json({ error: 'Fields already exist', errors });
                return;
            }
            connection.query('INSERT INTO User (FirstName, LastName, Email, PhoneNumber, Password, Role) VALUES (?, ?, ?, ?, ?, ?)',
                [FirstName, LastName, Email, PhoneNumber, hashedPassword, Role],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting into MySQL database:', err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    res.status(201).json({ message: 'Admin registered successfully' });
                });

        });
    });
});


router.get('/', (req, res) => {
    connection.query(`SELECT 
                        User.*, 
                        Customer.Country,
                        Guide.Languages,
                        Guide.GuiType,
                        Guide.Qualifications,
                        Vehicle.Type AS VehicleType,
                        Vehicle.Make AS VehicleMake,
                        Vehicle.Capacity AS Capacity,
                        Vehicle.VehicleNumber,
                        Vehicle.Description AS Description
                    FROM 
                        User
                    LEFT JOIN 
                        Customer ON User.UserID = Customer.UserID
                    LEFT JOIN 
                        Guide ON User.UserID = Guide.UserID
                    LEFT JOIN 
                        Vehicle ON Guide.VehicleID = Vehicle.VehicleID
                    WHERE 
                        User.Status = "Active";
`, (err, rows) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        rows.map((row) => {
            delete row.Password;
        });
        res.status(200).json(rows);
    });
});


router.get('/getUserByID/:UserId', (req, res) => {
    const UserId = req.params.UserId;
    connection.query('SELECT * FROM User WHERE UserId = ?', [UserId], (err, rows) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (rows.length === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json(rows[0]);
    });
});

// router.delete('/deleteUser/:UserId', authGuard, (req, res) => {
//     const UserId = req.params.UserId;
//     connection.query('SELECT * FROM User WHERE UserId = ?', [UserId], (err, rows) => {
//         if (err) {
//             console.error('Error querying MySQL database:', err);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         if (rows.length === 0) {
//             res.status(404).send('User not found');
//             return;
//         }
//         if (rows[0].Role == "Guide" || rows[0].Role == "guide") {
//             connection.query('DELETE FROM Guide WHERE UserId = ?', [UserId], (err, result) => {
//                 if (err) {
//                     console.error('Error deleting from MySQL database:', err);
//                     res.status(500).send('Internal Server Error');
//                     return;
//                 }
//             });
//         }
//         if (rows[0].Role == "Customer" || rows[0].Role == "customer") {
//             connection.query('DELETE FROM Customer WHERE UserId = ?', [UserId], (err, result) => {
//                 if (err) {
//                     console.error('Error deleting from MySQL database:', err);
//                     res.status(500).send('Internal Server Error');
//                     return;
//                 }
//             });
//         }
//         if (rows[0].Role == "Staff" || rows[0].Role == "staff") {
//             connection.query('DELETE FROM Staff WHERE UserId = ?', [UserId], (err, result) => {
//                 if (err) {
//                     console.error('Error deleting from MySQL database:', err);
//                     res.status(500).send('Internal Server Error');
//                     return;
//                 }
//             });
//         }
//         connection.query('DELETE FROM User WHERE UserId = ?', [UserId], (err, result) => {
//             if (err) {
//                 console.error('Error deleting from MySQL database:', err);
//                 res.status(500).send('Internal Server Error');
//                 return;
//             }
//             res.status(200).json({ message: 'User deleted successfully' });
//         });


//     });

// });

router.delete('/deleteUser/:UserId', authGuard, (req, res) => {
    const UserId = req.params.UserId;
    connection.query('SELECT * FROM User WHERE UserId = ?', [UserId], (err, rows) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (rows.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        connection.query('UPDATE User SET Status = ? WHERE UserID = ?', ['Inactive', UserId], (err, result) => {
            if (err) {
                console.error('Error updating MySQL database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(200).json({ message: 'User Deleted successfully' });
        });
    });
});


// Get user count
router.get('/getUserCount', (req, res) => {
    connection.query('SELECT COUNT(*) AS count FROM User', (err, rows) => {
        if (err) {
            console.error('Error querying user count:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(rows[0]);
    });
});

router.get('/getGuideCount', (req, res) => {
    connection.query('SELECT COUNT(*) AS count FROM Guide', (err, rows) => {
        if (err) {
            console.error('Error querying guide count:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(rows[0]);
    });
});

router.get('/getGuideByUserID/:UserId', (req, res) => {
    const UserId = req.params.UserId;
    console.log("UserID", UserId);
    connection.query('SELECT * FROM Guide WHERE UserID = ?', [UserId], (err, rows) => {
        if (err) {
            console.error('Error querying guide count:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log(rows[0]);
        res.status(200).json(rows[0]);
    });
})

router.get('/getCustomerByUserID/:UserId', (req, res) => {
    const UserId = req.params.UserId;
    connection.query('SELECT * FROM Customer WHERE UserID = ?', [UserId], (err, rows) => {
        if (err) {
            console.error('Error querying guide count:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log(rows[0]);
        res.status(200).json(rows[0]);
    });
})

router.get('/getCustomerCount', (req, res) => {
    connection.query('SELECT COUNT(*) AS count FROM Customer', (err, rows) => {
        if (err) {
            console.error('Error querying customer count:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(rows[0]);
    });
});

router.get('/getStaffCount', (req, res) => {
    connection.query('SELECT COUNT(*) AS count FROM Staff', (err, rows) => {
        if (err) {
            console.error('Error querying staff count:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(rows[0]);
    });
})

router.get("/getGuideProfile", authGuard, (req, res) => {
    const user = req.user;
    try {
        if (!user) {
            return res.status(400).send({ err: "User not logged in" });
        }

        if (user.role !== "Guide") {
            return res.status(403).send({ err: "User is not a guide" });
        }

        connection.query(
            "SELECT * FROM Guide WHERE UserID = ?",
            [user.id],
            (err, rows) => {
                if (err) {
                    console.error("Error querying guide data:", err);
                    return res.status(500).send("Internal Server Error");
                }
                res.json(rows[0]);
            }
        );
    } catch (err) {
        res.status(400).send({ err: err });
    }
});

router.put('/updateGuideProfile', authGuard, (req, res) => {
    const user = req.user;
    const { Languages, GuiType, Qualifications } = req.body;
    try {
        if (!user) {
            return res.status(400).send({ err: "User not logged in" });
        }

        if (user.role !== "Guide") {
            return res.status(403).send({ err: "User is not a guide" });
        }

        connection.query(
            "UPDATE Guide SET Languages = ?, GuiType = ?, Qualifications = ? WHERE UserID = ?",
            [Languages, GuiType, Qualifications, user.id],
            (err, result) => {
                if (err) {
                    console.error("Error updating guide data:", err);
                    return res.status(500).send("Internal Server Error");
                }
                res.send("Guide profile updated successfully");
            }
        );
    } catch (err) {
        res.status(400).send({ err: err });
    }
})

module.exports = router;

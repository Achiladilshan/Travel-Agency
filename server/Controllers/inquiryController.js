const connection = require('../Config/db');

const addInquiry = (req, res) => {
    const { arrivalDate, departureDate, message, numAdults, numChildren, email , mobile , firstName , lastName , country } = req.body;
    // InquiryDate
    // const data = getLastInquiryID();
    // let inquiryID = 1;
    // if (!(data === undefined || data === null)) {
    //     inquiryID = data + 1;
    // }

    const UserQuery = 'SELECT * FROM User WHERE email = ?';
    connection.query(UserQuery, [email], (err, rows) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            return;
        }
        if (rows.length === 0) {
            res.send("Customer does not exist");
            return;
        }

        const CustomerQuery = 'SELECT CustomerID FROM Customer WHERE UserID = ?';
        connection.query(CustomerQuery, [rows[0].UserID], (err, rows) => {
            if (err) {
                console.error('Error querying MySQL database:', err);
                return;
            }
            const InquiryDate = new Date().toISOString().split('T')[0];
            const Status = 'Pending';
            const CustomerID = rows[0].CustomerID;

            const query = 'INSERT INTO Inquiry( InquiryDate, ArrivalDate, DepartureDate, Message, AdultsCount, ChildrenCount, Status, CustomerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

            connection.query(query, [InquiryDate, arrivalDate, departureDate, message, numAdults, numChildren, Status, CustomerID], (err, result) => {
                if (err) {
                    console.error('Error querying MySQL database:', err);
                    return;
                }
                res.send("Inquiry added successfully");
            });
        });
    });
}



const addInquiryNewUser = (req, res) => {
    const { arrivalDate, departureDate, message, numAdults, numChildren, email , mobile , firstName , lastName , country , password} = req.body;
    // InquiryDate
    // const data = getLastInquiryID();
    // let inquiryID = 1;
    // if (!(data === undefined || data === null)) {
    //     inquiryID = data + 1;
    // }

    const AddUserQuery = 'INSERT INTO User(Email, Password, FirstName, LastName, PhoneNumber, Role) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(AddUserQuery, [email, password, firstName, lastName, mobile, 'Customer'], (err, result) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(400).send("Error adding user");
            return;
        }
        const CustomerQuery = 'INSERT INTO Customer(UserID, Country) VALUES (?, ?)';
        connection.query(CustomerQuery, [result.insertId, country], (err, result) => {
            if (err) {
                console.error('Error querying MySQL database:', err);
                res.status(400).send("Error adding customer");
                return;
            }
            const InquiryDate = new Date().toISOString().split('T')[0];
            const Status = 'Pending';
            const CustomerID = result.insertId;

            const query = 'INSERT INTO Inquiry( InquiryDate, ArrivalDate, DepartureDate, Message, AdultsCount, ChildrenCount, Status, CustomerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

            connection.query(query, [InquiryDate, arrivalDate, departureDate, message, numAdults, numChildren, Status, CustomerID], (err, result) => {
                if (err) {
                    console.error('Error querying MySQL database:', err);
                    res.status(400).send("Error adding inquiry");
                    return;
                }
                res.status(201).send("Inquiry added successfully");
            });
        });

    });
    

    
}

const getLastInquiryID = () => {
    connection.query('SELECT * FROM Inquiry ORDER BY InquiryID DESC LIMIT 1', (err, rows) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            return;
        }
        return rows[0].InquiryID;
    });
}

const getAllInquiries = (req, res) => {
    connection.query('SELECT * FROM Inquiry', (err, rows) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            return;
        }
        res.json(rows);
    });
}

const deleteInquiry = (req, res) => {
    const { InquiryID } = req.params;
    const query = 'DELETE FROM Inquiry WHERE InquiryID = ?';
    connection.query(query, [InquiryID], (err, result) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            return;
        }
        res.send("Inquiry deleted successfully");
    });
}

const getInquiryByID = (req, res) => {
    const { InquiryID } = req.params;
    const query = 'SELECT * FROM Inquiry WHERE InquiryID = ?';
    connection.query(query, [InquiryID], (err, rows) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            return;
        }
        res.json(rows[0]);
    });
}

module.exports = {
    addInquiry,
    getAllInquiries,
    deleteInquiry,
    getInquiryByID,
    addInquiryNewUser
}

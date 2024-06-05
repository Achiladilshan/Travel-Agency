const connection = require('../Config/db');

const addInquiry = (req, res) => {
    const { InquiryDate, ArrivalDate, DepartureDate, Message, AdultsCount, ChildrenCount, Status, CustomerID } = req.body;
    const data = getLastInquiryID();
    let inquiryID = 1;
    if (!(data === undefined || data === null)) {
        inquiryID = data + 1;
    }
    const query = 'INSERT INTO Inquiry VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [inquiryID, InquiryDate, ArrivalDate, DepartureDate, Message, AdultsCount, ChildrenCount, Status, CustomerID], (err, result) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            return;
        }
        res.send("Inquiry added successfully");
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
    getInquiryByID
}

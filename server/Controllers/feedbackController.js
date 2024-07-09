const connection = require('../Config/db');

// Add feedback
const addFeedback = (req, res) => {
    const {TripID, Rating, Remarks, Highlights, LowPoints } = req.body;
    const currentDate = new Date();

    connection.query(
        'INSERT INTO Feedback (TripID, Rating, Remarks, Highlights, LowPoints, Date) VALUES (?, ?, ?, ?, ?, ?)',
        [TripID, Rating, Remarks, Highlights, LowPoints, currentDate],
        (err, result) => {
            if (err) {
                console.error('Error inserting feedback:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({ message: 'Feedback added successfully' });
        } 
    );
};

// Get all feedbacks
const getAllFeedback = (req, res) => {
    connection.query('SELECT * FROM Feedback', (err, rows) => {
        if (err) {
            console.error('Error querying feedback:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(rows);
    });
};

// Get feedback by TripID
const getFeedbackByTripId = (req, res) => {
    const { TripID } = req.params;
    connection.query('SELECT * FROM Feedback WHERE TripID = ?', [TripID], (err, rows) => {
        if (err) {
            console.error('Error querying feedback:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (rows.length === 0) {
            return res.status(404).send('Feedback not found');
        }
        res.status(200).json(rows[0]);
    });
};

// Get feedback by UserID
const getFeedbackByUserID = (req, res) => {
    const { UserID } = req.params;
    connection.query('SELECT * FROM Feedback WHERE UserID = ?', [UserID], (err, rows) => {
        if (err) {
            console.error('Error querying feedback:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (rows.length === 0) {
            return res.status(404).send('Feedback not found');
        }
        res.status(200).json(rows);
    });
}

module.exports = {
    addFeedback,
    getAllFeedback,
    getFeedbackByTripId,
    getFeedbackByUserID
};

const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../Config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const util = require('util');

const router = express.Router();

router.use(bodyParser.json());


// Create PackageImages directory if it doesn't exist
const uploadDirectory = 'PackageImages';
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}_${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

// Add a new tour package
const addTourPackage = (req, res) => {
    const { Name, Description, Price, Itinerary, NoOfDates } = req.body;

    // Check if image file is uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;

    connection.query(
        'INSERT INTO TourPackages (Name, Description, Price, Itinerary, NoOfDates, Photo) VALUES (?, ?, ?, ?, ?, ?)',
        [Name, Description, Price, Itinerary, NoOfDates, imageUrl],
        (err, result) => {
            if (err) {
                console.error('Error inserting tour package:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({ message: 'Tour package added successfully' });
        }
    );
};

// Get all tour packages
const getAllTourPackages = (req, res) => {
    connection.query('SELECT * FROM TourPackages', (err, rows) => {
        if (err) {
            console.error('Error querying tour packages:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(rows);
    });
};

// Get a tour package by PackageID
const getTourPackageById = (req, res) => {
    const { PackageID } = req.params;

    connection.query('SELECT * FROM TourPackages WHERE PackageID = ?', [PackageID], (err, rows) => {
        if (err) {
            console.error('Error querying tour package:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (rows.length === 0) {
            return res.status(404).send('Tour package not found');
        }
        res.status(200).json(rows[0]);
    });
};

// Update a tour package by PackageID
const updateTourPackage = (req, res) => {
    const { PackageID } = req.params;
    const { Name, Description, Price, Itinerary, NoOfDates } = req.body;

    connection.query(
        'UPDATE TourPackages SET Name = ?, Description = ?, Price = ?, Itinerary = ?, NoOfDates = ? WHERE PackageID = ?',
        [Name, Description, Price, Itinerary, NoOfDates, PackageID],
        (err, result) => {
            if (err) {
                console.error('Error updating tour package:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Tour package not found');
            }
            res.status(200).json({ message: 'Tour package updated successfully' });
        }
    );
};

// Delete a tour package by PackageID
const deleteTourPackage = (req, res) => {
    const { PackageID } = req.params;

    connection.query('DELETE FROM TourPackages WHERE PackageID = ?', [PackageID], (err, result) => {
        if (err) {
            console.error('Error deleting tour package:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Tour package not found');
        }
        console.log("Delete Done!")
        res.status(200).json({ message: 'Tour package deleted successfully' });
    });
};

module.exports = {
    addTourPackage,
    getAllTourPackages,
    getTourPackageById,
    updateTourPackage,
    deleteTourPackage,
    upload
};

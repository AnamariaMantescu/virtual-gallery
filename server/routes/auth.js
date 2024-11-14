const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebase');


router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role = 'visitor'} = req.body;

        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name
        });

        await db.collection('users').doc(userRecord.uid).set({
            name,
            email,
            role,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { uid } = req.body;
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.data();
        res.json({ user: { ...userData, uid } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

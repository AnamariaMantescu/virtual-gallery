const express = require('express');
const router = express.Router();
const { messaging } = require('firebase-admin');
const { db, admin }  = require('../config/firebase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const artworksSnapshot = await db.collection('artworks').get();
    const artworks = artworksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    res.json(artworks);
  } catch ( error ) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('artworks').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Artwork not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch ( error ) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
   try{
    const { title, author, creationYear, estimatedValue, technique, medium } = req.body;

    if (!title || !author || !creationYear) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const docRef = await db.collection('artworks').add({
        title,
        author,
        creationYear,
        estimatedValue,
        technique,
        medium,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ id: docRef.id });
   } catch ( error ) {
    res.status(500).json({ error: error.message });
   }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { title, author, creationYear, estimatedValue, technique, medium } = req.body;

        await db.collection('artworks').doc(req.params.id).update({
            title, 
            author,
            creationYear,
            estimatedValue,
            technique,
            medium,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ message: 'Artwork updated successfully' });
    } catch ( error ) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', authenticateToken, requireAdmin, async ( req, res) => {
    try{
        await db.collection('artworks').doc(req.params.id).delete();
        res.json({ message: 'Artwork deleted successfully' });
    } catch ( error ) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
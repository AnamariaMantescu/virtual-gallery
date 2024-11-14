const { admin } = require('../config/firebase');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (!userDoc.exists) {
            return res.status(403).json({ erroe: 'User not found' });
        }

        const userData = userDoc.data();
        req.user = {
            ...decodedToken,
            role: userData.role
        };

        next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
};

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required '});
    }
}

module.exports = { authenticateToken, requireAdmin }
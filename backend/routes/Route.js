import express from 'express';
const router = express.Router();

router.get('/master', async (req, res) => {
    res.send('Route works');
});

export default router;
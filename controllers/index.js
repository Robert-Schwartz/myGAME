const router = require('express').Router();

const apiRoutes = require('./api');
const homepageRoutes = require('./homepage-routes.js');
const profileRoutes = require('./profile-routes');
const statRoutes = require('./api/stat-routes')

router.use('/api', apiRoutes);
router.use('/stat', statRoutes)
router.use('/profile', profileRoutes);
router.use('/', homepageRoutes);

module.exports = router;
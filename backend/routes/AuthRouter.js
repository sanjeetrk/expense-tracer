const { signup, login, googlelogin} = require('../controllers/AuthController');
const { signupValidation, loginValidation } = require('../controllers/AuthValidation');

const router= require('express').Router();

router.post('/login',loginValidation, login);
router.post('/signup', signupValidation, signup)
router.get('/google', googlelogin)  // Changed from POST to GET
module.exports = router;
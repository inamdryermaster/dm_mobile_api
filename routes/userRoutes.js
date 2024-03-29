// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/auth/userAuth');
const { registerUser } = require('../controllers/user/registerUser');
const { LoginUser } = require('../controllers/user/loginUser');
const { forgotPassword } = require('../controllers/user/forgotPassword');
const {
  forgotPasswordUpdate,
} = require('../controllers/user/forgotPasswordUpdate');
const { subscriptionCheck } = require('../controllers/user/subscriptionCheck');
const { changePassword } = require('../controllers/user/changePassword');
const { profileRead } = require('../controllers/user/profileRead');
const { profileUpdate } = require('../controllers/user/profileUpdate');
const { AddOperator } = require('../controllers/user/operator/addOperator');
const { AllOperators } = require('../controllers/user/operator/allOperators');
const { EditOperator } = require('../controllers/user/operator/editOperator');
const {
  DeactivateOperator,
} = require('../controllers/user/operator/deactivateOperator');
const {
  ReactiveOperator,
} = require('../controllers/user/operator/reactiveOperator');
const { loginDryermaster } = require('../controllers/user/loginDryermaster');

// const { authenticateAdmin } = require('../middleware/auth/adminAuth');

// ==========>>>>>> check if dryermaster is registered
router.post('/login_dryermaster', loginDryermaster); // public route
// ==========>>>>>> Create a user
router.post('/register', registerUser); // public route

// ==========>>>>>> Login a user
router.post('/login', LoginUser); // public route

// ==========>>>>>> changePassword - with token in header - private route - user - change password

router.put('/change_password', authenticateUser, changePassword); // private route - user

router.get('/profile', authenticateUser, profileRead); // private route - user
router.put('/profile', authenticateUser, profileUpdate); // private route - user

// ==========>>>>>> Forgot Password
router.post('/forgot_password', forgotPassword); // public route

// ==========>>>>>> Forgot Password - Reset Password
router.put('/forgot_password_update', forgotPasswordUpdate); // public route

// ==========>>>>>> subscriptionCheck - with token in header - private route - user - check if user subscription is expired

router.get('/subscription_status', authenticateUser, subscriptionCheck); // private route - user

// ==========>>>>>> Add a Operator
router.post('/add_operator', authenticateUser, AddOperator); // private route - user

// ==========>>>>>> Get all Operators
router.get('/all_operators', authenticateUser, AllOperators); // private route - user

// ==========>>>>>> editOperator - with token in header - private route - user - edit operator
router.put('/edit_operator', authenticateUser, EditOperator); // private route - user

// ==========>>>>>> deactivateOperator - with token in header - private route - user - deactivate operator
router.put('/deactivate_operator/:id', authenticateUser, DeactivateOperator); // private route - user

// ==========>>>>> reactive Operator - with token in header - private route - user - reactive operator
router.put('/reactive_operator/:id', authenticateUser, ReactiveOperator); // private route - user

module.exports = router;

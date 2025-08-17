const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;

const User = require('../models/user.model');
const router = require('express').Router();
const mongoose = require('mongoose');
const { roles } = require('../utils/constants');

// View all users
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.render('manage-users', { users });
  } catch (error) {
    next(error);
  }
});

// Add a new user
router.post('/users', async (req, res, next) => {
  try {
    const { username, email, password, role, status } = req.body;

    // Validate input
    if (!username || !email || !password || !role || !status) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/admin/users');
    }

    // Create and save new user
    const newUser = new User({ username, email, password, role, status });
    await newUser.save();
    req.flash('success', `User ${username} added successfully.`);
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
});

// Edit user details
router.post('/user/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, role, status } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid user ID.');
      return res.redirect('/admin/users');
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, role, status },
      { new: true, runValidators: true }
    );

    req.flash('success', `User ${updatedUser.username} updated successfully.`);
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
});


// Delete a user
router.post('/user/:id/delete', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid user ID.');
      return res.redirect('/admin/users');
    }

    // Prevent admins from deleting themselves
    if (req.user.id === id) {
      req.flash('error', 'Admins cannot delete themselves.');
      return res.redirect('/admin/users');
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/admin/users');
    }

    // Delete user
    await User.findByIdAndDelete(id);
    req.flash('success', 'User deleted successfully.');
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
});


// Update user status
router.post('/user/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ID and status
    if (!mongoose.Types.ObjectId.isValid(id) || !['ACTIVE', 'INACTIVE'].includes(status)) {
      req.flash('error', 'Invalid request.');
      return res.redirect('/admin/users');
    }

    // Update status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    req.flash('success', `User ${updatedUser.username} status updated to ${status}.`);
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
});

module.exports = router;

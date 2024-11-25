// const mongoose = require('mongoose');

// const RoleSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     enum: ['ADMIN', 'MODERATOR', 'CLIENT'], // Can dynamically extend if needed
//   },
//   permissions: {
//     type: [String], // Array of permissions
//     enum: ['read', 'write', 'delete', 'manage-users'], // Allowed permissions
//     default: [], // Default is no permissions
//   },
// });

// const Role = mongoose.model('Role', RoleSchema);
// module.exports = Role;

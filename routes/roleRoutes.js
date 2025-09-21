// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Create a new role
router.post('/add-roles', roleController.createRole);

// Get all roles (not soft deleted)
router.get('/get-all-roles', roleController.getRoles);

// Get role by ID
router.get('/get-role-by-id/:id', roleController.getRoleById);

// Update a role by ID
router.put('/update-role-by-id/:id', roleController.updateRole);

// Soft delete a role by ID
router.delete('/delete-role-by-id/:id', roleController.deleteRole);

module.exports = router;

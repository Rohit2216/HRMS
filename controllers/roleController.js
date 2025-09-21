const Role = require('../models/roleModel');
const { roleValidation } = require('../validations/validations');
const { StatusCodes } = require('http-status-codes');

// Create a role
exports.createRole = async (req, res) => {
    console.log("Request Body:", req.body); // Debugging line to check request body
  const { error } = roleValidation.validate(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

  try {
    const role = new Role(req.body);
    const result = await role.save();
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get all roles (not soft deleted)
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.status(StatusCodes.OK).json(roles);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get a single role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Role not found' });
    res.status(StatusCodes.OK).json(role);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Update a role
exports.updateRole = async (req, res) => {
  const { error } = roleValidation.validate(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!role) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Role not found or deleted' });
    res.status(StatusCodes.OK).json(role);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Soft delete a role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!role) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Role not found or already deleted' });
    res.status(StatusCodes.OK).json({ message: 'Role soft deleted successfully' });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

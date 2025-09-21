const Joi = require("joi");


const roleValidation = Joi.object({
  name: Joi.string().min(2).max(40).required(),
  description: Joi.string().max(200).allow(''),
  isDeleted: Joi.boolean()
});


module.exports = { roleValidation };

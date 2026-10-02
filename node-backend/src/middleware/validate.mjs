import { validationResult } from 'express-validator';

export function validate(validations) {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  };
}
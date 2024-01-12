const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const ReactiveOperator = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const { userId, name, role, dmSerial } = req.user;
    // check if user is main user
    if (role !== 'user') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Only admin can add operator',
      });
    }
    const operator = await User.findById(_id);
    if (!operator) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Operator not found',
      });
    }
    if (operator.dmSerial !== dmSerial) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'You are not authorized to update this operator',
      });
    }
    // update operator status to active and don't send password in response
    const updatedOperator = await User.findByIdAndUpdate(
      _id,
      {
        status: 'active',
      },
      {
        new: true,
        select:
          '-password -subscriptionExpiry -address -createdAt -updatedAt -__v',
      }
    );
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Operator reactivated successfully',
      data: updatedOperator,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  ReactiveOperator,
};

const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  login_date: {
    type: Date,
    default: Date.now
  },
  login_ip: {
    type: String,
    default: ''
  },
  user_agent: {
    type: String,
    default: ''
  },
  session_id: {
    type: String,
    default: ''
  },
  login_method: {
    type: String,
    default: 'email_password'
  }
});

module.exports = mongoose.model('LoginHistory', loginHistorySchema);

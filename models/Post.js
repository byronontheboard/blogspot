const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');

[
    {
      "title": "Just Ordered Pizza",
      "body": "Keep the change, ya filthy animal.",
      "user_id": 1
    },
    {
      "title": "Christmas Is Ruined",
      "body": "Look what you did, you little jerk...",
      "user_id": 2
    },
]  

module.exports = Post;
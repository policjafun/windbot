const fs = require('fs');
const client = require('../../index').client;
const schema = require('../../models/dashboard.js');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWTSECRET;

module.exports = {
  name: "/commands",
  run: async (req, res, next) => {
   
    
        res.render("./public/frontend/HTML/commands.ejs");
  }
};

const User = require("./model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccesToken = (id, status) => {
  const payload = {
    id,
    status,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ message: "Validation error", errors });
      }
      const {
        username,
        password,
        firstName,
        lastName,
        email,
        registration,
        lastVisit,
        status,
      } = req.body;

      const candidate = await User.findOne({
        username: new RegExp("^" + username + "$", "i"),
      });
      if (candidate) {
        return res
          .status(409)
          .json({ message: "User with this username has already exist" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({
        username,
        password: hashPassword,
        firstName,
        lastName,
        email,
        registration,
        lastVisit,
        status,
      });
      await user.save();
      return res.json({ message: "User registered" });
    } catch (e) {
      res.status(400).json({ message: "Registration error" });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({
        username: new RegExp("^" + username + "$", "i"),
      });
      if (!user) {
        return res.status(400).json({ message: `User ${username} not found` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Wrong password" });
      }
      const token = generateAccesToken(user._id, user.status);
      return res.json({ token });
    } catch (e) {
      res.status(400).json({ message: "Login error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
  async deleteUsers(req, res) {
    try {
      const { ids } = req.body;
      console.log(ids);
      await User.deleteMany({ _id: { $in: ids } });
      return res.json({ message: "Users deleted" });
    } catch (e) {
      console.log(e);
    }
  }
  async blockUsers(req, res) {
    try {
      const { ids } = req.body;
      await User.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "Blocked" } }
      );
      return res.json({ message: "Users blocked" });
    } catch (e) {
      console.log(e);
    }
  }
  async unblockUsers(req, res) {
    try {
      const { ids } = req.body;
      await User.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "Active" } }
      );
      return res.json({ message: "Users unblocked" });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authController();

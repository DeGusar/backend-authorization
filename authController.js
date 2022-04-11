const User = require("./model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");
const { json } = require("express/lib/response");

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
        password,
        firstName,
        lastName,
        email,
        registration,
        lastVisit,
        status,
      } = req.body;

      const candidate = await User.findOne({
        email: new RegExp("^" + email + "$", "i"),
      });
      if (candidate) {
        return res
          .status(409)
          .json({ message: "User with this email has already exist" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({
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
      const { email, password } = req.body;
      const user = await User.findOne({
        email: new RegExp("^" + email + "$", "i"),
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: `User with email ${email} not found` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(402).json({ message: "Wrong password" });
      }
      const token = generateAccesToken(user._id, user.status);
      return res.json({ token });
    } catch (e) {
      res.status(400).json({ message: "Login error" });
    }
  }

  async getUsers(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = jwt.verify(token, secret);
      const _id = id;
      const user = await User.findOne({
        _id: _id,
      });
      if (user === null || user.status === "Blocked") {
        return res.status(411).json({ message: "Blocked" });
      }
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
  async deleteUsers(req, res) {
    try {
      const { body } = req.body;
      const token = req.headers.authorization.split(" ")[1];
      const { id } = jwt.verify(token, secret);
      const _id = id;
      await User.deleteMany({ _id: { $in: body } });
      if (body.includes(_id)) {
        return res.status(405).json({ message: "You are blocked" });
      }
      return res.json({ message: "Users deleted" });
    } catch (e) {
      console.log(e);
    }
  }
  async blockUsers(req, res) {
    try {
      const { body } = req.body;
      const token = req.body.headers.Authorization.split(" ")[1];
      const { id } = jwt.verify(token, secret);
      const _id = id;
      await User.updateMany(
        { _id: { $in: body } },
        { $set: { status: "Blocked" } }
      );
      if (body.includes(_id)) {
        return res.status(405).json({ message: "You are blocked" });
      }
      return res.json({ message: "Users blocked" });
    } catch (e) {
      console.log(e);
    }
  }
  async unblockUsers(req, res) {
    try {
      const { body } = req.body;
      await User.updateMany(
        { _id: { $in: body } },
        { $set: { status: "Active" } }
      );
      return res.json({ message: "Users unblocked" });
    } catch (e) {
      console.log(e);
    }
  }
  async createUsers(req, res) {
    const usersData = Object.values(req.body);
    usersData.forEach((user) => {
      const newUser = new User({
        ...user,
      });
      newUser.save();
    });
    return res.json({ message: "Users created" });
  }
}

module.exports = new authController();

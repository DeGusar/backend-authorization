const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");

router.post(
  "/registration",
  [
    check("username", "username can't be empty").notEmpty(),
    check("password", "passwors can't be empty").notEmpty(),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.getUsers);
router.delete("/delete", controller.deleteUsers);
router.patch("/block", controller.blockUsers);
router.patch("/unblock", controller.unblockUsers);

module.exports = router;

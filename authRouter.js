const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");

router.post(
  "/registration",
  [
    check("email", "email can't be empty").notEmpty(),
    check("password", "password can't be empty").notEmpty(),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.getUsers);
router.delete("/delete", controller.deleteUsers);
router.patch("/block", controller.blockUsers);
router.patch("/unblock", controller.unblockUsers);
router.post("/create", controller.createUsers);

module.exports = router;

const express = require("express");
const memberController = require("../controllers/member.controller");

const router = express.Router();

router.get("/management/members", memberController.getAllMembers);
router.get("/members/:id", memberController.getInfoMember); //id member
router.post("/register", memberController.registerMember);
router.post("/login", memberController.loginMember);

router.get("/members/:id/membership", memberController.getMembership); //id member
router.get("/members/:id/addresses", memberController.getAllAddresses); //id member
router.get("/members/:id/addresses/:id_address", memberController.getAddress);
router.put(
  "/members/:id/addresses/:id_address",
  memberController.updateAddress
);
router.delete("/members/:id/addresses/:id_address", memberController.deleteAddress);
router.post("/members/:id/addresses", memberController.addAddress);

router.get("/members/:id/coupons", memberController.getAllCoupons);

module.exports = router;

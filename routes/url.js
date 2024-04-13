const express = require("express");
const {
  generateNewShortURL,
  getAnalytics,
  handleRedirectURL,
  deleteShortId,
} = require("../controllers/url");
const shortid = require("shortid");

const router = express.Router();

router.post("/", generateNewShortURL);
router.get("/:shortId", handleRedirectURL);
router.get("/analytics/:shortId", getAnalytics);
router.delete("/:shortId", deleteShortId);
module.exports = router;

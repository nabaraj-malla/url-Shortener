const shortid = require("shortid");
const URL = require("../models/url");

async function generateNewShortURL(req, res) {
  const body = req.body; // to get user url since we provide url while creating new shortId
  if (!body) {
    res.status(400).json({ msg: "url is required" });
  }
  const shortID = shortid(); // gives new shortID in string
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });

  // return res.render("home");
  return res.render("home", {
    id: shortID,
  });
}

async function handleRedirectURL(req, res) {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamps: Date.now(),
        },
      },
    }
  );

  res.redirect(entry.redirectURL);
}

async function getAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

async function deleteShortId(req, res) {
  const shortId = req.params.shortId;
  await URL.findOneAndDelete({ shortId });
  // res.render("home", { deletedURL: "URL.redirectURL" });
  res.json({ msg: "user deleted successfully" });
}

module.exports = {
  generateNewShortURL,
  handleRedirectURL,
  getAnalytics,
  deleteShortId,
};

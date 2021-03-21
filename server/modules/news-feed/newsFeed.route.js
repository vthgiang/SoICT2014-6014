const express = require("express");
const router = express.Router();
const NewsFeedController = require("./newsFeed.controller");
const { auth } = require(`../../middleware`);

router.get('/news-feeds', auth, NewsFeedController.getNewsFeed);

module.exports = router;
const express = require("express");
const router = express.Router();
const NewsFeedController = require("./newsFeed.controller");
const { auth, uploadFile } = require(`../../middleware`);

router.get('/news-feeds', auth, NewsFeedController.getNewsFeed);

//comments
router.post('/news-feeds/:newsFeedId/comments', auth, uploadFile([{ name: 'files', path: '/files/newsFeeds' }], 'array'), NewsFeedController.createComment)
router.patch('/news-feeds/:newsFeedId/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/newsFeeds' }], 'array'), NewsFeedController.editComment)
router.delete('/news-feeds/:newsFeedId/comments/:commentId', auth, NewsFeedController.deleteComment)
router.delete('/news-feeds/:newsFeedId/comments/:commentId/files/:fileId', auth, NewsFeedController.deleteFileComment)

module.exports = router;
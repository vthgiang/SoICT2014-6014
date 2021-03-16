const mongoose = require("mongoose");

const { NewsFeed } = require('../../models');

const { connect } = require(`../../helpers/dbHelper`);

exports.getNewsfeed = async (portal, data) => {
    let { userId, currentNewsfeed, perPage, page } = data;
    let skip;

    if (page)
        page = Number(page)
    if (perPage) {
        perPage = Number(perPage)
    } else {
        perPage = 30;
    }
    skip = (perPage * (page - 1)) ? (perPage * (page - 1)) : 0;

    console.log(userId) 
    let newsFeeds = await NewsFeed(connect(DB_CONNECTION, portal)).find({
        "_id": { $nin: currentNewsfeed },
        "relatedUsers": { $in: userId }
    })
    .sort({ 'createdAt': -1 })
    .skip(skip)
    .limit(perPage)
    

    console.log(newsFeeds.length)
    return newsFeeds
}
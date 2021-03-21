const mongoose = require("mongoose");

const { NewsFeed } = require('../../models');

const { connect } = require(`../../helpers/dbHelper`);

exports.getNewsFeed = async (portal, data) => {
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

    let newsFeeds = await NewsFeed(connect(DB_CONNECTION, portal))
        .find({
            "_id": { $nin: currentNewsfeed },
            "relatedUsers": { $in: userId }
        })
        .sort({ 'updatedAt': -1 })
        .skip(skip)
        .limit(perPage)
        .populate([
            {path: "creator", select:"_id name email avatar"},
            {path: 'associatedDataObject.value', select: "_id name"}
        ])

    return newsFeeds
}

exports.createNewsFeed = async (portal, data) => {
    const { title, description, creator, relatedUsers, associatedDataObject } = data;

    let newsFeed = await NewsFeed(connect(DB_CONNECTION, portal))
        .create({
            title: title,
            description: description,
            creator: creator,
            relatedUsers: relatedUsers,
            associatedDataObject: { 
                dataType: associatedDataObject?.dataType,
                value: associatedDataObject?.value,
                description: associatedDataObject?.description
            },
            comments: []
        })

    newsFeed = newsFeed && await newsFeed.populate([
        {path: "creator", select:"_id name email avatar"},
        {path: 'task', select: "_id name"}
    ])
    .execPopulate();

    if (relatedUsers?.length > 0) {
        relatedUsers.map(user => {
            const arr = CONNECTED_CLIENTS.filter(
                (client) => client.userId === user.toString()
            );
            if (arr.length === 1)
                SOCKET_IO.to(arr[0].socketId).emit("news feed", newsFeed);
        })
    }
    
    return newsFeed;
}
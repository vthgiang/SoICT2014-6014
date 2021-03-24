const mongoose = require("mongoose");

const { NewsFeed, Task } = require('../../models');

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
            {path: "content.creator", select:"_id name email avatar"},
            { path: 'comments.creator', select: 'name email avatar' }
        ])

    newsFeeds.map(item => {
        item.content = item?.content?.reverse();
    })
    return newsFeeds
}

exports.createNewsFeed = async (portal, data) => {
    const { title, description, creator, relatedUsers, associatedDataObject } = data;
    let newsFeed;
    let content = {
        title,
        description,
        creator
    }

    newsFeed = await NewsFeed(connect(DB_CONNECTION, portal)).findOne({
        "associatedDataObject.value": associatedDataObject?.value
    })

    if (newsFeed) {
        let newContent = await NewsFeed(connect(DB_CONNECTION, portal)).updateOne(
            { _id: newsFeed?._id },
            { $push: { content: content } },
            { new: true } 
        )
    } else {
        newsFeed = await NewsFeed(connect(DB_CONNECTION, portal))
            .create({
                content: [content],
                associatedDataObject: { 
                    dataType: associatedDataObject?.dataType,
                    value: associatedDataObject?.value,
                    description: associatedDataObject?.description
                },
                relatedUsers: relatedUsers,
                comments: []
            })
    }

    newsFeed = await NewsFeed(connect(DB_CONNECTION, portal))
        .findById(newsFeed?._id)
        .populate([
            { path: "content.creator", select:"name email avatar" },
            { path: 'comments.creator', select: 'name email avatar' }
        ])
    newsFeed?.content?.reverse();

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

/**
 *  thêm bình luận
 */
 exports.createComment = async (portal, newsFeedId, body, files) => {
    const comments = {
        description: body.description,
        creator: body.creator,
        files: files
    }
    let comment = await NewsFeed(connect(DB_CONNECTION, portal))
        .update(
            { _id: newsFeedId },
            { $push: { comments: comments } }, { new: true }
        )
    let newsFeed = await NewsFeed(connect(DB_CONNECTION, portal))
        .findOne({ _id: newsFeedId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar' }
        ])
    return newsFeed?.comments;
}


/**
 * Sửa bình luận
 */
exports.editComment = async (portal, params, body, files) => {
    let comments = await NewsFeed(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.newsFeedId, "comments._id": params.commentId },
            {
                $set: { "comments.$.description": body.description }
            }
        )

    let comment = await NewsFeed(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.newsFeedId, "comments._id": params.commentId },
            {
                $push:
                {
                    "comments.$.files": files
                }
            }
        )
    let newsFeed = await NewsFeed(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.newsFeedId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar' }
        ])
    return newsFeed?.comments;
}

/**
 * Delete comment
 */
exports.deleteComment = async (portal, params) => {
    let files1 = await NewsFeed(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.newsFeedId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
        ])

    let files2 = await NewsFeed(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.newsFeedId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } }
        ])
    let files = [...files1, ...files2]
    let i
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let comments = await NewsFeed(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.newsFeedId, "comments._id": params.commentId },
            { $pull: { comments: { _id: params.commentId } } },
            { safe: true }
        )
    let newsfeed = await NewsFeed(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.newsFeedId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar' }
        ])

    return newsfeed?.comments
}

/**
 * Xóa file của bình luận
 */
exports.deleteFileComment = async (portal, params) => {
    let file = await NewsFeed(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.newsFeedId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
        ])
    fs.unlinkSync(file[0].url)

    let comment1 = await NewsFeed(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.newsFeedId, "comments._id": params.commentId },
            { $pull: { "comments.$.files": { _id: params.fileId } } },
            { safe: true }
        )
    let newsfeed = await NewsFeed(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.newsFeedId })
        .populate([
            { path: "comments.creator", select: 'name email avatar' },
        ]);

    return newsfeed?.comments;
}
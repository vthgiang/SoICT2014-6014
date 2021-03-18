const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsFeedSchema = new Schema(
    {
        title: { // Tên Ví dụ
            type: String,
            required: true
        },
        description: { // Mô tả Ví dụ
            type: String
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        relatedUsers: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        comments: [{
            creator: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            description: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
            files: [{
                name: {
                    type: String,
                },
                url: {
                    type: String,
                },
            }]
        }],
    
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models.NewsFeed)
        return db.model('NewsFeed', NewsFeedSchema);
    return db.models.NewsFeed;
} 
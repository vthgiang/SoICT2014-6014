const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TaskFile = require('./taskFile.model');
const Task = require('./task.model');
const User = require('./user.model');

// Model quản lý các hoạt động hoặc bình luận của một công việc
const CommentTaskSchema = new Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: Task,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    parent: {// Có thể là comment cha hoặc là action task
        type: Schema.Types.ObjectId,
         replies: this
    },
    content: {
        type: String,
    },
    approved: {
        type: Number,
        default: 0,
        required: true
    },
    // file: {
    //     type: Schema.Types.ObjectId,
    //     ref: TaskFile,
    //     required: true
    // }
}, {
    timestamps: true
});

module.exports = CommentTask = mongoose.model("comment_tasks", CommentTaskSchema);
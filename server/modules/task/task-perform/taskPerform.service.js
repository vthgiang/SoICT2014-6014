const mongoose = require("mongoose");
const TimesheetLog = require('../../../models/task/timesheetLog.model');
const Task = require('../../../models/task/task.model');
const TaskAction = require('../../../models/task/taskAction.model');
const TaskTemplateInformation = require('../../../models/task/taskResultInformation.model');
//const TaskFile = require('../../../models/taskFile.model');
const TaskResultInformation = require('../../../models/task/taskResultInformation.model');
const TaskResult = require('../../../models/task/taskResult.model');
const User = require('../../../models/auth/user.model')


// Bấm giờ công việc
// Lấy tất cả lịch sử bấm giờ theo công việc
exports.getLogTimer = (req, res) => {
    TimesheetLog.find({ task: req.params.task }).populate("user")
        .then(logTimers => res.status(200).json(logTimers))
        .catch(err => res.status(400).json(err));
    console.log("Get all log timer");
}

// Lấy trạng thái bấm giờ hiện tại. Bảng TimesheetLog tìm hàng có endTime là rỗng 
// Nếu có trả về startTimer: true, và time, startTime. Không có trả ver startTimer: false
exports.getTimerStatus = (req, res) => {
    TimesheetLog.findOne({ task: req.params.task, user: req.params.user, stopTimer: null })
        .then(timerStatus => res.status(200).json(timerStatus))
        .catch(err => res.status(400).json(err));
    console.log("Get Timer Status current");
}

// Bắt đầu bấm giờ: Lưu thời gian bắt đầu
exports.startTimer = async (req, res) => {
    try {
        var timer = await TimesheetLog.create({
            task: req.body.task,
            user: req.body.user,
            start: req.body.startTimer,
            startTimer: req.body.startTimer,
            stopTimer: null,
            time: 0
        });
        res.json({
            message: "Bắt đầu tính giờ",
            timerStatus: timer
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Tạm dừng: Lưu thời gian đã bấm (time)
exports.pauseTimer = async (req, res) => {
    try {
        var timer = await TimesheetLog.findByIdAndUpdate(
            req.params.id, { time: req.body.time, pause: true }, { new: true }
        );

        res.json({
            message: "Tạm dừng tính giờ",
            timerStatus: timer
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Tiếp tục bấm giờ: Cập nhật lại trạng thái bắt đầu (time)
exports.continueTimer = async (req, res) => {
    try {
        var timer = await TimesheetLog.findByIdAndUpdate(
            req.params.id, { startTimer: req.body.startTimer, pause: false }, { new: true }
        );

        res.json({
            message: "Tạm dừng tính giờ",
            timerStatus: timer
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Dừng bấm giờ: Lưu thời gian kết thúc và số giờ chạy (enndTime và time)
exports.stopTimer = async (req, res) => {
    try {
        console.log(req.body);
        var timer = await TimesheetLog.findByIdAndUpdate(
            req.params.id, { stopTimer: req.body.stopTimer, time: req.body.time }, { new: true }
        );
        var task = await Task.findByIdAndUpdate(
            req.body.task, { $inc: { 'time': req.body.time } }, { new: true }
        );
        task = await task.populate('responsible unit').execPopulate();
        if (task.tasktemplate !== null) {
            var actionTemplates = await TaskAction.find({ tasktemplate: task.tasktemplate._id });
            var informationTemplate = await TaskTemplateInformation.find({ tasktemplate: task.tasktemplate._id });
            res.status(200).json({
                "info": task,
                "actions": actionTemplates,
                "informations": informationTemplate
            })
        } else {
            res.status(200).json({ "info": task });
        }
    } catch (error) {
        res.json({ message: error });
    }
}

/**
 * Lấy tất cả nội dung bình luận của hoạt động
 */
exports.getActionComments = async (req, res) => {
    try {
        var actionComments = await Task.aggregate([
            {$match:{_id:mongoose.Types.ObjectId(req.params.task) }},
            {$unwind : "$taskActions"},
            {$replaceRoot:{newRoot:"$taskActions"}},
            {$unwind: "$actionComments"},
            {$replaceRoot:{newRoot:"$actionComments"}},
            {
                $lookup: {
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as : "creator"

                }
            }
        ])
        
        res.status(200).json({
            success: true,
            messages:"get comment action sucess",
            content : actionComments
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Loi"
        })
    }
    
}
/**
 * Lấy thông tin tất cả các hoạt động của công việc
 */
exports.getTaskActions =async (req,res)=>{
    try {
        //tim cac field actiontask trong task với ddkien task hiện tại trùng với task.params
        var taskaction = await Task.findOne({_id:req.params.task},{taskActions:1,_id:0}).populate('taskActions.creator')
        var taskactions = taskaction.taskActions
        // .sort({'createdAt': 'asc'});
        res.status(200).json({
            success:true,
            messages: 'Get all task actions success',
            content: taskactions
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: "Lỗi gì đó"
        })
    }
};
/**
 * Thêm bình luận của hoạt động
 */
exports.createActionComment = async (req, res) => {
    try {
        // var file = await TaskFile.create({
        //     name: req.file.filename,
        //     url: '/uploadfiles/'+req.file.filename
        // })
        var commenttasks = await Task.update(
            { "taskActions._id": req.body.id},
            { "$push": {"taskActions.$.actionComments": 
                {
                parent : req.body.id,
                creator: req.body.creator,
                content: req.body.content,
                //  file: file._id
                }
            }
            }
        )
        var commentAction= await Task.aggregate([
            {
                $match: {"taskActions._id": mongoose.Types.ObjectId(req.body.id)}
            },
            { $unwind: "$taskActions"},
            { $replaceRoot: { newRoot: "$taskActions" } },
            { $match: {"_id": mongoose.Types.ObjectId(req.body.id)}},
            { $unwind: "$actionComments"},
            { $sort: {"actionComments.createdAt": -1}},
             {$group: {
                  _id: null,
                  first: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$first.actionComments" } },
            { $lookup: {
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as : "creator"

                }
            }
        ])

        res.status(200).json({
            success: true,
            messages: "Thêm bình luận thành công",
            content : commentAction[0]
        });
    }catch (error) {
        res.status(400).json({ message: "Hello" });
     }
}
/**
 * Sửa nội dung bình luận hoạt động
 */
exports.editActionComment = async (req, res) => {
    try {
        const now = new Date()
        var action = await Task.updateOne(
            { "taskActions.commentAction._id" :req.params.id },
            { $set: 
                {   
                    "taskActions.$[].actionComments.$[elem].content": req.body.content,
                    "taskActions.$[].actionComments.$[elem].updatedAt": now
                }
            },
            {
                arrayFilters: [
                    {
                        "elem._id": req.params.id
                    }
                ]
            }
        )      
        var commentAction = await Task.aggregate([
            { $match: {"taskActions.actionComments._id":mongoose.Types.ObjectId(req.params.id)}},
            { $unwind :"$taskActions"},
            { $replaceRoot: {newRoot : "$taskActions"}},
            { $unwind :"$actionComments"},
            { $replaceRoot: {newRoot: "$actionComments"}},
            { $match : {_id:mongoose.Types.ObjectId(req.params.id)}},
            { $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as : "creator"
            }
        }
        ])
        res.json({
            success: true,
            message: "Chỉnh sửa bình luận thành công",
            content: commentAction
        });
    } catch (error) {
        res.json({ 
            success: false,
            message: "error" });
    }
}
/**
 * Sửa hoạt động của cộng việc
 */
exports.editTaskAction = async (req,res) =>{
    try {
        
        var action = await Task.updateOne(
            {"taskActions._id" : req.params.id},
            {$set:{
                "taskActions.$.name": req.body.content
            }}
            )
        var actionTask = await Task.findOne(
            {"taskActions._id": req.params.id}, 
            {_id: 0, taskActions: {$elemMatch: {content:req.body.content}}}).populate("taskActions.creator");
        res.status(200).json({
            success: true,
            message:'Edit thành công',
            content : actionTask.actionTask[0]
        })    
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
}
/**
 * Xóa bình luận hoạt động
 */
exports.deleteActionComment = async (req, res) => {
    try {
        var comment = await CommentTask.findByIdAndDelete(req.params.id); // xóa comment theo id
        res.status(200).json("Xóa bình luận thành công");
    } catch (error) {
        res.json({ message: error });
    }
}
/**
 * Xóa hoạt động của công việc
 */
exports.deleteTaskAction = async (req,res) => {
    try {
        var action = await Task.update(
            { "taskActions._id": req.params.id },
            { $pull: { taskActions : { _id : req.params.id } } },
            { safe: true },)
        res.status(200).json({
            success: true,
            message:' Xóa hoạt động thành công'
        })        
    } catch (error) {
        res.status(400).json({
            message:'Lỗi rồi'
        })
    }
}
/**
 * Thêm hoạt động cho công việc
 */
exports.createTaskAction = async (req,res) => {
    try {
        var actionInformation = {
            creator : req.body.creator,
            content : req.body.content
        }
        // var actionTaskabc = await Task.findById(req.body.task)
        var taskAction1 = await Task.findByIdAndUpdate(req.body.task,
                {$push: {taskActions:actionInformation}},{new: true}
        )
        .populate(
           'taskActions.creator'
        )
        var taskAction =taskAction1.taskActions
        res.status(200).json({
            success: true,
            messages: "Thêm hoạt động thành công",
            content: taskAction
        });
    } catch (error) {
        res.status(400).json({ message: "Lỗi thêm hoạt động" });
    }
}
// Test insert result info task
exports.createResultInfoTask = async (req, res) => {
    try {
        // Check nếu như là kiểu date thì ...
        var resultInfoTask1 = await TaskResultInformation.create({
            member: req.body.member,
            infotask: req.body.infotask,
            value: req.body.value
        });
        res.json({
            message: "Thêm bình luận thành công",
            resultInfoTask1: resultInfoTask1
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Thêm thông tin kết quả của các thông tin công việc theo mẫu
exports.createResultInformationTask = async (req, res) => {
    try {
        var listResultInfoTask = req.body.listResultInfoTask;
        if (listResultInfoTask !== []) {
            // Lưu thông tin kết quả 
            var listResultInfoTask = await Promise.all(listResultInfoTask.map(async (item) => {
                var result = await TaskResultInformation.create({
                    member: item.user,
                    infotask: item.infotask,
                    value: item.value
                })
                return result._id;
            }))
            // Cập nhật thông tin công việc
            task = await Task.findByIdAndUpdate(
                req.body.task, { resultInfo: listResultInfoTask, point: req.body.systempoint }, { new: true }
            );
        }
        
        res.json({
            message: "Lưu thành công kết quả nhập liệu",
            task: task
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Sửa thông tin kết quả của các công việc không theo mẫu
exports.editResultInformationTask = async (req, res) => {
    try {
        var listResultInfoTask = req.body.listResultInfoTask;
        if (listResultInfoTask !== []) {
            // Lưu thông tin kết quả 
            var listResultInfoTask = await Promise.all(listResultInfoTask.map(async (item) => {
                var result = await TaskResultInformation.findByIdAndUpdate(item._id,{
                    member: item.user,
                    infotask: item.infotask,
                    value: item.value
                })
                return result;
            }))
        }
        res.json({
            message: "Chỉnh sửa thành công kết quả nhập liệu",
            listResultInfoTask: listResultInfoTask
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Thêm thông tin kết quả của đánh giá từng nhân viên
exports.createResultTask = async (req, res) => {
    try {
        var listResultTask = req.body.listResultTask;
        if (listResultTask !== []) {
            // Lưu thông tin kết quả 
            var listResultTask = await Promise.all(listResultTask.map(async (item) => {
                var result = await TaskResultInformation.create({
                    member: item.user,
                    systempoint: item.systempoint,
                    mypoint: item.mypoint,
                    approverpoint: item.approverpoint
                })
                return result._id;
            }))
            // Cập nhật thông tin công việc
            task = await Task.findByIdAndUpdate(
                req.body.task, { results: listResultTask }, { new: true }
            );
        }
        
        res.json({
            message: "Lưu thành công kết quả đánh giá",
            task: task
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Sửa thông tin kết quả của nhân viên trong công việc
exports.editResultTask = async (req, res) => {
    try {
        var listResultTask = req.body.listResultTask;
        if (listResultTask !== []) {
            // Lưu thông tin kết quả 
            var listResultTask = await Promise.all(listResultTask.map(async (item) => {
                var result = await TaskResult.findByIdAndUpdate(item._id,{
                    member: item.user,
                    systempoint: item.systempoint,
                    mypoint: item.mypoint,
                    approverpoint: item.approverpoint
                })
                return result;
            }))
        }
        res.json({
            message: "Chỉnh sửa thành công kết quả đánh giá",
            listResultTask: listResultTask
        });
    } catch (error) {
        res.json({ message: error });
    }
}

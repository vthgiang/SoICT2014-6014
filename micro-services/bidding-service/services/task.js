const mongoose = require('mongoose');
const dayjs = require('dayjs');

const { Task, TaskTemplate, OrganizationalUnit, User, UserRole } = require('../models');
const { connect } = require('../helpers/dbHelper');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

exports.sendEmailForCreateTask = async (portal, task) => {
    task = await task.populate('organizationalUnit parent')
        .populate({ path: 'creator', select: '_id name email avatar' })
        .execPopulate();

    var email, userId, user, users, userIds
    var managersOfOrganizationalUnitThatHasCollaboratedId = [], managersOfOrganizationalUnitThatHasCollaborated, collaboratedHtml, collaboratedEmail;

    var resId = task.responsibleEmployees;  // lấy id người thực hiện
    var res = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: resId } });
    // res = res.map(item => item.name);
    userIds = resId;
    var accId = task.accountableEmployees;  // lấy id người phê duyệt
    var acc = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: accId } });
    userIds.push(...accId);

    var conId = task.consultedEmployees;  // lấy id người tư vấn
    var con = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: conId } })
    userIds.push(...conId);

    var infId = task.informedEmployees;  // lấy id người quan sát
    var inf = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: infId } })
    userIds.push(...infId);  // lấy ra id của tất cả người dùng có nhiệm vụ

    // loại bỏ các id trùng nhau
    userIds = userIds.map(u => u.toString());
    for (let i = 0, max = userIds.length; i < max; i++) {
        if (userIds.indexOf(userIds[i]) != userIds.lastIndexOf(userIds[i])) {
            userIds.splice(userIds.indexOf(userIds[i]), 1);
            i--;
        }
    }

    // Lấy id trưởng phòng các đơn vị phối hợp
    for (let i = 0; i < task.collaboratedWithOrganizationalUnits.length; i++) {
        let unit = task.collaboratedWithOrganizationalUnits[i] && await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findById(task.collaboratedWithOrganizationalUnits[i].organizationalUnit)

        unit && unit.managers.map(item => {
            managersOfOrganizationalUnitThatHasCollaboratedId.push(item);
        })
    }

    managersOfOrganizationalUnitThatHasCollaborated = await UserRole(connect(DB_CONNECTION, portal))
        .find({
            roleId: { $in: managersOfOrganizationalUnitThatHasCollaboratedId }
        })
        .populate('userId')
    user = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: userIds }
    })

    email = user.map(item => item.email); // Lấy ra tất cả email của người dùng
    collaboratedEmail = managersOfOrganizationalUnitThatHasCollaborated.map(item => item.userId && item.userId.email) // Lấy email trưởng đơn vị phối hợp

    var body = `<a href="${process.env.WEBSITE}/task?taskId=${task._id}" target="_blank" title="${process.env.WEBSITE}/task?taskId=${task._id}"><strong>${task.name}</strong></a></p> ` +
        '<h3>Nội dung công việc</h3>' +
        `<p>Mô tả : ${task.description}</p>` +
        '<p>Người thực hiện</p> ' +
        `<ul>${res.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`
        }).join('')}
                    </ul>`+
        '<p>Người phê duyệt</p> ' +
        `<ul>${acc.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`
        }).join('')}
                    </ul>` +
        `${con.length > 0 ? '<p>Người tư vấn</p> ' +
            `<ul>${con.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`
            }).join('')}
                    </ul>` : ''}` +
        `${inf.length > 0 ? '<p>Người quan sát</p> ' +
            `<ul>${inf.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`
            }).join('')}
                    </ul>` : ''}`
    ;
    let html = `<html>
          <head>
              <style>
                  .wrapper {
                      width: 100%;
                      min-width: 580px;
                      background-color: #FAFAFA;
                      padding: 10px 0;
                  }
                  .userName {
                    font-weight: 700;
                    color: #385898;
                    cursor: pointer;
                  }
          
                  .info {
                      list-style-type: none;
                  }
          
                  @media screen and (max-width: 900px) {
                      .form {
                          border: solid 1px #dddddd;
                          padding: 50px 30px;
                          border-radius: 3px;
                          margin: 0px 5%;
                          background-color: #FFFFFF;
                      }
                  }
          
                  .form {
                      border: solid 1px #dddddd;
                      padding: 50px 30px;
                      border-radius: 3px;
                      margin: 0px 25%;
                      background-color: #FFFFFF;
                  }
          
                  .title {
                      text-align: center;
                  }
          
                  .footer {
                      margin: 0px 25%;
                      text-align: center;
          
                  }
              </style>
          </head>
          
          <body>
              <div class="wrapper">
                  <div class="title">
                      <h1>${process.env.WEB_NAME}</h1>
                  </div>
                  <div class="form">
                    <p>Bạn có công việc mới:  ${body};
                  </div>
                  <div class="footer">
                      <p>Copyright by
                          <i>Công ty Cổ phần Công nghệ
                              <br />
                              An toàn thông tin và Truyền thông Việt Nam</i>
                      </p>
                  </div>
              </div>
          </body>
        </html>`;
    collaboratedHtml = '<p>Đơn vị bạn được phối hợp thực hiện công việc mới: ' + body;


    return {
        task: task,
        user: userIds, email: email, html: html,
        managersOfOrganizationalUnitThatHasCollaborated: managersOfOrganizationalUnitThatHasCollaborated.map(item => item.userId && item.userId._id),
        collaboratedEmail: collaboratedEmail, collaboratedHtml: collaboratedHtml
    };
}

/**
 * Tạo công việc mới của dự án
 */
exports.createProjectTask = async (portal, task) => {
    console.log(task)
    // // Lấy thông tin công việc liên quan
    // var level = 1;
    // if (mongoose.Types.ObjectId.isValid(task.parent)) {
    //     var parent = await Task(connect(DB_CONNECTION, portal)).findById(task.parent);
    //     if (parent) level = parent.level + 1;
    // }
    var startDate, endDate;
    if (Date.parse(task.startDate)) startDate = new Date(task.startDate);
    else {
        var splitter = task.startDate.split('-');
        startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    }

    if (Date.parse(task.endDate)) endDate = new Date(task.endDate);
    else {
        var splitter = task.endDate.split('-');
        endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    }

    let taskTemplate, cloneActions = [];
    if (task.taskTemplate) {
        taskTemplate = await TaskTemplate(connect(DB_CONNECTION, portal)).findById(task.taskTemplate);
        let taskActions = taskTemplate.taskActions;

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name: taskActions[i].name,
                description: taskActions[i].description,
            }
        }
    }

    let formula;
    if (task.formula) {
        formula = task.formula;
    } else {
        if (taskTemplate) {
            formula = taskTemplate.formula;
        } else if (task.formula) {
            formula = 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100'
        }
    }

    let getValidObjectId = (value) => {
        return mongoose.Types.ObjectId.isValid(value) ? value : undefined;
    }
    let taskProject = (taskTemplate && taskTemplate.taskProject) ? getValidObjectId(taskTemplate.taskProject) : getValidObjectId(task.taskProject);
    let taskPhase = (taskTemplate && taskTemplate.taskPhase) ? getValidObjectId(taskTemplate.taskPhase) : getValidObjectId(task.taskPhase);

    let taskActions = [];
    if (task.taskActions) {
        taskActions = task.taskActions.map(e => {
            return {
                mandatory: e.mandatory,
                name: e.name,
                description: e.description,
            }
        });
    } else {
        taskActions = taskTemplate ? cloneActions : [];
    }

    let taskInformations = [];
    if (task.taskInformations) {
        taskInformations = task.taskInformations.map(e => {
            return {
                filledByAccountableEmployeesOnly: e.filledByAccountableEmployeesOnly,
                code: e.code,
                name: e.name,
                description: e.description,
                type: e.type,
                extra: e.extra,
            }
        });
    } else {
        taskInformations = taskTemplate ? taskTemplate.taskInformations : [];
    }

    var newTask = await Task(connect(DB_CONNECTION, portal)).create({ //Tạo dữ liệu mẫu công việc
        organizationalUnit: task.organizationalUnit,
        collaboratedWithOrganizationalUnits: task.collaboratedWithOrganizationalUnits,
        creator: task.creator, //id của người tạo
        name: task.name,
        description: task.description || '',
        startDate: startDate,
        endDate: endDate,
        priority: task.priority,
        formula: formula,
        taskTemplate: taskTemplate ? taskTemplate : null,
        taskInformations: taskInformations,
        taskActions: taskActions,
        // parent : parent: (task.parent === "") ? null : task.parent,
        level: 1,
        responsibleEmployees: task.responsibleEmployees,
        accountableEmployees: task.accountableEmployees,
        consultedEmployees: task.consultedEmployees,
        informedEmployees: task.informedEmployees,
        confirmedByEmployees: task.responsibleEmployees.concat(task.accountableEmployees).concat(task.consultedEmployees).includes(task.creator) ? [task.creator] : [],
        taskProject,
        taskPhase,
        estimateNormalTime: task.estimateNormalTime,
        estimateOptimisticTime: task.estimateOptimisticTime,
        estimateNormalCost: task.estimateNormalCost,
        estimateMaxCost: task.estimateMaxCost,
        preceedingTasks: task.preceedingTasks,
        preceedingMilestones: task.preceedingMilestones,
        actorsWithSalary: task.actorsWithSalary,
        estimateAssetCost: task.estimateAssetCost,
        totalResWeight: task.totalResWeight,
        isFromCPM: task.isFromCPM,
    });

    if (newTask.taskTemplate !== null) {
        await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
            newTask.taskTemplate, { $inc: { 'numberOfUse': 1 } }, { new: true }
        );
    }

    let mail = await this.sendEmailForCreateTask(portal, newTask);

    return {
        task: newTask,
        user: mail.user, email: mail.email, html: mail.html,
        managersOfOrganizationalUnitThatHasCollaborated: mail.managersOfOrganizationalUnitThatHasCollaborated,
        collaboratedEmail: mail.collaboratedEmail, collaboratedHtml: mail.collaboratedHtml
    };
}

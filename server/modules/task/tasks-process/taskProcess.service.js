const { TaskProcess } = require('../../../models').schema;
const { User, Privilege } = require('../../../models/index').schema;
const mongoose = require('mongoose');

/**
 * Lấy tất cả xml diagram
 */
exports.getAllXmlDiagram = async (query, body) => {
    let userId = query.userId;
    let name = query.name;
    let pageNumber = query.pageNumber;
    let noResultsPerPage = query.noResultsPerPage;
    let roles = await UserRole.find({ userId: userId }).populate({ path: "roleId" });
    let newRoles = roles.map(role => role.roleId);

    // lấy tất cả các role con của role người dùng có
    let allRole = [];
    newRoles.map(item => {
        allRole = allRole.concat(item._id); //thêm id role hiện tại vào 1 mảng
        allRole = allRole.concat(item.parents); //thêm các role children vào mảng
    })
    let taskProcesses = [];
    let roleId = allRole.map(function (el) { return mongoose.Types.ObjectId(el) });

    var taskProcess = await TaskProcess.aggregate([
        { $match: { nameProcess: { "$regex": name, "$options": "i" } } },
        {
            $lookup:
            {
                from: "privileges",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $and: [
                                {
                                  $expr: {
                                      $eq: ["$resourceId", "$$id"]
                                    }
                                },
                                {
                                    roleId: { $in: roleId }
                                }
                            ]
                        }
                    }
                ],
                as: "privileges"
            }
        },
        { $unwind: "$privileges" },
        {
            $facet: {
                processes: [ { $sort: { 'createdAt': 1 } },
                    ...noResultsPerPage === 0 ? [] : [{ $limit: noResultsPerPage * pageNumber }],
                    ...noResultsPerPage === 0 ? [] : [{ $skip: noResultsPerPage * (pageNumber - 1) }]
                ],
                totalCount: [
                    {
                        $count: 'count'
                    }
                ]
            }
        }
    ])

    taskProcesses = taskProcess[0].processes;
    await TaskProcess.populate(taskProcesses, { path: 'creator', model: User, select: 'name' });

    let totalCount = 0;
    if (JSON.stringify(taskProcesses) !== JSON.stringify([])) {
        totalCount = taskProcess[0].totalCount[0].count;
    }

    let totalPages = Math.ceil(totalCount / noResultsPerPage);

    return { data: taskProcesses, pageTotal: totalPages };
}

/**
 * Lấy diagram theo id
 * @param {*} params 
 */
exports.getXmlDiagramById = (params) => {
    let data = TaskProcess.findById(params.diagramId);
    return data
}

/**
 * Tạo mới 1 xml diagram
 * @param {*} body dữ liệu diagram cần tạo
 */
exports.createXmlDiagram = async (body) => {
    let info = [];
    for (const x in body.infoTask) {
        info.push(body.infoTask[x])
    }
    let data = await TaskProcess.create({
        creator: body.creator,
        viewer: body.viewer,
        manager: body.manager,
        nameProcess: body.nameProcess,
        description: body.description,
        xmlDiagram: body.xmlDiagram,
        infoTask: info
    })


    let read = body.viewer;
    let roleId = [];
    let role, roleParent;

    role = await Role.find({ _id: { $in: read } });
    roleParent = role.map(item => item.parents);   // lấy ra các parent của các role

    let flag;
    let reads = role.map(item => item._id);     // lấy ra danh sách role có quyền xem ( thứ tự cùng với roleParent)
    
    for (let n in reads) {
        flag = 0;
        let parent = [];
        parent = parent.concat(roleParent[n]);
        for (let i in parent) {
            for (let j in reads) {
                if (JSON.stringify(reads[j]) === JSON.stringify(parent[i])) {  // nếu 1 role là kế thừa của role có sẵn quyền xem thì loại role đấy đi 
                    reads[n] = "";                                              // loại role
                    flag = 1;
                    roleId.push(reads[j]);                                    // thêm vào danh sách role có quyền xem
                }
            }
        }
        if (flag === 0) roleId.push(reads[n]);    // role này không là role cha của role khác => thêm vào danh sách role có quyền xem
    }

    // xử lý các role trùng lặp
    roleId = roleId.map(u => u.toString());
    for (let i = 0, max = roleId.length; i < max; i++) {
        if (roleId.indexOf(roleId[i]) != roleId.lastIndexOf(roleId[i])) {
            roleId.splice(roleId.indexOf(roleId[i]), 1);
            i--;
        }
    }
    for (let i in roleId) {
        await Privilege.create({
            roleId: roleId[i], //id của người cấp quyền xem
            resourceId: data._id,
            resourceType: "TaskProcess",
            // action: [] //quyền READ
        });
    }

    data = await TaskProcess.findById(data._id).populate({ path: 'creator', model: User, select: 'name' });
    return data;
}


/**
 * Chỉnh sửa quy trình công việc
 * @param {*} params 
 * @param {*} body dữ liệu gửi vào body từ client
 */
exports.editXmlDiagram = async (params, body) => {
    let info = [];
    for (const x in body.infoTask) {
        info.push(body.infoTask[x])
    }
    let data = await TaskProcess.findByIdAndUpdate(params.diagramId,
        {
          $set: {
              xmlDiagram: body.xmlDiagram,
              infoTask: info,
              description: body.description,
              nameProcess: body.nameProcess,
              creator: body.creator,
              viewer: body.viewer,
              manager: body.manager,
          }
        }
    )
    let data1 = await TaskProcess.find().populate({ path: 'creator', model: User, select: 'name' });
    return data1;
}

/**
 * Xóa diagram theo id
 * @param {ObjectId} diagramId 
 */
exports.deleteXmlDiagram = async (diagramId) => {
    await TaskProcess.findOneAndDelete({
        _id: diagramId,
    });
    await Privilege.findOneAndDelete({resourceId: diagramId, resourceType: "TaskProcess"})
    let data = await TaskProcess.find().populate({ path: 'creator', model: User, select: 'name' });
    return data;
}
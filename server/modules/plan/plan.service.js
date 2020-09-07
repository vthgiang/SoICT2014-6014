const { Plan } = require('../../models').schema;

// Tạo mới một kế hoạch 
exports.createPlan = async (data) => {
    let newPlan = await Plan.create({
        code: data.code,
        planName: data.planName,
        description: data.description
    });
    let plan = await Plan.findById({ _id: newPlan._id });;

    return { plan }
}

// Lấy ra tất cả các kế hoạch
exports.getPlans = async (params) => {
    let keySearch;
    if (params.code !== undefined && params.code.length !== 0) {
        keySearch = {
            ...keySearch,
            code: {
                $regex: params.code,
                $options: "i"
            }
        }
    }
    if (params.planName !== undefined && params.planName.length !== 0) {
        keySearch = {
            ...keySearch,
            planName: {
                $regex: params.planName,
                $options: "i"
            }
        }
    }
    let totalList = await Plan.count(keySearch);
    let planCollection = await Plan.find(keySearch)
        .sort({ planName: "asc" })
        .skip(params.page * params.limit)
        .limit(params.limit);
    return { data: planCollection, totalList }
}

// Lấy ra kế hoạch theo id
exports.getPlanById = async (id) => {
    let plan = await Plan.findById({ _id: id });
    if (plan) {
        return { plan };
    }
    return -1;
}

// Chỉnh sửa một kế hoạch
exports.editPlan = async (id, data) => {
    let oldPlan = await Plan.findById(id);
    if (!oldPlan) {
        return -1;
    }
    // // Cach 1 de update
    // else {
    //     oldPlan.code = data.code ? data.code : oldPlan.code;
    //     oldPlan.planName = data.planName ? data.planName : oldPlan.planName;
    //     oldPlan.description = data.description ? data.description : oldPlan.description;
    // }
    // await oldPlan.save();

    // Cach 2 de update
    await Plan.update({ _id: id }, { $set: data });

    let plan = await Plan.findById({ _id: oldPlan._id });

    return { plan };
}

// Xóa một kế hoạch
exports.deletePlan = async (id) => {
    let plan = Plan.findByIdAndDelete({ _id: id });
    return plan;
}
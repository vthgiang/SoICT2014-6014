const {
    ManufacturingMill,
    ManufacturingWorks,
    OrganizationalUnit
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);
const { getYearDay } = require(`../../../../helpers/getYearDayHelper`)

exports.createManufacturingMill = async (data, portal) => {
    let newManufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        manufacturingWorks: data.manufacturingWorks,
        description: data.description,
        workSchedules: data.workSchedules,
        teamLeader: data.teamLeader,
        status: data.status
    });
    if (data.manufacturingWorks) {
        let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
            .findById({ _id: data.manufacturingWorks });
        manufacturingWorks.manufacturingMills.push(newManufacturingMill._id);
        await manufacturingWorks.save();
    }
    let manufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal))
        .findById({ _id: newManufacturingMill._id })
        .populate([{
            path: "manufacturingWorks",
            select: "name"
        }, {
            path: "teamLeader"
        }]);
    return { manufacturingMill }
}

exports.getAllManufacturingMills = async (query, portal) => {
    let option = {};
    let { name, code, page, limit, status, currentRole } = query;
    if (name) {
        option.name = new RegExp(name, "i");
    }
    if (code) {
        option.code = new RegExp(code, "i");
    }

    if (status) {
        option.status = status;
    }

    if (currentRole) {
        // Xử  lý các quyền trước để tìm ra các kế hoạch trong các nhà máy được phân quyền
        let role = [currentRole];
        const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
        let organizationalUnitId = departments.map(department => department._id);
        let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
            organizationalUnit: {
                $in: organizationalUnitId
            }
        });
        let listWorksId = listManufacturingWorks.map(x => x._id);
        option.manufacturingWorks = {
            $in: listWorksId
        }
    }


    if (!page || !limit) {
        let docs = await ManufacturingMill(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([{
                path: "manufacturingWorks",
                select: "name"
            }, {
                path: "teamLeader"
            }]);
        let manufacturingMills = {};
        manufacturingMills.docs = docs;
        return { manufacturingMills }
    } else {
        let manufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal))
            .paginate(option, {
                limit: limit,
                page: page,
                populate: [{
                    path: "manufacturingWorks",
                    select: "name"
                }, {
                    path: "teamLeader"
                }]
            });
        return { manufacturingMills }
    }
}
exports.getManufacturingMillById = async (id, portal) => {
    let manufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
        .populate([{
            path: "manufacturingWorks",
            select: "name"
        }, {
            path: "teamLeader"
        }]);
    if (!manufacturingMill) {
        throw Error("Manufacturing Mill is not existing");
    }

    return { manufacturingMill }
}

exports.editManufacturingMill = async (id, data, portal) => {
    let oldManufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal))
        .findById({ _id: id });
    if (!oldManufacturingMill) {
        throw Error("ManufacturingMill is not existing");
    }

    oldManufacturingMill.name = data.name ? data.name : oldManufacturingMill.name;
    oldManufacturingMill.manufacturingWorks = data.manufacturingWorks ? data.manufacturingWorks : oldManufacturingMill.manufacturingWorks
    oldManufacturingMill.description = data.description ? data.description : oldManufacturingMill.description;
    oldManufacturingMill.status = data.status ? data.status : oldManufacturingMill.status;
    oldManufacturingMill.teamLeader = data.teamLeader ? data.teamLeader : oldManufacturingMill.teamLeader;

    await oldManufacturingMill.save();

    let manufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
        .populate([{
            path: "manufacturingWorks",
            select: "name"
        }, {
            path: "teamLeader"
        }]);
    return { manufacturingMill }
}

exports.deleteManufacturingMill = async (id, portal) => {
    let manufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal))
        .findByIdAndDelete(id);
    if (!manufacturingMill) {
        throw Error("ManufacturingMill is not existing");
    }

    return { manufacturingMill }
}


exports.createWorkSchedule = async (id, data, portal) => {
    const year = data.year;
    let oldManufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldManufacturingMill) {
        return -1;
    }
    else if (oldManufacturingMill.workSchedules.length > 0) {
        let workSchedules = oldManufacturingMill.workSchedules;
        for (let i = 0; i < workSchedules.length; i++) {
            if (workSchedules[i].year == year) {
                throw Error("work schedule is existed")
            }
        }
    }
    else {
        let workSchedule = {};
        let numberOfTurn = [];
        let stateOfTurn = [];
        for (let i = 0; i < 365; i++) {
            numberOfTurn.push(3);
        }
        for (let i = 0; i < 365 * 3; i++) {
            stateOfTurn.push(null);
        }
        workSchedule.year = year;
        workSchedule.numberOfTurn = numberOfTurn;
        workSchedule.stateOfTurn = stateOfTurn;
        oldManufacturingMill.workSchedules.push(workSchedule);
    }
    await oldManufacturingMill.save();
    let manufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal)).findById({ _id: oldManufacturingMill._id });
    return { manufacturingMill };
}


exports.addCommandToSchedule = async (id, data, portal) => {
    let startDateString = data.startDate;
    let endDateString = data.endDate;
    let startTurn = data.startTurn;
    let endTurn = data.endTurn;

    let startDate = new Date(startDateString);
    let endDate = new Date(endDateString);

    let oldManufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldManufacturingMill) {
        return -1;
    }
    if (oldManufacturingMill.workSchedules.length === 0) {
        throw Error("Manufacturing Mill not have schedule")
    }

    if (startDate.getFullYear() == endDate.getFullYear()) {
        // Trường hợp hai ngày truyền vào là cùng 1 năm
        let workSchedulesOfYear = oldManufacturingMill.workSchedules.filter((x) => x.year == startDate.getFullYear())[0];
        let dateOfStartTurn = getYearDay(startDate);
        let dateOfEndTurn = getYearDay(endDate);

        let indexOfStartTurn = (dateOfStartTurn - 1) * 3 + startTurn - 1;
        let indexOfEndTurn = (dateOfEndTurn - 1) * 3 + endTurn - 1;

        for (let i = indexOfStartTurn; i <= indexOfEndTurn; i++) {
            if (workSchedulesOfYear.stateOfTurn[i] !== null) {
                throw Error("Turn is invalid, da bi trung")
            }
        }

        for (let i = indexOfStartTurn; i <= indexOfEndTurn; i++) {
            workSchedulesOfYear.stateOfTurn[i] = 1;
            // workSchedulesOfYear.stateOfTurn[i] = new mongoose.Types.ObjectId("5f7ebddc6a456016c619db35");
        }
    } else {
        // Trường hợp đặc biệt xử lý khác năm nhau
        return -1
    }
    await oldManufacturingMill.markModified('workSchedules');
    await oldManufacturingMill.save();
    console.log(oldManufacturingMill.workSchedules[0]);
    let manufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal)).findById({ _id: oldManufacturingMill._id });
    return { manufacturingMill };
}
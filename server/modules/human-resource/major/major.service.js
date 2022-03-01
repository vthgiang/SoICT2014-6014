const { Employee, AnnualLeave, Major, Task } = require(`${SERVER_MODELS_DIR}`);

const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách thông tin chuyên ngành
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchMajor = async (portal, params) => {
    let keySearch = {};

    if (params?.majorName) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.majorName,
                $options: "i",
            },
        };
    }
    let task = await Task(connect(DB_CONNECTION, portal)).find({});
    // console.log('key', params, keySearch, portal, task.length);

    let listMajor = await Major(connect(DB_CONNECTION, portal))
        .find(keySearch)
        .populate([{ path: "parents" }]);
    let totalList = await Major(connect(DB_CONNECTION, portal)).countDocuments(
        keySearch
    );

    return {
        totalList,
        listMajor,
    };
};

/**
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 *
 */
exports.createNewMajor = async (portal, data) => {
    await Major(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        code: data.code,
        description: data.description,
    });

    return await this.searchMajor(portal, {});
};

/**
 * Cập nhật thông tin chuyên ngành
 * @id : Id chuyên ngành muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.editMajor = async (portal, data, params) => {
    await Major(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.id },
        {
            $set: {
                name: data.name,
                code: data.code,
                description: data.description,
            },
        },
        { $new: true }
    );

    return await this.searchMajor(portal, {});
};

// =================DELETE=====================

/**
 * Xoá chuyên ngành
 * @data : list id xóa
 */
exports.deleteMajor = async (portal, data, id) => {
    await Major(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    const majors = await Major(connect(DB_CONNECTION, portal)).find({
        parents: id,
    });
    for (let i = 0; i < majors.length; i++) {
        const major = await Major(connect(DB_CONNECTION, portal)).findById(
            majors[i]._id
        );
        major.parents.splice(major.parents.indexOf(majors[i]._id), 1);
        await major.save();
    }
    return await this.searchMajor(portal, {});
};

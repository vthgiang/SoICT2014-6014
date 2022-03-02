const { Employee, AnnualLeave, Major, Task } = require(`${SERVER_MODELS_DIR}`);

const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách thông tin chuyên ngành
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchMajor = async (portal, params, company) => {
    let keySearch = {
        company: company,
    };

    if (params?.majorName && params.majorName != "") {
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.majorName,
                $options: "i",
            },
        };
    }
    if (params.limit === undefined && params.page === undefined) {
        console.log("DDDDDDDDDDDDDDDDDDDDDDDDDD", params);
    }

    if (params.limit === undefined && params.page === undefined) {
        let data = await Major(connect(DB_CONNECTION, portal)).find(keySearch);
        return {
            listMajor: data,
            totalList: data.length,
        };
    } else {
        let data = await Major(connect(DB_CONNECTION, portal)).find(keySearch);
        listMajor = await Major(connect(DB_CONNECTION, portal))
            .find(keySearch)
            .sort({
                name: 1,
            })
            .skip(params.page)
            .limit(params.limit);
        return {
            listMajor: listMajor,
            totalList: data.length,
        };
    }
};

/**
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 *
 */
exports.createNewMajor = async (portal, data, company) => {
    await Major(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        code: data.code,
        description: data.description,
        company: company,
    });

    return await this.searchMajor(portal, {}, company);
};

/**
 * Cập nhật thông tin chuyên ngành
 * @id : Id chuyên ngành muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.editMajor = async (portal, data, params, company) => {
    await Major(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.id },
        {
            $set: {
                name: data.name,
                code: data.code,
                description: data.description,
                company: company,
            },
        },
        { $new: true }
    );

    return await this.searchMajor(portal, {}, company);
};

// =================DELETE=====================

/**
 * Xoá chuyên ngành
 * @data : list id xóa
 */
exports.deleteMajor = async (portal, data, id, company) => {
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
    return await this.searchMajor(portal, {}, company);
};

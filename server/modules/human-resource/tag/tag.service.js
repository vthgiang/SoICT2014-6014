const { Employee, Tag } = require(`${SERVER_MODELS_DIR}`);

const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách thông tin tag
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchTag = async (portal, params, company) => {
    let keySearch = {};

    if (params?.tagName && params.tagName != "") {
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.tagName,
                $options: "i",
            },
        };
    }

    if (params.limit === undefined && params.page === undefined) {
        // get all
        let data = await Tag(connect(DB_CONNECTION, portal)).find(keySearch)
            .sort({
                createdAt: "desc",
            })
        // .populate({ path: "employeeWithSuitability.employee", select: "_id fullName emailInCompany personalEmail" });
        return {
            listTag: data,
            totalList: data.length,
        };
    } else {
        let skipDoc = (params.page - 1) * params.limit

        let data = await Tag(connect(DB_CONNECTION, portal)).find(keySearch);
        listTag = await Tag(connect(DB_CONNECTION, portal))
            .find(keySearch)
            // .populate({ path: "employeeWithSuitability.employee", select: "_id fullName emailInCompany personalEmail" })
            .sort({
                createdAt: "desc",
            })
            .skip(skipDoc)
            .limit(params.limit);
        return {
            listTag: listTag,
            totalList: data.length,
        };
    }
};

/**
 * Thêm mới tag
 * @data : dữ liệu tag mới
 *
 */
exports.createNewTag = async (portal, data, company) => {
    await Tag(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        description: data.description,
        employees: data.employees,
        employeeWithSuitability: data.employeeWithSuitability,
    });

    return await this.searchTag(portal, {}, company);
};

/**
 * Cập nhật thông tin tag
 * @id : Id tag muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.editTag = async (portal, data, params, company) => {
    await Tag(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.id },
        {
            $set: {
                name: data.name,
                description: data.description,
                employees: data.employees,
                employeeWithSuitability: data.employeeWithSuitability,
            },
        },
        { $new: true }
    );

    return await this.searchTag(portal, {}, company);
};

// =================DELETE=====================

/**
 * Xoá tag
 * @data : list id xóa
 */
exports.deleteTag = async (portal, data, id, company) => {
    await Tag(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    return await this.searchTag(portal, {}, company);
};

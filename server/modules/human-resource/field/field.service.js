const {
    Field
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách lĩnh vực/ngành nghề
 * @company : Id công ty
 */
exports.getAllFields = async (portal, params, company) => {
    let keySearch = {
        company: company
    };
    if(params.name){
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.name,
                $options: "i"
            }
        }
    }
    if(params.limit===undefined&&params.page===undefined){
        let data = await Field(connect(DB_CONNECTION, portal)).find(keySearch);
        return {
            listField:data,
            totalList:data.length
        }
    } else {
        let data = await Field(connect(DB_CONNECTION, portal)).find(keySearch);
        listField = await Field(connect(DB_CONNECTION, portal)).find(keySearch)
        .sort({
            'createAt': 'desc'
        }).skip(params.page).limit(params.limit);
        return {
            listField: listField,
            totalList: data.length
        }
        return
    }
    
    
    return data
}

/**
 * Thêm mới lĩnh vực/ngành nghề
 * @data : dữ liệu lĩnh vực/ngành nghề cần thêm
 * @company : id công ty cần thêm
 */
exports.createFields = async (portal,data, company) => {
    let newField = {
        company: company,
        name:data.name,
        description: data.description,
    }
   return await Field(connect(DB_CONNECTION, portal)).create(newField)
}

/**
 * Xoá thông tin lĩnh vực/ngành nghề
 * @id : id thông tin lĩnh vực/ngành nghề cần xoá
 */
exports.deleteFields = async (portal , id, company) => {
    console.log(id)
    return await Field(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id:id
    })
}

/**
 * Cập nhật thông tin lĩnh vực/ngành nghề
 * @id : id thông tin lĩnh vực/ngành nghề cần chỉnh sửa
 * @data : dữ liệu chỉnh sửa thông tin lĩnh vực/ngành nghề
 */
exports.updateFields = async (portal, id, data, company) => {
    let fieldChange = {
        name: data.name,
        description: data.description,
    };
    console.log(id);
    console.log(fieldChange)
    await Field(connect(DB_CONNECTION, portal)).findOneAndUpdate({
        company:company,
        _id: id
    }, {
        $set: fieldChange
    });
    return await Field(connect(DB_CONNECTION, portal)).findOne({company: company, _id: id})
}
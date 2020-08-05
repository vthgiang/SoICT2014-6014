const { Material } = require('../../../models').schema;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");


// Lấy tất cả các vật tư
exports.getAllMaterials = async (params) => {
    let keySearch;
    if (params.materialName !== undefined && params.materialName.length !== 0) {
        keySearch = {
            ...keySearch, 
            materialName: {$regex: params.materialName, $options: "i"}
        }
    };
    if(params.code !== undefined && params.code.length !== 0) {
        keySearch = {
            ...keySearch,
            code: {$regex: params.code, $options: "i"}
        }
    }
    let totalList = await Material.count(keySearch);
    let listMaterials = await Material.find(keySearch)
        .sort({'materialName': 'asc'}).skip(params.page).limit(params.limit);
    return {data: listMaterials, totalList}
}

// Tạo mới một vật tư
exports.createMaterial = async (data) => {
    let createMaterial = await Material.create({
        code: data.code,
        materialName: data.materialName,
        serial: data.serial,
        purchaseDate: data.purchaseDate,
        location: data.location,
        description: data.description,
        cost: data.cost
    });
    let material = await Material.find({_id: createMaterial._id});
    return { material };
}

//Xóa một vật tư
exports.deleteMaterial = async (id) => {
    let material = Material.findByIdAndDelete({_id: id})
    return material;
}

// Sửa thông tin của vật tư
exports.updateMaterial = async (id, data) => {
    let oldMaterial = await Material.findById(id);
    if(!oldMaterial){
        return -1;
    }
    else{
        oldMaterial.code = data.code,
        oldMaterial.materialName = data.materialName,
        oldMaterial.serial = data.serial,
        oldMaterial.purchaseDate = data.purchaseDate,
        oldMaterial.location = data.location,
        oldMaterial.description = data.description,
        oldMaterial.cost = data.cost
    }

    oldMaterial.save();
    let material = await Material.findById({_id: oldMaterial._id});
    return { material };
}
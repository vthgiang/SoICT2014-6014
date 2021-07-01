const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const { PrivilegeApi, Company } = require(`../../../../models`);
const { connect } = require(`../../../../helpers/dbHelper`);

const getPrivilegeApis = async (data) => {
    const { email, companyIds, page = 1, perPage = 30 } = data

    let keySearch = {}

    if (email) {
        keySearch = {
            ...keySearch,
            email: {
                $regex: path,
                $options: "i"
            }
        }
    }

    if (companyIds) {
        keySearch = {
            ...keySearch,
            company: { $in: companyIds.map(item => mongoose.Types.ObjectId(item)) }
        }
    }

    let privilegeApis = await PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .find(keySearch)
        .skip(perPage * (page - 1))
        .limit(Number(perPage))
        .populate('company')

    let totalPrivilegeApis = await PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .countDocuments(keySearch)
    let totalPages = Math.ceil(totalPrivilegeApis / perPage);
    console.log(totalPages)

    return {
        "privilegeApis": privilegeApis,
        "totalPrivilegeApis": totalPrivilegeApis,
        "totalPages": totalPages
    };
}

/** Thêm phân quyền API
 * @email email người được sử dụng
 * @apis mảng gồm các link api
 * @company công ty được lấy dữ liệu
 */
const createPrivilegeApi = async (data) => {
    const { email, apis, companyId } = data

    // Check sự tồn tại của phân quyền
    let privilege = await PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .findOne({
            email: email,
            company: mongoose.Types.ObjectId(companyId),
        })
    if (privilege) {
        throw {
            messages: "privilege_api_exist",
        };
    }

    // Check tồn tại company
    let company = await Company(connect(DB_CONNECTION, process.env.DB_NAME))
        .findById(companyId)

    if (!company) {
        throw {
            messages: "company_not_exist",
        };
    } 

    const token = await jwt.sign(
        {
            email: email,
            company: companyId,
            portal: company.shortName,
            thirdParty: true
        },
        process.env.TOKEN_SECRET
    );

    privilege = await PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .create({
            email: email,
            apis: apis,
            company: companyId,
            token: token
        })
        
    await Company(connect(DB_CONNECTION, process.env.DB_NAME))
        .populate(privilege, { path: "company" })

    return privilege
}

exports.SystemApiPrivilegeServices = {
    getPrivilegeApis,
    createPrivilegeApi
}
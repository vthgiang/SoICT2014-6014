const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const { PrivilegeApi, Company, SystemApi } = require(`../../../../models`);
const { connect } = require(`../../../../helpers/dbHelper`);

const getPrivilegeApis = async (portal, data) => {
    const { email, companyIds, role, page = 1, perPage = 30, creator } = data

    let privilegeApis, totalPrivilegeApis, totalPages
    let keySearch = {}

    if (creator) {
        keySearch = {
            ...keySearch,
            creator: mongoose.Types.ObjectId(creator)
        }
    }

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

    if (role === 'system_admin') {
        privilegeApis = await PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
            .find(keySearch)
            .skip(perPage * (page - 1))
            .limit(Number(perPage))
            .populate('company')

        totalPrivilegeApis = await PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
            .countDocuments(keySearch)
        totalPages = Math.ceil(totalPrivilegeApis / perPage);
    } else if (role === 'admin') {
        privilegeApis = await PrivilegeApi(connect(DB_CONNECTION, portal))
            .find(keySearch)
            .skip(perPage * (page - 1))
            .limit(Number(perPage))
            .populate('company')

        totalPrivilegeApis = await PrivilegeApi(connect(DB_CONNECTION, portal))
            .countDocuments(keySearch)
        totalPages = Math.ceil(totalPrivilegeApis / perPage);
    }

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
    const { email, name, apis, companyId, role, description, startDate, endDate, userId } = data

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

    let systemApis = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .find({
            _id: { $in: apis }
        })
    systemApis = systemApis.map(item => {
        return {
            path: item.path,
            method: item.method
        }
    })

    if (role === 'system_admin' || role === 'admin') {
        // set time token
        let expiresIn = 0;
        if (startDate && endDate) {
            let startDateUtc = new Date(startDate)
            let endDateUtc = new Date(endDate)

            expiresIn = endDateUtc?.getTime() - startDateUtc?.getTime()
        }

        const token = await jwt.sign(
            {
                email: email,
                company: companyId,
                portal: company.shortName,
                thirdParty: true
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: expiresIn 
            }
        );
        console.log("role", role)
    
        if (role === 'system_admin') {
            // Them vao csdl system admin
            privilege = await PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
                .create({
                    email: email,
                    apis: systemApis,
                    company: companyId,
                    status: 3,
                    token: token,
                    startDate: startDate && new Date(startDate),
                    endDate: endDate && new Date(endDate),
                    creator: userId
                })
            await Company(connect(DB_CONNECTION, process.env.DB_NAME))
                .populate(privilege, { path: "company" })

            // Them vao csdl cua tung cty
            await PrivilegeApi(connect(DB_CONNECTION, company.shortName))
                .create({
                    email: email,
                    apis: systemApis,
                    company: companyId,
                    status: 3,
                    token: token,
                    startDate: startDate && new Date(startDate),
                    endDate: endDate && new Date(endDate),
                    creator: userId
                })
        } else if (role === 'admin') {
            privilege = await PrivilegeApi(connect(DB_CONNECTION, company.shortName))
                .create({
                    email: email,
                    apis: systemApis,
                    company: companyId,
                    status: 3,
                    token: token,
                    startDate: startDate && new Date(startDate),
                    endDate: endDate && new Date(endDate),
                    creator: userId
                })
                
            await Company(connect(DB_CONNECTION, process.env.DB_NAME))
                .populate(privilege, { path: "company" })
        }
    } else {
        privilege = await PrivilegeApi(connect(DB_CONNECTION, company.shortName))
            .create({
                email: email,
                name: name,
                description: description,
                apis: systemApis,
                company: companyId,
                status: 1,
                startDate: startDate && new Date(startDate),
                endDate: endDate && new Date(endDate),
                creator: userId
            })     
    }
     
    return privilege
}

const updateStatusPrivilegeApi = async (portal, data) => {
    const { privilegeApiIds, status = 0, role } = data

    portal = role === 'system_admin' ? process.env.DB_NAME : portal

    if (Number(status) === 0 || Number(status) === 2) {
        await PrivilegeApi(connect(DB_CONNECTION, portal))
            .update(
                { _id: { $in: privilegeApiIds.map(item => mongoose.Types.ObjectId(item)) } },
                {
                    status: status
                }
            )
    } else if (Number(status) === 3) {
        for (let i = 0; i < privilegeApiIds?.length; i++) {
            let privilege = await PrivilegeApi(connect(DB_CONNECTION, portal))
                .findOne({
                    _id: mongoose.Types.ObjectId(privilegeApiIds[i])
                })
                .populate('company')

            // set time token
            let expiresIn = 0;
            if (privilege?.startDate && privilege?.endDate) {
                let startDate = new Date(privilege?.startDate)
                let endDate = new Date(privilege?.endDate)

                expiresIn = endDate?.getTime() - startDate?.getTime()
            }

            const token = await jwt.sign(
                {
                    email: privilege?.email,
                    company: privilege?.company?._id,
                    portal: privilege?.company?.shortName,
                    thirdParty: true
                },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: expiresIn 
                }
            );

            console.log(888)

            await PrivilegeApi(connect(DB_CONNECTION, portal))
                .update(
                    { _id: mongoose.Types.ObjectId(privilegeApiIds[i]) },
                    {
                        status: status,
                        token: token
                    }
                )
        }
    }

    let privilegeApis = await PrivilegeApi(connect(DB_CONNECTION, portal))
        .find({
            _id: { $in: privilegeApiIds.map(item => mongoose.Types.ObjectId(item)) }
        })
        .populate('company')

    return privilegeApis
}

const deletePrivilegeApis = async (portal, data) => {
    const { privilegeApiIds, role } = data

    portal = role === 'system_admin' ? process.env.DB_NAME : portal

    let privilegeApis = await PrivilegeApi(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: privilegeApiIds.map(item => mongoose.Types.ObjectId(item)) } });

    return
}

exports.SystemApiPrivilegeServices = {
    getPrivilegeApis,
    createPrivilegeApi,
    updateStatusPrivilegeApi,
    deletePrivilegeApis
}
const { Privilege, Role, Link, Component, Company, PrivilegeApi } = require(`../../../models`);
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require("mongoose");

/**
 * Lấy danh sách các api của công ty
 * @special nếu = "group", group các documents theo category 
 */
exports.getApis = async (portal, query) => {
    const { path, method, category, page = 1, perPage = 30, special } = query

    let keySearch = {}

    if (path) {
        keySearch = {
            ...keySearch,
            path: {
                $regex: path,
                $options: "i"
            }
        }
    }

    if (category) {
        keySearch = {
            ...keySearch,
            category: {
                $regex: path,
                $options: "i"
            }
        }
    }

    if (method?.length > 0) {
        keySearch = {
            ...keySearch,
            method: { $in: method }
        }
    }

    let aggregateFilter = [
        {
            $match: { "shortName": portal }
        },

        {
            $lookup: {
                from: "systemapis",
                localField: "apis",
                foreignField: "_id",
                as: "systemApis"
            }
        },
        { $unwind: "$systemApis" },
        { $replaceRoot: { newRoot: "$systemApis" } },

        {
            $match: keySearch
        }
    ]

    let totalApis = await Company(connect(DB_CONNECTION, process.env.DB_NAME))
        .aggregate([
            ...aggregateFilter,
            {
                $count: "totalApis"
            },
        ])
    totalApis = totalApis?.[0]?.totalApis

    if (special === "group") {
        aggregateFilter = [
            ...aggregateFilter,
            {
                $group : { _id : "$category", apis: { $push: "$$ROOT" } }
            }
           
        ]
    }

    let apis = await Company(connect(DB_CONNECTION, process.env.DB_NAME))
        .aggregate([
            ...aggregateFilter,
            { $skip : perPage * (page - 1) },
            { $limit : Number(perPage) }
        ])     
    let totalPages = Math.ceil(totalApis / perPage);
            
    return {
        apis,
        totalApis,
        totalPages
    }
}

exports.getApiRegistration = async (companyId, query) => {
    const { email, page = 1, perPage = 30 } = query

    let keySearch = {
        company: mongoose.Types.ObjectId(companyId)
    }

    if (email) {
        keySearch = {
            ...keySearch,
            email: {
                $regex: email,
                $options: "i"
            }
        }
    }

    let apiRegistrations = await PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .find(keySearch)
        .skip(perPage * (page - 1))
        .limit(Number(perPage))  

    let totalApiRegistrations = await PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .countDocuments(keySearch)

    let totalPages = Math.ceil(totalApiRegistrations / perPage);  

    return {
        apiRegistrations,
        totalApiRegistrations,
        totalPages
    }
}

exports.registerToUseApi = async (query) => {
    const { email, name, description, registrationApis, companyId, startDate, endDate } = query

    let privilegeApi = await PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .create({
            email: email,
            name: name,
            description: description,
            apis: registrationApis,
            company: mongoose.Types.ObjectId(companyId),
            status: 1,
            startDate: startDate && new Date(startDate),
            endDate: endDate && new Date(endDate)
        })     
            
    return privilegeApi
}

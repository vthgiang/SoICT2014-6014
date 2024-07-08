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
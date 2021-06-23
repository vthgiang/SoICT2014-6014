const { SystemApi, PrivilegeApi } = require(`../../../models`);
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

const getSystemApis = async (data) => {
    const { path, method, description, page = 1, perPage = 30 } = data

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

    if (method?.length > 0) {
        keySearch = {
            ...keySearch,
            method: { $in: method }
        }
    }

    if (description) {
        keySearch = {
            ...keySearch,
            description: {
                $regex: description,
                $options: "i"
            }
        }
    }

    let systemApis = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .find(keySearch)
        .skip(perPage * (page - 1))
        .limit(Number(perPage))

    let totalSystemApis = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .countDocuments(keySearch)
    let totalPages = Math.ceil(totalSystemApis / perPage);

    return {
        "systemApis": systemApis,
        "totalSystemApis": totalSystemApis,
        "totalPages": totalPages
    };
}

const createSystemApi = async (data) => {
    const { path, method, description } = data

    let checkSystemApi = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .findOne({
            path: path,
            method: method
        })

    if (checkSystemApi) {
        throw {
            messages: 'system_api_exist'
        }
    } else {
        let systemApi = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
            .create({
                path: path,
                method: method,
                description: description
            })

        return systemApi
    }
};

/** Cập nhật tự động những API mới tạo
 * @app value được khởi tạo bởi express
 */
const updateSystemApiAutomatic = async (app) => {
    let routes = []

    async function print (path, layer) {
        if (layer.route) {
            layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
        } else if (layer.name === 'router' && layer.handle.stack) {
            layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
        } else if (layer.method) {
            let currentMethod = layer.method.toUpperCase()
            let currentPath = path.concat(split(layer.regexp)).filter(Boolean).join('/')

            if (!routes.find(ele => 
                ele.method === currentMethod
                && ele.path === currentPath
            )) {
                routes.push({
                    method: currentMethod,
                    path: currentPath
                })

                let check = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
                    .findOne({
                        method: currentMethod,
                        path: currentPath
                    })
                if (!check) {
                    await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
                        .create({
                            method: currentMethod,
                            path: currentPath
                        })
                }
            }
        }
    }
      
    function split (thing) {
        if (typeof thing === 'string') {
          return thing.split('/')
        } else if (thing.fast_slash) {
          return ''
        } else {
          var match = thing.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
          return match
            ? match[1].replace(/\\(.)/g, '$1').split('/')
            : '<complex:' + thing.toString() + '>'
        }
    }

    app._router.stack.forEach(print.bind(null, []))
}

/** Chinh sua API */
const editSystemApi = async (systemApiId, data) => {
    const { path, method, description } = data

    let systemApi = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .updateOne(
            { _id: mongoose.Types.ObjectId(systemApiId) },
            {
                $set: {
                    path: path,
                    method: method,
                    description: description
                }
            }
        )
    systemApi = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .findById(systemApiId)

    return systemApi
}

/** Xoa system API */
const deleteSystemApi = async (systemApiId) => {
    let systemApi = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .deleteOne( { "_id" : mongoose.Types.ObjectId(systemApiId) } )

    return
}

/** Thêm phân quyền API
 * @email email người được sử dụng
 * @apis mảng gồm các object { path, company }
 */
const createPrivilegeApi = async (data) => {
    const { email, apis} = data
    
    const token = await jwt.sign(
        {
            email: email,
        },
        process.env.TOKEN_SECRET
    );

    let privilege = PrivilegeApi(connect(DB_CONNECTION, process.env.DB_NAME))
        .create({
            email: email,
            apis: apis,
            token: token
        })

    return privilege
}

exports.SystemApiServices = {
    getSystemApis,
    createSystemApi,
    editSystemApi,
    deleteSystemApi,
    updateSystemApiAutomatic,
    createPrivilegeApi
}
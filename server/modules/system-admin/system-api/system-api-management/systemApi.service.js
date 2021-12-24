const { SystemApi, Company, Api } = require(`../../../../models`);
const { connect } = require(`../../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const fs = require('fs').promises;

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

const updateSystemApi = async (app) => {
    /**
     * GET ALL NODEJS ROUTES
     */
    let appRoutes = []

    /**
     * Hàm này dùng để phân tách path hoặc regexp để lấy ra các phần của router path và route path
     * @param {*} thing 
     * @returns 
     */
    const getPathPortionArr = (thing) => {
        if (typeof thing === 'string') {
            /**
             * Trường hợp là route
             * thing = e.g. /super-admin/privilege-api
             */
            return thing.split('/')
        } else if (thing.fast_slash) {
            return ''
        } else {
            /**
             * Trường hợp là router
             * thing = Layer.regexp
             */
            var match = thing.toString()
                .replace('\\/?', '')
                .replace('(?=\\/|$)', '$')
                .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)

            return match
                ? match[1].replace(/\\(.)/g, '$1').split('/')
                : '<complex:' + thing.toString() + '>'
        }
    }

    const getRoute = async (path, layer) => {
        if (layer.route) {
            /**
             * Layer hiện tại là một route
             * Một route có thể có nhiều Method ứng với nó
             */
            layer.route.stack.forEach(getRoute.bind(null, path.concat(getPathPortionArr(layer.route.path))))
        } else if (layer.name === 'router' && layer.handle.stack) {
            /**
             * Layer hiện tại là một router
             * Trong một router có thể có một hoặc nhiều routers hoặc routes
             */
            layer.handle.stack.forEach(getRoute.bind(null, path.concat(getPathPortionArr(layer.regexp))))
        } else if (layer.method) {
            /**
             * Với mỗi method của route, lưu lại vào trong appRoutes
             */
            let currentMethod = layer.method.toUpperCase()
            let currentPath = "/" + path.concat(getPathPortionArr(layer.regexp)).filter(Boolean).join('/')
            let category = "/" + path.concat(getPathPortionArr(layer.regexp)).filter(Boolean)?.[0]

            /**
             * Nếu không có API trùng thì thêm vào appRoutes
             */
            if (!appRoutes.find(el =>
                el.method === currentMethod
                && el.path === currentPath
            )) {
                appRoutes.push({
                    method: currentMethod,
                    path: currentPath,
                    category: category
                })
            }
        }
    }

    app._router.stack.forEach((layer) => getRoute([], layer));

    /**
     * So sánh dữ liệu toàn bộ routes mới lấy với dữ liệu của system-api
     * Xem những api nào được thêm/sửa/xóa
     * Ghi các thay đổi vào một file log
     */
    const systemApis = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME)).find()

    let updateApiLog = {
        add: {
            type: 'add',
            apis: []
        },
        remove: {
            type: 'remove',
            apis: []
        }
    };

    try {
        const updateApiLogText = await fs.readFile('middleware/systemApiChangedLog.log', 'utf8');
        updateApiLog = JSON.parse(updateApiLogText);
    } catch (error) { }

    for (let i = 0; i < appRoutes.length; i++) {
        const systemApiIndex = systemApis.findIndex(systemApi =>
            appRoutes[i].path === systemApi.path
            && appRoutes[i].method === systemApi.method);

        if (systemApiIndex >= 0) {
            systemApis.splice(systemApiIndex, 1);
        } else {
            await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME)).create(appRoutes[i])

            updateApiLog.add.apis.push({
                path: appRoutes[i].path,
                method: appRoutes[i].method,
            })
        }
    }

    systemApis.forEach(async api => {
        await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
            .deleteOne(api)

        updateApiLog.remove.apis.push({
            path: api.path,
            method: api.method,
        })
    });

    try {
        await fs.writeFile("middleware/systemApiChangedLog.log", JSON.stringify(updateApiLog), {
            encoding: "utf8",
        });
    } catch (error) { }

    return {
        updateApiLog,
        systemApis: appRoutes
    };
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
        .deleteOne({ "_id": mongoose.Types.ObjectId(systemApiId) })

    return
}

exports.SystemApiServices = {
    getSystemApis,
    createSystemApi,
    editSystemApi,
    deleteSystemApi,
    updateSystemApi,
}
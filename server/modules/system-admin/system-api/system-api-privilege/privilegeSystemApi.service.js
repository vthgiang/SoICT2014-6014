const { PrivilegeApi } = require(`../../../../models`);
const { connect } = require(`../../../../helpers/dbHelper`);

/** Thêm phân quyền API
 * @email email người được sử dụng
 * @apis mảng gồm các object { path, company }
 */
const createPrivilegeApi = async (data) => {
    const { email, apis} = data
    
    const token = await jwt.sign(
        {
            email: email,
            thirdParty: true
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

exports.SystemApiPrivilegeServices = {
    createPrivilegeApi
}
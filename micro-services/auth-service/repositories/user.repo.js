const { connect} = require(`../helpers/dbHelper`);
const User = require('@/models/user.model');

const findUserByEmail = async (email) => {
    return await User
    .findOne({email})
    .populate([
        {
            path: "roles",
            populate: [{
                path: "roleId",
                populate: { path: "type" }
            }, {
                path: "delegation",
                select: "_id delegator",
                populate: { path: "delegator", select: "_id name" }
            }]
        },
    ]);
}

// findUserById
const findUserById = async (id) => {
    return await User.findById(id);
}

const getUserProfile = async (portal, userId) => {
    return await User
    .findById(userId)
    .select("-password -status -deleteSoft -tokens")
    .populate([{ path: "roles", populate: [{ path: "roleId", populate: { path: "type" } }, { path: "delegation", select: "_id delegator", populate: { path: "delegator", select: "name" } }] }]).lean();
}
const saveInfoUser = async (userInfo) => {
    const user = new User(userInfo);
    await user.save();
    return user;
}

const findPortal = async (conditions) => {
    return await User(connect(DB_CONNECTION, portal)).findOne(conditions );
}

const findPortalByIdSelectPassword = async (portal, userId) => {
    return await User(connect(DB_CONNECTION, portal))
    .findById(userId)
    .select('-password')
    .populate([{ path: "roles", populate: { path: "roleId" } }]);
}

const findUserByIdPortal = async (portal, userId) => {
    return await User(connect(DB_CONNECTION, portal)).findById(userId);
}

const findPortalById = async (portal, userId) => {
    await User(connect(DB_CONNECTION, portal))
        .findById(userId)
        .populate([{ path: "roles", populate: { path: "roleId" } }]);
}

const findPortalByEmail = async (portal, email) => {
    await User(connect(DB_CONNECTION, portal)).findOne({ email: email });
}

const checkPasswordUser = async (portal, userId) => {
    return await User(
        connect(DB_CONNECTION, portal)
    ).findById(userId);
}


const deleteUserByPassword = async (password) => {
    return await User.deleteOne({ password });
}
module.exports = {
    findUserByEmail,
    findUserById,
    saveInfoUser,
    getUserProfile,
    findPortal,
    findPortalById,
    findPortalByEmail,
    deleteUserByPassword,
    findUserByIdPortal,
    findPortalByIdSelectPassword,
    checkPasswordUser
};
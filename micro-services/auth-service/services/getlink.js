const DelegationService = require(`../delegation/delegation.service`);
/**
 * Lấy ra các trang mà người dùng có quyền truy cập
 * @param {*} roleId : id role người dùng
 */
const getLinksThatRoleCanAccess = async (portal, roleId, userId) => {
    const role = await Role.findById(roleId); //lay duoc role hien tai
    let roles = [role._id, ...role.parents];
    const privilege = await Privilege
        .find({
            roleId: { $in: roles },
            resourceType: "Link",
        })
        .populate({ path: "resourceId" });
    const userrole = await UserRole.findOne({ userId, roleId: role._id });


    // Lấy ds các link theo RBAC original và ko có policy
    let links = await privilege
        .filter((pri) => pri.resourceId.deleteSoft === false && pri.policies.length == 0)
        .map((pri) => pri.resourceId);

    // Gán thêm các link được phân quyền theo policy với những user có UserRole và Privilege khớp policy
    privilege.forEach(pri => {
        if (pri.policies.length > 0) {
            if (userrole.policies.length > 0) {
                if (pri.policies.some(policy => userrole.policies.includes(policy)) && pri.resourceId.deleteSoft === false) {
                    links = links.concat(pri.resourceId)
                }
            }
        }
    })

    let delegationAllowedLinks = [];
    // Nếu role đó là role được ủy quyền
    if (userrole.delegation) {
        let delegateeDelegation = await Delegation.findOne({ _id: userrole.delegation });

        privilege.forEach(pri => {
            if (pri.delegations.length > 0) {
                // Kiểm tra privilege có được delegate không thì thêm links
                if (userrole.delegation) {
                    if (pri.delegations.some(delegation => userrole.delegation.toString() == delegation.toString()) && pri.resourceId.deleteSoft === false) {
                        delegationAllowedLinks = delegationAllowedLinks.concat(pri.resourceId);
                    }
                }
            }
        })
        // Lọc ra các link được phép truy cập theo tùy chọn trang trong cấu hình ủy quyền
        links = delegationAllowedLinks.length > 0 ? links.filter(link => delegationAllowedLinks.includes(link)) : links;
        await DelegationService.saveLog(portal, delegateeDelegation, delegateeDelegation.delegatee, role.name, "switch_delegate_role", new Date())

    }

    return links;
};

module.exports = {
    getLinksThatRoleCanAccess
};
const { OrganizationalUnit } = require('../../../models');
const { connect } = require('../../../helpers/dbHelper');

/**
 * SERVICE: Lấy thông tin của đơn vị và các role trong đơn vị đó của user
 * Chi tiết dữ liệu trả về:
 * 1. Thông tin về đơn vị
 * 2. Thông tin về các vai trò trong đơn vị (Trưởng dv, Phó dv, Nhân viên dv)
 * 3. Id của các user tương ứng với từng vai trò của đơn vị
 * --------------------------------------
 * Thông tin xác định dựa trên 3 tham số
 * 1. companyId - tìm kiếm trong phạm vi công ty của người dùng
 * 2. userId - id của người dùng
 * 3. roleId - xác định vai trò truy cập hiện tại của người dùng trên website (vd: đang truy cập với quyền là Nhân viên phòng hành chính,...)
 */
exports.getOrganizationalUnitByUserRole = async (portal, roleId) => {
  const department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
    .findOne({
      $or: [{ managers: roleId }, { deputyManagers: roleId }, { employees: roleId }],
    })
    .populate([
      { path: 'managers', populate: { path: 'users' } },
      { path: 'deputyManagers', populate: { path: 'users' } },
      { path: 'employees', populate: { path: 'users' } },
    ]);

  return department;
};

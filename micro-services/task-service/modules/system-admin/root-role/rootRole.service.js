const { RootRole } = require('../../../models');
const { connect } = require('../../../helpers/dbHelper');

exports.getAllRootRoles = async () => {
  return await RootRole(connect(DB_CONNECTION, process.env.DB_NAME)).find();
};

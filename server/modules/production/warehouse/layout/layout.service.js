const { Layout } = require("../../../../models");
const { connect } = require("../../../../helpers/dbHelper");
const { Routes } = require("../../../../models");
exports.getAllLayouts = async (portal) => {
  return Layout(connect(DB_CONNECTION, portal))
    .find()
    .select("-_id -inventory -__v");
};


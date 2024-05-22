const Models = require(`../../../../models`);
const { AllocationConfigSetting } = Models;
const { connect } = require(`../../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// // /**
// //  * Get config setting data base company id
// //  * @param {*} company_id
// //  * @param {*} portal
// //  */
// const getConfigSettingData = async (company_id, portal) => {
//     const companyConfigSetting = await AllocationConfigSetting(connect(DB_CONNECTION, portal)).find({ company: new ObjectId(company_id) });
//     return companyConfigSetting;
// };

// const updateConfigSettingData = async (id, payload, portal) => {
//     const result = await AllocationConfigSetting(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, payload, {
//         new: true,
//         runValidators: true,
//     });
//     return result
// };

module.exports = {
    // getConfigSettingData,
    // updateConfigSettingData,
};

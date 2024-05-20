const { Layout } = require('../../../../models');
const { connect } = require('../../../../helpers/dbHelper');

exports.getAllLayouts = async (portal) => {
    // var { page, limit, managementLocation } = query;
    //     const LayoutModel = Layout(connect(DB_CONNECTION, portal));
        // const layoutTest = await LayoutModel.create({
        //     "LOCATION": "A10-100-R-2052-1914-0",
        //     "WIDTH": 48,
        //     "DEPTH": 48,
        //     "HEIGHT": 82,
        //     "X": 2052,
        //     "Y": 1914,
        //     "Z": 0,
        //     "AISLE": "A10",
        //     "CENTERAXIS": "X",
        //     "AISLESIDE": "R",
        //     "BAY": 100,
        //     "WAREHOUSE": "WARREN",
        //     "AREA": "A",
        //     "LEVEL": 1
        //
        // });
        // console.log(layoutTest)
        return Layout(connect(DB_CONNECTION, portal)).find().select('-_id -__v');
}


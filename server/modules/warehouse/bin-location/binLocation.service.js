const arrayToTree = require("array-to-tree");

const { BinLocation } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getBinLocations = async (portal) => {
    const listBin = await BinLocation(connect(DB_CONNECTION, portal)).find();
    const dataConverted = listBin.map(bin => {
        return {
            id: bin._id.toString(),
            key: bin._id.toString(),
            value: bin._id.toString(),
            lable: bin.name,
            title: bin.name,
            parent_id: bin.parent ? bin.parent.toString() : null,
            child_id: bin.child ? bin.child.toString() : null
        }
    });
    const tree = await arrayToTree(dataConverted, {});
    return { listBin, tree };
}

async function findPath(data){
    let path = "";
    let arrParent =[];
    arrParent.push(data.name);
    if(data.parent && data.parent !== "#"){
        let parent = data.parent;
        while(parent){
            let tmp = await BinLocation(connect(DB_CONNECTION, portal)).findById(parent);
            arrParent.push(tmp.name);
            parent = tmp.parent;
        }
    }
    path = arrParent.reverse().join(" - ");
    return path;
}

exports.createBinLocation = async (portal, data) => {
    let query = {
        code: data.code,
        name: data.name,
        status: data.status,
        description: data.description,
        stock: data.stock,
        users: data.users,
        goods: data.goods,
        enableGood: data.enableGood,
        capacity: data.capacity,
        contained: data.contained,
        unit: data.unit,
    }
    if(data.parent && data.parent.length){
        query.parent = data.parent
    }
    if(data.child && data.child.length){
        query.child = data.child
    }
}
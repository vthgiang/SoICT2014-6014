const Item = require('../../models/test-many-to-many-relationship/item.model');
const Store = require('../../models/test-many-to-many-relationship/store.model');
const ItemStore = require('../../models/test-many-to-many-relationship/item_store.model');

exports.get = async (req, res) => {
    //code here
}

exports.getById = async (req, res) => {
    //code here
}

exports.create = async(req, res) => {
    //code here
}

exports.edit = async(req, res) => {
    //code here}
}

exports.delete = async(req, res) => {
    //code here
}

exports.createItem = async(data) => {
    var item = await Item.create({
        name: data
    });

    return item;
}

exports.createStore = async(data) => {
    var store = await Store.create({
        name: data
    });

    return store;
}

exports.relationshipItemStore = async(itemId, storeId) => {
    var item_store = await ItemStore.create({
        itemId: itemId,
        storeId: storeId
    });

    return item_store;
}

exports.getItem = async() => {
    console.log("items -- -- --");
    var items = await Item.find()
        .populate({
            path: 'stores',
            populate: { path: 'storeId' }
        });

    return items;
}


const SampleService = require('./_sample.service');

exports.get = (req, res) => {
    //code here
};

exports.create = (req, res) => {
    //code here
};

exports.show = (req, res) => {
    //code here
};

exports.edit = (req, res) => {
    //code here
};

exports.delete = (req, res) => {
    //code here
};

exports.createItem = async (req, res) => {
    try {
        console.log("Create item");
        var item = await SampleService.createItem(req.body.item);
        var store = await SampleService.createStore(req.body.store);
        var item_store = await SampleService.relationshipItemStore(item._id, store._id);
        console.log(item);
        console.log(store);
        console.log(item_store);
        res.status(200).json({
            item, store, item_store
        });
    } catch (error) {
        
        res.status(400).json(error);
    }

};

exports.createStore = async (req, res) => {
    try {
        var store = await SampleService.createStore(req.body);

        res.status(200).json(store);
    } catch (error) {
        
        res.status(400).json(error);
    }

};

exports.getItem = async (req, res) => {
    try {
        console.log("GET ITEM");
        var items = await SampleService.getItem();
        
        res.status(200).json(items);
    } catch (error) {
        
        res.status(400).json(error);
    }

};
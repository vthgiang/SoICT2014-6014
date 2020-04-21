const DocumentServices = require('./document.service');
const { Logger } = require('../../logs');

exports.get = async (req, res) => {
    try {
        const documents = await DocumentServices.get(req.user.company._id);

        //isLog && Logger.info("[GET_DOCUMENTS"+req.user.email);
        res.status(200).json(documents);
        
    } catch (error) {

        //isLog && Logger.error("[GET_DOCUMENTS]"+req.user.email);
        res.status(400).json(error);
    }

};

exports.create = async (req, res) => {
    try {
        const document = await DocumentServices.create(req.user.company._id, req.body);

        //isLog && Logger.info("[CREAT_DOCUMENT]"+req.user.email);
        res.status(200).json(document);
    } catch (error) {

        //isLog && Logger.error("[CREATE_DOCUMENT]"+req.user.email);
        res.status(400).json(error);
    }
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
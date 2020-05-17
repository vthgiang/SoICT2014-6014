const DocumentServices = require('./document.service');
const { LogInfo, LogError } = require('../../logs');

exports.getDocumentCategories = async (req, res) => {
    try {
        const types = await DocumentServices.getDocumentCategories(req.user.company._id);
        
        await LogInfo(req.user.email, 'GET_DOCUMENT_TYPES', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_document_types_success'],
            content: types
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_DOCUMENT_TYPES', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_document_types_faile'],
            content: error
        });
    }
};

exports.createDocumentCategory = async (req, res) => {
    try {
        const type = await DocumentServices.createDocumentCategory(req.user.company._id, req.body);
        
        await LogInfo(req.user.email, 'CREATE_DOCUMENT_TYPE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_document_type_success'],
            content: type
        });
    } catch (error) {
        
        await LogError(req.user.email, 'CREATE_DOCUMENT_TYPE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_document_type_faile'],
            content: error
        });
    }
};

exports.showDocumentCategory = (req, res) => {

};

exports.editDocumentCategory = (req, res) => {
};

exports.deleteDocumentCategory = (req, res) => {
};

// Danh mục văn bản
exports.getDocumentDomains = async (req, res) => {
    try {
        const domains = await DocumentServices.getDocumentDomains(req.user.company._id);
        
        await LogInfo(req.user.email, 'GET_DOCUMENT_DOMAINS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_document_domains_success'],
            content: domains
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_DOCUMENT_DOMAINS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_document_domains_faile'],
            content: error
        });
    }
};

exports.createDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.createDocumentDomain(req.user.company._id, req.body);
        
        await LogInfo(req.user.email, 'CREATE_DOCUMENT_DOMAIN', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_document_domain_success'],
            content: domain
        });
    } catch (error) {
        
        await LogError(req.user.email, 'CREATE_DOCUMENT_DOMAIN', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_document_domain_faile'],
            content: error
        });
    }
};

exports.showDocumentDomain = (req, res) => {

};

exports.editDocumentDomain = (req, res) => {
};

exports.deleteDocumentDomain = (req, res) => {
};
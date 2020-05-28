const DocumentServices = require('./document.service');
const { LogInfo, LogError } = require('../../logs');

/**
 * Các controller cho phần quản lý tài liệu văn bản
 */
exports.getDocuments = async (req, res) => {
    try {
        const documents = await DocumentServices.getDocuments(req.user.company._id);
        
        await LogInfo(req.user.email, 'GET_DOCUMENTS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_documents_success'],
            content: documents
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_DOCUMENTS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_documents_faile'],
            content: error
        });
    }
};

exports.createDocument = async (req, res) => {
    try {
        if(req.files !== undefined){
            var pathFile = req.files.file[0].destination +'/'+ req.files.file[0].filename;
            var pathFileScan = req.files.fileScan[0].destination +'/'+ req.files.fileScan[0].filename;

            req.body.file = pathFile;
            req.body.scannedFileOfSignedDocument = pathFileScan;
            console.log("document create: ", req.body);
        }
        const document = await DocumentServices.createDocument(req.user.company._id, req.body);
        
        await LogInfo(req.user.email, 'CREATE_DOCUMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_document_success'],
            content: document
        });
    } catch (error) {
        console.log(error)
        await LogError(req.user.email, 'CREATE_DOCUMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_document_faile'],
            content: error
        });
    }
};

exports.showDocument = (req, res) => {

};

exports.editDocument = async (req, res) => {
    try {
        const document = await DocumentServices.editDocument(req.params.id, req.body);
        
        await LogInfo(req.user.email, 'EDIT_DOCUMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_document_success'],
            content: document
        });
    } catch (error) {
        console.log(error)
        await LogError(req.user.email, 'EDIT_DOCUMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_document_faile'],
            content: error
        });
    }
};

exports.deleteDocument = (req, res) => {
};

exports.downloadDocumentFile = async (req, res) => {
    try {
        const file = await DocumentServices.downloadDocumentFile(req.params.id);
        await LogInfo(req.user.email, 'DOWNLOAD_DOCUMENT_FILE', req.user.company);
        res.download(file.path, file.name);
    } catch (error) {
        await LogError(req.user.email, 'DOWNLOAD_DOCUMENT_FILE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['download_document_file_faile'],
            content: error
        });
    }
};

exports.downloadDocumentFileScan = async (req, res) => {
    try {
        const file = await DocumentServices.downloadDocumentFileScan(req.params.id);
        await LogInfo(req.user.email, 'DOWNLOAD_DOCUMENT_FILE_SCAN', req.user.company);
        res.download(file.path, file.name);
    } catch (error) {
        await LogError(req.user.email, 'DOWNLOAD_DOCUMENT_FILE_SCAN', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['download_document_file_scan_faile'],
            content: error
        });
    }
};

/**
 * Các controller cho phần quản lý loại tài liệu văn bản
 */
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

/**
 * Các controller cho phần quản lý danh mục tài liệu văn bản
 */
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
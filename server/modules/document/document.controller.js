const DocumentServices = require('./document.service');
const { LogInfo, LogError } = require('../../logs');

/**
 * Các controller cho phần quản lý tài liệu văn bản
 */
exports.getDocuments = async (req, res) => {
    try {
        const documents = await DocumentServices.getDocuments(req.user.company._id, req.query);
        
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

exports.increaseNumberView = async (req, res) => {
    try {
        const doc = await DocumentServices.increaseNumberView(req.params.id, req.user.name);
        
        await LogInfo(req.user.email, 'INCREASE_NUMBER_VIEW_OF_DOCUMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['increase_number_view_of_document_success'],
            content: doc
        });
    } catch (error) {
        
        await LogError(req.user.email, 'INCREASE_NUMBER_VIEW_OF_DOCUMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['increase_number_view_of_document_faile'],
            content: error
        });
    }
};

exports.showDocument = async (req, res) => {
    try {
        await DocumentServices.increaseNumberView(req.params.id);
        const doc = await DocumentServices.showDocument(req.params.id, req.user.name);
        
        await LogInfo(req.user.email, 'SHOW_DOCUMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['show_document_success'],
            content: doc
        });
    } catch (error) {
        
        await LogError(req.user.email, 'SHOW_DOCUMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_document_faile'],
            content: error
        });
    }
};

exports.editDocument = async (req, res) => {
    try {
        if(req.files !== undefined && Object.keys(req.files).length > 0){
            var pathFile = req.files.file[0].destination +'/'+ req.files.file[0].filename;
            var pathFileScan = req.files.fileScan[0].destination +'/'+ req.files.fileScan[0].filename;

            req.body.file = pathFile;
            req.body.scannedFileOfSignedDocument = pathFileScan;
        }
        const document = await DocumentServices.editDocument(req.params.id, req.body, req.query);
        
        await LogInfo(req.user.email, 'EDIT_DOCUMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_document_success'],
            content: document
        });
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_DOCUMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_document_faile'],
            content: error
        });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const doc = await DocumentServices.deleteDocument(req.params.id);

        await LogInfo(req.user.email, 'DELETE_DOCUMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_document_success'],
            content: doc
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_DOCUMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_document_faile'],
            content: error
        });
    }
};

exports.downloadDocumentFile = async (req, res) => {
    try {
        const file = await DocumentServices.downloadDocumentFile(req.params.id, req.params.numberVersion, req.user.name);
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
        const file = await DocumentServices.downloadDocumentFileScan(req.params.id, req.params.numberVersion, req.user.name);
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
        const categories = await DocumentServices.getDocumentCategories(req.user.company._id, req.query);
        
        await LogInfo(req.user.email, 'GET_DOCUMENT_CATEGORIES', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_document_categories_success'],
            content: categories
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_DOCUMENT_CATEGORIES', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_document_categories_faile'],
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

exports.editDocumentCategory = async (req, res) => {
    try {
        console.log("DFSDFDDSFDSFSDF:", req.params.id, req.body)
        const category = await DocumentServices.editDocumentCategory(req.params.id, req.body);
        
        await LogInfo(req.user.email, 'EDIT_DOCUMENT_CATEGORY', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_document_category_success'],
            content: category
        });
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_DOCUMENT_CATEGORY', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_document_category_faile'],
            content: error
        });
    }
};

exports.deleteDocumentCategory = async (req, res) => {
    try {
        const doc = await DocumentServices.deleteDocumentCategory(req.params.id);
        
        await LogInfo(req.user.email, 'DELETE_DOCUMENT_CATEGORY', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_document_category_success'],
            content: doc
        });
    } catch (error) {
        
        await LogError(req.user.email, 'DELETE_DOCUMENT_CATEGORY', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_document_category_faile'],
            content: error
        });
    }
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

exports.getDocumentsThatRoleCanView = async(req, res) => {
    try {
        const docs = await DocumentServices.getDocumentsThatRoleCanView(req.user.company._id, req.params.id, req.query);
        
        await LogInfo(req.user.email, 'GET_DOCUMENTS_THAT_ROLE_CAN_VIEW', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_documents_success'],
            content: docs
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_DOCUMENTS_THAT_ROLE_CAN_VIEW', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_documents_faile'],
            content: error
        });
    }
}
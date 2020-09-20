const DocumentServices = require('./document.service');
const Logger = require(`${SERVER_LOGS_DIR}/_multi-tenant`);

/**
 * Các controller cho phần quản lý tài liệu văn bản
 */
exports.getDocuments = async (req, res) => {
    try {
        const documents = await DocumentServices.getDocuments(req.portal, req.query, req.user.company._id);

        await Logger.info(req.user.email, 'GET_DOCUMENTS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_documents_success'],
            content: documents
        });
    } catch (error) {

        await Logger.error(req.user.email, 'GET_DOCUMENTS', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_documents_faile'],
            content: error
        });
    }
};

exports.createDocument = async (req, res) => {
    try {
        if (req.files.file) {
            let pathFile = req.files.file[0].destination + '/' + req.files.file[0].filename;
            req.body.file = pathFile;
        }
        if (req.files.fileScan) {
            let pathFileScan = req.files.fileScan[0].destination + '/' + req.files.fileScan[0].filename;
            req.body.scannedFileOfSignedDocument = pathFileScan;
        }
        const document = await DocumentServices.createDocument(req.portal, req.body, req.user.company._id);

        await Logger.info(req.user.email, 'CREATE_DOCUMENT', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_document_success'],
            content: document
        });
    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_DOCUMENT', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_document_faile'],
            content: error
        });
    }
};

exports.importDocument = async (req, res) => {
    try {

        const document = await DocumentServices.importDocument(req.portal, req.body, req.user.company._id);
        await Logger.info(req.user.email, 'IMPORT_DOCUMENT', req.portal);
        console.log('------------------', document);
        res.status(200).json({
            success: true,
            messages: ['import_document_success'],
            content: document
        });
    } catch (error) {
        await Logger.error(req.user.email, 'IMPORT_DOCUMENT', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['import_document_faile'],
            content: error
        });
    }
};
exports.increaseNumberView = async (req, res) => {
    try {
        const doc = await DocumentServices.increaseNumberView(req.params.id, req.user._id, req.portal);

        await Logger.info(req.user.email, 'INCREASE_NUMBER_VIEW_OF_DOCUMENT', req.portal);
        res.status(200).json({
            success: true,
            messages: ['increase_number_view_of_document_success'],
            content: doc
        });
    } catch (error) {

        await Logger.error(req.user.email, 'INCREASE_NUMBER_VIEW_OF_DOCUMENT', req.portal);
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
        const doc = await DocumentServices.showDocument(req.params.id, req.user._id);

        await Logger.info(req.user.email, 'SHOW_DOCUMENT', req.portal);
        res.status(200).json({
            success: true,
            messages: ['show_document_success'],
            content: doc
        });
    } catch (error) {

        await Logger.error(req.user.email, 'SHOW_DOCUMENT', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_document_faile'],
            content: error
        });
    }
};

exports.editDocument = async (req, res) => {
    // try {
    if (req.files && req.files.file) {
        let pathFile = req.files.file[0].destination + '/' + req.files.file[0].filename;
        req.body.file = pathFile;
    }
    if (req.files && req.files.fileScan) {
        let pathFileScan = req.files.fileScan[0].destination + '/' + req.files.fileScan[0].filename;
        req.body.scannedFileOfSignedDocument = pathFileScan;
    }
    const document = await DocumentServices.editDocument(req.params.id, req.body, req.query, req.portal);

    await Logger.info(req.user.email, 'EDIT_DOCUMENT', req.portal);
    res.status(200).json({
        success: true,
        messages: ['edit_document_success'],
        content: document
    });
    // } catch (error) {

    //     await Logger.error(req.user.email, 'EDIT_DOCUMENT', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: Array.isArray(error) ? error : ['edit_document_faile'],
    //         content: error
    //     });
    // }
};

exports.addDocumentLog = async (req, res) => {
    try {
        const document = await DocumentServices.addDocumentLog(req.params, req.body);
        await Logger.info(req.user.email, 'ADD_DOCUMENT_LOG', req.portal);
        res.status(200).json({
            success: true,
            messages: ['add_document_logs_success'],
            content: documentLog
        })
    } catch (error) {

    }
}

exports.deleteDocument = async (req, res) => {
    try {
        const doc = await DocumentServices.deleteDocument(req.params.id, req.portal);

        await Logger.info(req.user.email, 'DELETE_DOCUMENT', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_document_success'],
            content: doc
        });
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_DOCUMENT', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_document_faile'],
            content: error
        });
    }
};

exports.downloadDocumentFile = async (req, res) => {
    try {
        const file = await DocumentServices.downloadDocumentFile({ id: req.params.id, numberVersion: req.query.numberVersion, downloaderId: req.user._id }, req.portal);
        await Logger.info(req.user.email, 'DOWNLOAD_DOCUMENT_FILE', req.portal);
        if (file.path) {
            res.download(file.path, file.name);
        }

    } catch (error) {
        await Logger.error(req.user.email, 'DOWNLOAD_DOCUMENT_FILE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['download_document_file_faile'],
            content: error
        });
    }
};

exports.downloadDocumentFileScan = async (req, res) => {
    try {
        const file = await DocumentServices.downloadDocumentFileScan({ id: req.params.id, numberVersion: req.query.numberVersion, downloaderId: req.user._id }, req.portal);
        await Logger.info(req.user.email, 'DOWNLOAD_DOCUMENT_FILE_SCAN', req.portal);
        if (file.path) {
            res.download(file.path, file.name);
        }
    } catch (error) {
        await Logger.error(req.user.email, 'DOWNLOAD_DOCUMENT_FILE_SCAN', req.portal);
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
        const categories = await DocumentServices.getDocumentCategories(req.portal, req.query, req.user.company._id);

        await Logger.info(req.user.email, 'GET_DOCUMENT_CATEGORIES', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_document_categories_success'],
            content: categories
        });
    } catch (error) {

        await Logger.error(req.user.email, 'GET_DOCUMENT_CATEGORIES', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_document_categories_faile'],
            content: error
        });
    }
};

exports.createDocumentCategory = async (req, res) => {
    try {
        const type = await DocumentServices.createDocumentCategory(req.portal, req.body, req.user.company._id);

        await Logger.info(req.user.email, 'CREATE_DOCUMENT_TYPE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_document_type_success'],
            content: type
        });
    } catch (error) {

        await Logger.error(req.user.email, 'CREATE_DOCUMENT_TYPE', req.portal);
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
        const category = await DocumentServices.editDocumentCategory(req.params.id, req.body, req.portal);

        await Logger.info(req.user.email, 'EDIT_DOCUMENT_CATEGORY', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_document_category_success'],
            content: category
        });
    } catch (error) {

        await Logger.error(req.user.email, 'EDIT_DOCUMENT_CATEGORY', req.portal);
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

        await Logger.info(req.user.email, 'DELETE_DOCUMENT_CATEGORY', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_document_category_success'],
            content: doc
        });
    } catch (error) {

        await Logger.error(req.user.email, 'DELETE_DOCUMENT_CATEGORY', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_document_category_faile'],
            content: error
        });
    }
};

exports.importDocumentCategory = async (req, res) => {
    try {
        const type = await DocumentServices.importDocumentCategory(req.portal, req.body, req.user.company._id);

        await Logger.info(req.user.email, 'IMPORT_DOCUMENT_TYPE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['import_document_type_success'],
            content: type
        });
    } catch (error) {

        await Logger.error(req.user.email, 'IMPORT_DOCUMENT_TYPE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['import_document_type_faile'],
            content: error
        });
    }
};

/**
 * Các controller cho phần quản lý danh mục tài liệu văn bản
 */
exports.getDocumentDomains = async (req, res) => {
    try {
        const domains = await DocumentServices.getDocumentDomains(req.portal, req.user.company._id);

        await Logger.info(req.user.email, 'GET_DOCUMENT_DOMAINS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_document_domains_success'],
            content: domains
        });
    } catch (error) {

        await Logger.error(req.user.email, 'GET_DOCUMENT_DOMAINS', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_document_domains_faile'],
            content: error
        });
    }
};

exports.createDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.createDocumentDomain(req.portal, req.body, req.user.company._id);

        await Logger.info(req.user.email, 'CREATE_DOCUMENT_DOMAIN', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_document_domain_success'],
            content: domain
        });
    } catch (error) {

        await Logger.error(req.user.email, 'CREATE_DOCUMENT_DOMAIN', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_document_domain_faile'],
            content: error
        });
    }
};

exports.showDocumentDomain = (req, res) => {

};

exports.editDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.editDocumentDomain(req.params.id, req.body, req.portal);

        await Logger.info(req.user.email, 'EDIT_DOCUMENT_DOMAIN', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_document_domain_success'],
            content: domain
        });
    } catch (error) {

        await Logger.error(req.user.email, 'EDIT_DOCUMENT_DOMAIN', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_domain_faile'],
            content: error
        });
    }
};

exports.deleteDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.deleteDocumentDomain(req.portal, req.params.id);

        await Logger.info(req.user.email, 'DELETE_DOCUMENT_DOMAIN', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_document_domain_success'],
            content: domain
        });
    } catch (error) {

        await Logger.error(req.user.email, 'DELETE_DOCUMENT_DOMAIN', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_document_domain_faile'],
            content: error
        });
    }
};

exports.deleteManyDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.deleteManyDocumentDomain(req.body.array, req.portal, req.user.company._id);

        await Logger.info(req.user.email, 'DELETE_MANY_DOCUMENT_DOMAIN', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_domain_success'],
            content: domain
        });
    } catch (error) {

        await Logger.error(req.user.email, 'DELETE_MANY_DOCUMENT_DOMAIN', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_domain_faile'],
            content: error
        });
    }
};

exports.importDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.importDocumentDomain(req.portal, req.body, req.user.company._id);

        await Logger.info(req.user.email, 'IMPORT_DOCUMENT_DOMAIN', req.portal);
        res.status(200).json({
            success: true,
            messages: ['import_document_domain_success'],
            content: domain
        });
    } catch (error) {

        await Logger.error(req.user.email, 'IMPORT_DOCUMENT_DOMAIN', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['import_document_domain_faile'],
            content: error
        });
    }
}
exports.getDocumentsThatRoleCanView = async (req, res) => {
    try {
        const docs = await DocumentServices.getDocumentsThatRoleCanView(req.portal, req.query, req.user.company._id);

        await Logger.info(req.user.email, 'GET_DOCUMENTS_THAT_ROLE_CAN_VIEW', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_documents_success'],
            content: docs
        });
    } catch (error) {

        await Logger.error(req.user.email, 'GET_DOCUMENTS_THAT_ROLE_CAN_VIEW', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_documents_faile'],
            content: error
        });
    }
}

exports.getDocumentsUserStatistical = async (req, res) => {
    // try {
    const docs = await DocumentServices.getDocumentsUserStatistical(req.user._id, req.query, req.portal);

    await Logger.info(req.user.email, 'GET_DOCUMENTS_USER_STATISTICAL', req.portal);
    res.status(200).json({
        success: true,
        messages: ['get_documents_success'],
        content: docs
    });
    // } catch (error) {
    //     await Logger.error(req.user.email, 'GET_DOCUMENTS_USER_STATISTICAL', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: Array.isArray(error) ? error : ['get_documents_faile'],
    //         content: error
    //     });
    // }
}
/**
 * Kho lưu trữ vật lí
 */

exports.getDocumnetArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.getDocumentArchives(req.portal, req.user.company._id);

        await Logger.info(req.user.email, 'GET_DOCUMENT_ARCHIVE', req.portal);
        res.status(200).json({
            success: true,
            message: ['get_document_archive_success'],
            content: archive
        })
    } catch (error) {

        await Logger.error(req.user.email, 'GET_DOCUMENT_ARCHIVE', req.portal);
        res.status(400).json({
            success: false,
            message: Array.isArray(error) ? error : ['get_document_archive_faile'],
            content: error
        });
    }
};

exports.createDocumentArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.createDocumentArchive(req.portal, req.body, req.user.company._id);

        await Logger.info(req.user.email, 'CREATE_DOCUMENT_ARCHIVE', req.portal);
        res.status(200).json({
            success: true,
            message: ['create_document_archive_success'],
            content: archive
        })
    } catch (error) {

        await Logger.error(req.user.email, 'CREATE_DOCUMENT_ARCHIVE', req.portal);
        res.status(400).json({
            success: false,
            message: Array.isArray(error) ? error : ['create_document_archive_faile'],
            content: error
        })
    }
};

exports.editDocumentArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.editDocumentArchive(req.params.id, req.body, req.portal);

        await Logger.info(req.user.email, 'EDIT_DOCUMENT_ARCHIVE', req.portal);
        res.status(200).json({
            success: true,
            message: ['edit_document_archive_success'],
            content: archive,
        })
    } catch (error) {

        await Logger.error(req.user.email, 'EDIT_DOCUMENT_ARCHIVE', req.portal);
        res.status(400).json({
            success: false,
            message: Array.isArray(error) ? error : ['edit_document_faile'],
            content: error
        })
    }
};

exports.deleteDocumentArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.deleteDocumentArchive(req.portal, req.params.id, req.user.company._id);
        await Logger.info(req.user.email, 'DELETE_DOCUMENT_ARCHIVE', req.portal);
        res.status(200).json({
            success: true,
            message: ['delete_document_archive_success'],
            content: archive
        })
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_DOCUMENT_ARCHIVE', req.portal);
        res.status(400).json({
            success: false,
            message: Array.isArray(error) ? error : ['delete_document_archive_faile'],
            content: error
        })
    }
};

exports.deleteManyDocumentArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.deleteManyDocumentArchive(req.body.array, req.portal, req.user.company._id);

        await Logger.info(req.user.email, 'DELETE_MANY_DOCUMENT_ARCHIVE', req.portal);
        res.status(200).json({
            success: true,
            message: ['delete_many_document_archive_success'],
            content: archive,
        })
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_MANY_DOCUMENT_ARCHIVE', req.portal);
        res.status(400).json({
            success: false,
            message: Array.isArray(error) ? error : ['delete_many_document_archive_faile'],
            content: error,
        })
    }
}


exports.importDocumentArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.importDocumentArchive(req.portal, req.body, req.user.company._id);

        await Logger.info(req.user.email, 'IMPORT_DOCUMENT_ARCHIVE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['import_document_archive_success'],
            content: archive
        });
    } catch (error) {

        await Logger.error(req.user.email, 'IMPORT_DOCUMENT_ARCHIVE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['import_document_archive_faile'],
            content: error
        });
    }
}
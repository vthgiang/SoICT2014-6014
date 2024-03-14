/* eslint-disable no-unused-vars */
const DocumentServices = require('../services/index');
const Logger = require('../logs/index');
const fs = require('fs');
const archiver = require('archiver');
const exec = require('child_process').exec;
const { SERVER_BACKUP_DIR } = require('../helpers/logHelper');

/**
 * Các controller cho phần quản lý tài liệu văn bản
 */
const getDocuments = async (req, res) => {
    try {
        const documents = await DocumentServices.getDocuments(
            req.portal,
            req.query,
            req.user.company._id,
            req.currentRole
        );

        await Logger.info(req.user.email, 'get_documents', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_documents_success'],
            content: documents,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'get_documents', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_documents_faile'],
            content: error,
        });
    }
};

const createDocument = async (req, res) => {
    try {
        if (req.files.file) {
            req.body.files = [];
            req.files.file.map((x) => {
                let pathFile = x.destination + '/' + x.filename;
                req.body.files.push(pathFile);
            });
        }
        if (req.files.fileScan) {
            req.body.scannedFileOfSignedDocument = [];
            req.files.fileScan.map((x) => {
                let pathFileScan = x.destination + '/' + x.filename;
                req.body.scannedFileOfSignedDocument.push(pathFileScan);
            });
        }
        const document = await DocumentServices.createDocument(
            req.portal,
            req.body,
            req.user.company._id
        );

        await Logger.info(req.user.email, 'create_document', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_document_success'],
            content: document,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'create_document', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_document_faile'],
            content: error,
        });
    }
};

const importDocument = async (req, res) => {
    try {
        const document = await DocumentServices.importDocument(
            req.portal,
            req.body,
            req.user.company._id
        );
        await Logger.info(req.user.email, 'import_document', req.portal);
        res.status(200).json({
            success: true,
            messages: ['import_document_success'],
            content: document,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'import_document', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['import_document_faile'],
            content: error,
        });
    }
};

const increaseNumberView = async (req, res) => {
    try {
        const doc = await DocumentServices.increaseNumberView(
            req.params.id,
            req.user._id,
            req.portal
        );

        await Logger.info(
            req.user.email,
            'increase_number_view_of_document',
            req.portal
        );
        res.status(200).json({
            success: true,
            messages: ['increase_number_view_of_document_success'],
            content: doc,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'increase_number_view_of_document',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['increase_number_view_of_document_faile'],
            content: error,
        });
    }
};

const showDocument = async (req, res) => {
    try {
        await DocumentServices.increaseNumberView(req.params.id);
        const doc = await DocumentServices.showDocument(
            req.params.id,
            req.user._id
        );

        await Logger.info(req.user.email, 'show_document', req.portal);
        res.status(200).json({
            success: true,
            messages: ['show_document_success'],
            content: doc,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'show_document', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_document_faile'],
            content: error,
        });
    }
};

const editDocument = async (req, res) => {
    try {
        if (req.files && req.files.file) {
            let pathFile =
                (await req.files.file[0].destination) +
                '/' +
                req.files.file[0].filename;
            req.body.file = await pathFile;
        }
        if (req.files && req.files.fileScan) {
            let pathFileScan =
                (await req.files.fileScan[0].destination) +
                '/' +
                req.files.fileScan[0].filename;
            req.body.fileScan = await pathFileScan;
        }
        const document = await DocumentServices.editDocument(
            req.params.id,
            req.body,
            req.query,
            req.portal
        );

        await Logger.info(req.user.email, 'edit_document', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_document_success'],
            content: document,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'edit_document', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_document_faile'],
            content: error,
        });
    }
};

const addDocumentLog = async (req, res) => {
    try {
        const documentLog = await DocumentServices.addDocumentLog(
            req.params,
            req.body
        );

        await Logger.info(req.user.email, 'add_document_logs', req.portal);
        res.status(200).json({
            success: true,
            messages: ['add_document_logs_success'],
            content: documentLog,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'add_document_logs', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['add_document_logs_faile'],
            content: error,
        });
    }
};

const deleteDocument = async (req, res) => {
    // try {
    const doc = await DocumentServices.deleteDocument(
        req.params.id,
        req.portal
    );

    await Logger.info(req.user.email, 'DELETE_DOCUMENT', req.portal);
    res.status(200).json({
        success: true,
        messages: ['delete_document_success'],
        content: doc,
    });
    // } catch (error) {

    //     await Logger.error(req.user.email, 'DELETE_DOCUMENT', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: Array.isArray(error) ? error : ['delete_document_faile'],
    //         content: error
    //     });
    // }
};

const downloadDocumentFile = async (req, res) => {
    //try {
    const file = await DocumentServices.downloadDocumentFile(
        {
            id: req.params.id,
            numberVersion: req.query.numberVersion,
            downloaderId: req.user._id,
        },
        req.portal
    );

    await Logger.info(req.user.email, 'download_document_file', req.portal);
    if (file.path) {
        res.download(file.path, file.name);
    }

    // } catch (error) {

    //     await Logger.error(req.user.email, 'download_document_file', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: Array.isArray(error) ? error : ['download_document_file_faile'],
    //         content: error
    //     });
    // }
};

const downloadDocumentFileScan = async (req, res) => {
    try {
        const file = await DocumentServices.downloadDocumentFileScan(
            {
                id: req.params.id,
                numberVersion: req.query.numberVersion,
                downloaderId: req.user._id,
            },
            req.portal
        );

        await Logger.info(
            req.user.email,
            'download_document_file_scan',
            req.portal
        );
        if (file.path) {
            res.download(file.path, file.name);
        }
    } catch (error) {
        await Logger.error(
            req.user.email,
            'download_document_file_scan',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['download_document_file_scan_faile'],
            content: error,
        });
    }
};

const downloadAllFileOfDocument = async (req, res) => {
    try {
        const rootPath = await DocumentServices.downloadAllFileOfDocument(
            req.query,
            req.portal
        );
        await Logger.info(
            req.user.email,
            'download_all_file_of_document_success',
            req.portal
        );

        if (rootPath) {
            const output = fs.createWriteStream(rootPath + '/document.zip');
            const archive = archiver('zip');

            archive.pipe(output);
            archive.directory(rootPath, false);
            archive.on('error', (err) => {
                throw err;
            });
            archive.on('end', function () {
                setTimeout(() => {
                    console.log('gửi file');
                    res.download(rootPath + '/document.zip');
                    // xong rồi xóa thư mục đi
                    if (fs.existsSync(`${SERVER_BACKUP_DIR}/download`)) {
                        exec(
                            `rm -rf ${SERVER_BACKUP_DIR}/download`,
                            function (err) {
                                console.log('er', err);
                            }
                        );
                    }
                }, 3000);
            });
            archive.finalize('close');
        }
    } catch (error) {
        console.log('error', error);
        await Logger.error(
            req.user.email,
            'download_all_file_of_document_faile',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['download_all_file_of_document_faile'],
            content: error,
        });
    }
};

/**
 * Các controller cho phần quản lý loại tài liệu văn bản
 */
const getDocumentCategories = async (req, res) => {
    try {
        const categories = await DocumentServices.getDocumentCategories(
            req.portal,
            req.query,
            req.user.company._id
        );
        await Logger.info(
            req.user.email,
            'get_document_categories',
            req.portal
        );
        res.status(200).json({
            success: true,
            messages: ['get_document_categories_success'],
            content: categories,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'get_document_categories',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['get_document_categories_faile'],
            content: error,
        });
    }
};

const createDocumentCategory = async (req, res) => {
    try {
        const type = await DocumentServices.createDocumentCategory(
            req.portal,
            req.body,
            req.user.company._id
        );

        await Logger.info(
            req.user.email,
            'create_document_category',
            req.portal
        );
        res.status(200).json({
            success: true,
            messages: ['create_document_category_success'],
            content: type,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'create_document_category',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['create_document_category_faile'],
            content: error,
        });
    }
};

const showDocumentCategory = (req, res) => { };

const editDocumentCategory = async (req, res) => {
    try {
        const category = await DocumentServices.editDocumentCategory(
            req.params.id,
            req.body,
            req.portal
        );

        await Logger.info(req.user.email, 'edit_document_category', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_document_category_success'],
            content: category,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'edit_document_category',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['edit_document__category_faile'],
            content: error,
        });
    }
};

const deleteDocumentCategory = async (req, res) => {
    try {
        const doc = await DocumentServices.deleteDocumentCategory(
            req.params.id,
            req.portal
        );

        await Logger.info(
            req.user.email,
            'delete_document_category',
            req.portal
        );
        res.status(200).json({
            success: true,
            messages: ['delete_document_category_success'],
            content: doc,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'delete_document_category',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['delete_document_category_faile'],
            content: error,
        });
    }
};

const importDocumentCategory = async (req, res) => {
    try {
        const type = await DocumentServices.importDocumentCategory(
            req.portal,
            req.body,
            req.user.company._id
        );

        await Logger.info(
            req.user.email,
            'import_document_category',
            req.portal
        );
        res.status(200).json({
            success: true,
            messages: ['import_document_category_success'],
            content: type,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'import_document_category',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['import_document_category_faile'],
            content: error,
        });
    }
};

/**
 * Các controller cho phần quản lý danh mục tài liệu văn bản
 */
const getDocumentDomains = async (req, res) => {
    try {
        const domains = await DocumentServices.getDocumentDomains(
            req.portal,
            req.user.company._id
        );

        await Logger.info(req.user.email, 'get_document_domains', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_document_domains_success'],
            content: domains,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'get_document_domains', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['get_document_domains_faile'],
            content: error,
        });
    }
};

const createDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.createDocumentDomain(
            req.portal,
            req.body,
            req.user.company._id
        );

        await Logger.info(req.user.email, 'create_document_domain', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_document_domain_success'],
            content: domain,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'create_document_domain',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['create_document_domain_faile'],
            content: error,
        });
    }
};

const editDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.editDocumentDomain(
            req.params.id,
            req.body,
            req.portal
        );

        await Logger.info(req.user.email, 'edit_document_domain', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_document_domain_success'],
            content: domain,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'edit_document_domain', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['edit_document_domain_faile'],
            content: error,
        });
    }
};

const deleteDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.deleteDocumentDomain(
            req.portal,
            req.params.id
        );

        await Logger.info(req.user.email, 'delete_document_domain', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_document_domain_success'],
            content: domain,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'delete_document_domain',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['delete_document_domain_faile'],
            content: error,
        });
    }
};

const deleteManyDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.deleteManyDocumentDomain(
            req.body.array,
            req.portal,
            req.user.company._id
        );

        await Logger.info(req.user.email, 'delete_document_domain', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_document_domain_success'],
            content: domain,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'delete_document_domain',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['delete_document_domain_faile'],
            content: error,
        });
    }
};

const importDocumentDomain = async (req, res) => {
    try {
        const domain = await DocumentServices.importDocumentDomain(
            req.portal,
            req.body,
            req.user.company._id
        );

        await Logger.info(req.user.email, 'import_document_domain', req.portal);
        res.status(200).json({
            success: true,
            messages: ['import_document_domain_success'],
            content: domain,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'import_document_domain',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['import_document_domain_faile'],
            content: error,
        });
    }
};

const getDocumentsThatRoleCanView = async (req, res) => {
    try {
        const docs = await DocumentServices.getDocumentsThatRoleCanView(
            req.portal,
            req.query,
            req.user._id,
            req.user.company._id
        );

        await Logger.info(
            req.user.email,
            'get_document_that_role_can_view',
            req.portal
        );
        res.status(200).json({
            success: true,
            messages: ['get_document_that_role_can_view_success'],
            content: docs,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'get_document_that_role_can_view',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['get_document_that_role_can_view_faile'],
            content: error,
        });
    }
};

const getDocumentsUserStatistical = async (req, res) => {
    // try {
    const docs = await DocumentServices.getDocumentsUserStatistical(
        req.user._id,
        req.query,
        req.portal
    );

    await Logger.info(
        req.user.email,
        'get_document_user_statistical',
        req.portal
    );
    res.status(200).json({
        success: true,
        messages: ['get_document_user_statistical_success'],
        content: docs,
    });
    // } catch (error) {
    //     await Logger.error(
    //         req.user.email,
    //         "get_document_user_statistical",
    //         req.portal
    //     );
    //     res.status(400).json({
    //         success: false,
    //         messages: Array.isArray(error)
    //             ? error
    //             : ["get_document_user_statistical_faile"],
    //         content: error,
    //     });
    // }
};

/**
 * Kho lưu trữ vật lí
 */
const getDocumentArchives = async (req, res) => {
    try {
        const archive = await DocumentServices.getDocumentArchives(
            req.portal,
            req.user.company._id
        );

        await Logger.info(req.user.email, 'get_document_archives', req.portal);
        res.status(200).json({
            success: true,
            message: ['get_document_archives_success'],
            content: archive,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'get_document_archives', req.portal);
        res.status(400).json({
            success: false,
            message: Array.isArray(error)
                ? error
                : ['get_document_archives_faile'],
            content: error,
        });
    }
};

const createDocumentArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.createDocumentArchive(
            req.portal,
            req.body,
            req.user.company._id
        );

        await Logger.info(
            req.user.email,
            'create_document_archive',
            req.portal
        );
        res.status(200).json({
            success: true,
            message: ['create_document_archive_success'],
            content: archive,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'create_document_archive',
            req.portal
        );
        res.status(400).json({
            success: false,
            message: Array.isArray(error)
                ? error
                : ['create_document_archive_faile'],
            content: error,
        });
    }
};

const editDocumentArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.editDocumentArchive(
            req.params.id,
            req.body,
            req.portal,
            req.user.company._id
        );

        await Logger.info(req.user.email, 'edit_document_archive', req.portal);
        res.status(200).json({
            success: true,
            message: ['edit_document_archive_success'],
            content: archive,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'edit_document_archive', req.portal);
        res.status(400).json({
            success: false,
            message: Array.isArray(error)
                ? error
                : ['edit_document_archive_faile'],
            content: error,
        });
    }
};

const deleteDocumentArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.deleteDocumentArchive(
            req.portal,
            req.params.id,
            req.user.company._id
        );
        await Logger.info(
            req.user.email,
            'delete_document_archive',
            req.portal
        );
        res.status(200).json({
            success: true,
            message: ['delete_document_archive_success'],
            content: archive,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'delete_document_archive',
            req.portal
        );
        res.status(400).json({
            success: false,
            message: Array.isArray(error)
                ? error
                : ['delete_document_archive_faile'],
            content: error,
        });
    }
};

const deleteManyDocumentArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.deleteManyDocumentArchive(
            req.body.array,
            req.portal,
            req.user.company._id
        );

        await Logger.info(
            req.user.email,
            'delete_document_archive',
            req.portal
        );
        res.status(200).json({
            success: true,
            message: ['delete_document_archive_success'],
            content: archive,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'delete_document_archive',
            req.portal
        );
        res.status(400).json({
            success: false,
            message: Array.isArray(error)
                ? error
                : ['delete_document_archive_faile'],
            content: error,
        });
    }
};

const importDocumentArchive = async (req, res) => {
    try {
        const archive = await DocumentServices.importDocumentArchive(
            req.portal,
            req.body,
            req.user.company._id
        );

        await Logger.info(
            req.user.email,
            'import_document_archive',
            req.portal
        );
        res.status(200).json({
            success: true,
            messages: ['import_document_archive_success'],
            content: archive,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'import_document_archive',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['import_document_archive_faile'],
            content: error,
        });
    }
};

const chartDataDocument = async (req, res) => {
    try {
        const chartDoc = await DocumentServices.chartDataDocument(
            req.portal,
            req.user.company._id,
            req.query.listChart
        );
        let chartDocChart = chartDoc.result;
        let docList = chartDocChart.document;
        let result = {};
        // data chart document by category

        if (
            req.query.listChart[0] === 'all' ||
            req.query.listChart.indexOf('documentByCategory') !== -1
        ) {
            let categoryList = chartDocChart.categorys;
            const dataCategory = categoryList.map((category) => {
                let docs = docList.filter(
                    (doc) =>
                        doc.category !== undefined &&
                        JSON.stringify(doc.category) ===
                        JSON.stringify(category._id)
                ).length;
                return [category.name, docs];
            });
            let valueCatagory = dataCategory.filter(
                (d) => d[1] > 0 || d[2] > 0
            );
            result = { ...result, chartCategory: valueCatagory };
        }

        // data chart document by view,download
        if (
            req.query.listChart[0] === 'all' ||
            req.query.listChart.indexOf('documentByViewAndDownload') !== -1
        ) {
            let categoryList = chartDocChart.categorys;
            const dataViewDownload = categoryList.map((category) => {
                let docs = docList.filter(
                    (doc) =>
                        doc.category !== undefined &&
                        JSON.stringify(doc.category) ===
                        JSON.stringify(category._id)
                );
                let totalDownload = 0;
                let totalView = 0;
                for (let index = 0; index < docs.length; index++) {
                    const element = docs[index];
                    totalDownload = totalDownload + element.numberOfDownload;
                    totalView = totalView + element.numberOfView;
                }
                return [category.name, totalView, totalDownload];
            });
            let valueViewDownLoad = dataViewDownload.filter(
                (d) => d[1] > 0 || d[2] > 0
            );
            result = { ...result, chartViewDownLoad: valueViewDownLoad };
        }
        // data chart document by archive

        if (
            req.query.listChart[0] === 'all' ||
            req.query.listChart.indexOf('documentByArchive') !== -1
        ) {
            let archives = chartDocChart.archives;
            let countArchive = [],
                idArchive = [];
            for (let i = 0; i < archives.list.length; i++) {
                countArchive[i] = 0;
                idArchive.push(archives.list[i]._id);
            }
            docList.map((doc) => {
                doc.archives.map((archive) => {
                    let idx = idArchive.findIndex(
                        (vl) => JSON.stringify(vl) === JSON.stringify(archive)
                    );
                    countArchive[idx]++;
                });
            });
            let typeNameArchive = [],
                shortNameArchive = [];
            for (let i in archives.list) {
                let length = archives.list[i].path.length;
                let longName =
                    '...' +
                    archives.list[i].path.slice(
                        length - 18 > 0 ? length - 18 : 0,
                        length
                    );
                let name =
                    archives.list[i].path.length > 15
                        ? longName
                        : archives.list[i].path;
                shortNameArchive.push(name);
                typeNameArchive.push(archives.list[i].path);
            }
            let countArchiveChart = [].concat(countArchive);
            countArchiveChart.unshift(' ');
            let dataArchiveChart = {
                count: countArchiveChart,
                type: typeNameArchive,
                shortName: shortNameArchive,
            };
            let valueArchive = {
                dataTree: {
                    archives: archives,
                    countArchive: countArchive,
                    idArchive: idArchive,
                },
                dataChart: dataArchiveChart,
            };
            result = { ...result, chartArchive: valueArchive };
        }

        // // data chart document by domain
        if (
            req.query.listChart[0] === 'all' ||
            req.query.listChart.indexOf('documentByDomain') !== -1
        ) {
            let domains = chartDocChart.domains;
            let countDomain = [],
                idDomain = [];
            for (let i in domains.list) {
                countDomain[i] = 0;
                idDomain.push(domains.list[i]._id);
            }
            docList.map((doc) => {
                doc.domains.map((domain) => {
                    let idx = idDomain.findIndex(
                        (vl) => JSON.stringify(vl) === JSON.stringify(domain)
                    );
                    countDomain[idx]++;
                });
            });
            let typeNameDomain = [],
                shortNameDomain = [];
            for (let i in domains.list) {
                let longName = domains.list[i].name.slice(0, 15) + '...';
                let name =
                    domains.list[i].name.length > 15
                        ? longName
                        : domains.list[i].name;
                shortNameDomain.push(name);
                typeNameDomain.push(domains.list[i].name);
            }
            let countDomainChart = [].concat(countDomain);
            countDomainChart.unshift(' ');
            let dataDomainChart = {
                count: countDomainChart,
                type: typeNameDomain,
                shortName: shortNameDomain,
            };
            let valueDomain = {
                dataTree: {
                    domains: domains,
                    countDomain: countDomain,
                    idDomain: idDomain,
                },
                dataChart: dataDomainChart,
            };
            result = { ...result, chartDomain: valueDomain };
        }
        await Logger.info(
            req.user.email,
            'chart_document_by_category',
            req.portal
        );
        res.status(200).json({
            success: true,
            messages: ['chart_document_by_category'],
            content: result,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'chart_document_by_category',
            req.portal
        );
        res.status(400).json({
            success: false,
            message: Array.isArray(error)
                ? error
                : ['chart_document_by_category'],
            content: error,
        });
    }
};
module.exports = {
    getDocuments,
    createDocument,
    importDocument,
    increaseNumberView,
    showDocument,
    editDocument,
    addDocumentLog,
    deleteDocument,
    downloadDocumentFile,
    downloadDocumentFileScan,
    downloadAllFileOfDocument,
    getDocumentCategories,
    createDocumentCategory,
    editDocumentCategory,
    deleteDocumentCategory,
    importDocumentCategory,
    getDocumentDomains,
    createDocumentDomain,
    showDocumentCategory,
    editDocumentDomain,
    deleteDocumentDomain,
    deleteManyDocumentDomain,
    importDocumentDomain,
    getDocumentsThatRoleCanView,
    getDocumentsUserStatistical,
    getDocumentArchives,
    createDocumentArchive,
    editDocumentArchive,
    deleteDocumentArchive,
    deleteManyDocumentArchive,
    importDocumentArchive,
    chartDataDocument
}

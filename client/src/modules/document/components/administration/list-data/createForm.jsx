import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

import { DialogModal, ButtonModal, SelectBox, DatePicker, TreeSelect, ErrorLabel, UploadFile } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { DocumentImportForm } from './documentImportForm';
import { UserAction } from '../'
import { AddVersion } from './addVerson';
import EditVersionForm from './editVersionForm'

class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentName: "",
            documentFile: [],
            documentFileScan: [],
            documentIssuingDate: [],
            documentEffectiveDate: [],
            documentExpiredDate: [],
            versionName: [],
            documentCategory: "",
            documentVersions: [],
            page: 1,
            limit: 5,
        }
    }


    handleName = (e) => {
        const value = e.target.value.trim();
        this.validateName(value, true);
    }

    handleCategory = (value) => {
        this.validateCategory(value[0], true);
    }

    handleDomains = value => {
        this.setState({ documentDomains: value });
    }
    handleArchives = value => {
        this.setState({ documentArchives: value });
    }

    handleDescription = (e) => {
        const { value } = e.target;
        this.setState({ documentDescription: value });
    }


    handleIssuingBody = (e) => {
        const value = e.target.value.trim();
        this.setState(state => {
            return {
                ...state,
                documentIssuingBody: value,
            }
        })
    }

    handleOfficialNumber = (e) => {
        const value = e.target.value.trim();
        this.validateOfficialNumber(value, true);
    }

    handleSigner = (e) => {
        const value = e.target.value.trim();
        this.setState(state => {
            return {
                ...state,
                documentSigner: value,
            }
        })
    }

    handleIssuingDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentIssuingDate: value,
            }
        })
    }

    handleEffectiveDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentEffectiveDate: value,
            }
        })
    }

    handleExpiredDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentExpiredDate: value,
            }
        })
    }

    handleRelationshipDescription = (e) => {
        const { value } = e.target;
        this.setState({ documentRelationshipDescription: value });
    }

    handleRelationshipDocuments = (value) => {
        this.setState({ documentRelationshipDocuments: value });
    }

    handleRoles = (value) => {
        this.setState({ documentRoles: value });
    }


    handleArchivedRecordPlaceOrganizationalUnit = (value) => {
        this.setState({ documentArchivedRecordPlaceOrganizationalUnit: value });
    }

    handleArchivedRecordPlaceManager = (e) => {
        const { value } = e.target;
        this.setState({ documentArchivedRecordPlaceManager: value });
    }
    handleChangeVersionName = (e) => {
        const { value } = e.target;
        this.setState({ versionName: value });
    }


    handleUploadFile = (file) => {
        file = file.map(x => {
            return {
                fileName: x.fileName,
                url: x.urlFile,
                fileUpload: x.fileUpload
            }
        })
        this.setState(state => {
            return {
                ...state,
                documentFile: file
            }
        });
    }

    handleUploadFileScan = (file) => {
        file = file.map(x => {
            return {
                fileName: x.fileName,
                url: x.urlFile,
                fileScanUpload: x.fileUpload
            }
        })
        this.setState(state => {
            return {
                ...state,
                documentFileScan: file
            }
        });
    }
    handleUserCanView = (value) => {
        this.setState({ documentUserCanView: value });
    }

    validateName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentName: value,
                    errorName: msg,
                }
            })
        }
        return msg === undefined;
    }

    validateCategory = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_category');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentCategory: value,
                    errorCategory: msg,
                }
            })
        }
        return msg === undefined;
    }


    validateIssuingBody = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_issuingbody');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentIssuingBody: value,
                    errorIssuingBody: msg,
                }
            })
        }
        return msg === undefined;
    }
    validateVersionName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_version_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentVersionName: value,
                    errorVersionName: msg,
                }
            })
        }
        return msg === undefined;
    }
    validateOfficialNumber = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_official_number');
        }

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentOfficialNumber: value,
                    errorOfficialNumber: msg,
                }
            })
        }
        return msg === undefined;
    }

    toggleAddVersion = (event) => {
        event.preventDefault();
        window.$('#sub-modal-add-document-new-version').modal('show');
    }
    toggleEditVersion = async (data, index) => {
        await this.setState({
            currentVersion: { ...data, index: index }
        });
        window.$('#modal-edit-document-version-form').modal('show');
    }


    isValidateForm = () => {
        return this.validateName(this.state.documentName, false)
            && this.validateCategory(this.state.documentCategory, false)
            && this.validateOfficialNumber(this.state.documentOfficialNumber, false);
    }


    save = () => {
        const {
            documentName,
            documentCategory,
            documentDomains,
            documentArchives,
            documentDescription,
            documentIssuingBody,
            documentOfficialNumber,
            documentIssuingDate,
            documentEffectiveDate,
            documentExpiredDate,
            documentSigner,
            versionName,
            documentFile,
            documentFileScan,
            documentRelationshipDescription,
            documentRelationshipDocuments,
            documentRoles,
            documentUserCanView,
            documentArchivedRecordPlaceOrganizationalUnit,
            documentArchivedRecordPlaceManager,

        } = this.state;
        const formData = new FormData();
        formData.append('name', documentName);
        formData.append('category', documentCategory);
        if (documentDomains) for (let i = 0; i < documentDomains.length; i++) {
            formData.append('domains[]', documentDomains[i]);
        }
        if (documentArchives) for (let i = 0; i < documentArchives.length; i++) {
            formData.append('archives[]', documentArchives[i]);
        }
        if (documentDescription) {
            formData.append('description', documentDescription);
        }
        if (documentIssuingBody) {
            formData.append('issuingBody', documentIssuingBody);
        }
        if (documentOfficialNumber) {
            formData.append('officialNumber', documentOfficialNumber);
        }
        if (documentSigner) {
            formData.append('signer', documentSigner);
        }

        if (versionName && versionName.length) {
            versionName.forEach(x => {
                formData.append("versionName", x);
            })
        }
        if (documentIssuingDate) {
            documentIssuingDate.forEach(x => {
                formData.append('issuingDate', moment(x, "DD-MM-YYYY"));
            })
        }
        if (documentEffectiveDate) {
            documentEffectiveDate.forEach(x => {
                formData.append('effectiveDate', moment(x, "DD-MM-YYYY"));
            })
        }
        if (documentExpiredDate) {
            documentExpiredDate.forEach(x => {
                formData.append('expiredDate', moment(x, "DD-MM-YYYY"));
            })
        }
        if (documentFile && documentFileScan.length) {

            documentFile.forEach(x => {
                formData.append("file", x.fileUpload);
                if (x.fileUpload) {
                    formData.append('numberFile', 1)
                } else {
                    formData.append('numberFile', 0)
                }
            })

        }
        if (documentFileScan && documentFileScan.length) {
            documentFileScan.forEach(x => {
                formData.append("fileScan", x.fileUpload);
                if (x.fileUpload) {
                    formData.append('numberFileScan', 1)
                } else {
                    formData.append('numberFileScan', 0)
                }
            })
        }
        if (documentRelationshipDocuments) {
            formData.append('relationshipDescription', documentRelationshipDescription);
        }
        if (documentRelationshipDocuments) for (let i = 0; i < documentRelationshipDocuments.length; i++) {
            formData.append('relationshipDocuments[]', documentRelationshipDocuments[i]);
        }
        if (documentRoles) for (let i = 0; i < documentRoles.length; i++) {
            formData.append('roles[]', documentRoles[i]);
        }
        if (documentUserCanView) for (let i = 0; i < documentUserCanView.length; i++) {
            formData.append('userCanView[]', documentUserCanView[i]);
        }
        if (documentArchivedRecordPlaceOrganizationalUnit) {
            formData.append('archivedRecordPlaceOrganizationalUnit', documentArchivedRecordPlaceOrganizationalUnit);
        }
        if (documentArchivedRecordPlaceOrganizationalUnit) {
            formData.append('archivedRecordPlaceManager', documentArchivedRecordPlaceManager);
        }


        this.props.createDocument(formData);
    }

    findPath = (archives, select) => {
        let paths = select.map(s => {
            let archive = archives.filter(arch => arch._id === s);
            return archive[0] ? archive[0].path : "";
        })
        return paths;

    }
    handleAddDocument = (event) => {
        event.preventDefault();
        window.$('#modal-create-document').modal('show');
    }
    handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file_document').modal('show');
    }
    onSearch = async (name) => {

        await this.props.getAllDocuments({ page: this.state.page, limit: this.state.limit, name: name, calledId: "relationshipDocs" });

        this.setState(state => {
            return {
                ...state,
            }
        });
    }

    deleteDocumentVersion = (i) => {
        let {
            documentVersions, documentFile, documentFileScan,
            versionName, documentIssuingDate,
            documentEffectiveDate, documentExpiredDate
        } = this.state;
        documentVersions.splice(i, 1);
        documentFile.splice(i, 1);
        documentFileScan.splice(i, 1);
        versionName.splice(i, 1);
        documentIssuingDate.splice(i, 1);
        documentEffectiveDate.splice(i, 1);
        documentExpiredDate.splice(i, 1);

        this.setState(state => {
            return ({
                ...state,
                documentVersions: documentVersions,
                documentFile: documentFile,
                documentFileScan: documentFileScan,
                versionName: versionName,
                documentIssuingDate: documentIssuingDate,
                documentEffectiveDate: documentEffectiveDate,
                documentExpiredDate: documentExpiredDate,

            })
        })
    }

    convertISODate = (dateStr) => {
        if (dateStr) {
            if (dateStr instanceof Date) {
                return dateStr;
            }
            else if (dateStr.includes('-')) {
                let splitter = dateStr.split('-');
                let isoDate = new Date(splitter[2], splitter[1] - 1, splitter[0])
                return isoDate;
            }

        }
        return null;
    }
    addVersion = async (data) => {
        let { documentVersions, documentFile, documentFileScan, versionName, documentIssuingDate,
            documentEffectiveDate, documentExpiredDate, } = this.state;
        const file = {
            file: data.file,
            urlFile: data.urlFile,
            fileUpload: data.fileUpload
        }
        const fileScan = {
            file: data.fileScan,
            urlFile: data.urlFileScan,
            fileUpload: data.fileScanUpload,
        }

        documentVersions.push({
            versionName: data.versionName,
            issuingDate: this.convertISODate(data.documentIssuingDate),
            effectiveDate: this.convertISODate(data.documentEffectiveDate),
            expiredDate: this.convertISODate(data.documentExpiredDate),
            documentFile: [file],
            documentFileScan: [fileScan],

        })

        this.setState(state => {
            return {
                ...state,
                versionName: [...versionName, data.versionName],
                documentIssuingDate: [...documentIssuingDate, this.convertISODate(data.documentIssuingDate)],
                documentEffectiveDate: [...documentEffectiveDate, this.convertISODate(data.documentEffectiveDate)],
                documentExpiredDate: [...documentExpiredDate, this.convertISODate(data.documentExpiredDate)],
                documentFile: [...documentFile, {
                    ...file
                }],
                documentFileScan: [...documentFileScan, {
                    ...fileScan
                }],
            }
        });
    }

    editVersion = async (data) => {
        let { documentVersions, documentFile, documentFileScan, versionName, documentIssuingDate,
            documentEffectiveDate, documentExpiredDate, } = this.state;
        const file = {
            file: data.file,
            urlFile: data.urlFile,
            fileUpload: data.fileUpload
        }
        const fileScan = {
            file: data.fileScan,
            urlFile: data.urlFileScan,
            fileUpload: data.fileScanUpload,
        }

        const version = {
            versionName: data.versionName,
            issuingDate: this.convertISODate(data.issuingDate),
            effectiveDate: this.convertISODate(data.effectiveDate),
            expiredDate: this.convertISODate(data.expiredDate),
            documentFile: [file],
            documentFileScan: [fileScan],
        }

        documentVersions[data.index] = version;
        documentFile[data.index] = file;
        documentFileScan[data.index] = fileScan;
        versionName[data.index] = data.versionName;
        documentIssuingDate[data.index] = this.convertISODate(data.issuingDate);
        documentEffectiveDate[data.index] = this.convertISODate(data.effectiveDate);
        documentExpiredDate[data.index] = this.convertISODate(data.expiredDate);


        this.setState(state => {
            return {
                ...state,
                documentVersions: documentVersions,
                documentFile: documentFile,
                documentFileScan: documentFileScan,
                versionName: versionName,
                documentIssuingDate: documentIssuingDate,
                documentEffectiveDate: documentEffectiveDate,
                documentExpiredDate: documentExpiredDate,

            }
        })

    }
    formatDate(date, monthYear = false) {
        if (!date) return null;
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }

    render() {
        const { translate, role, documents, department, user } = this.props;
        const { list } = documents.administration.domains;

        const {
            errorName, errorCategory, errorOfficialNumber,
            documentArchives, documentDomains, listDocumentRelationship,
            documentVersions, currentVersion, documentUserCanView,
        } = this.state;
        const archives = documents.administration.archives.list;

        const categories = documents.administration.categories.list.map(category => { return { value: category._id, text: category.name } });
        const documentRoles = role.list.map(role => { return { value: role._id, text: role.name } });
        const relationshipDocs = documents.administration.relationshipDocs.paginate.map(doc => { return { value: doc._id, text: doc.name } });
        let path = documentArchives ? this.findPath(archives, documentArchives) : "";
        return (
            <React.Fragment>

                <div className="form-inline">
                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('document.add')}
                        >{translate('general.add')}</button>
                        <ul className="dropdown-menu pull-right">
                            <li>
                                <a href="#modal-create-document" title="Create" onClick={(event) => { this.handleAddDocument(event) }}>{translate('document.add')}</a>
                            </li>
                            <li>
                                <a href="#modal_import_file_document" title="ImportForm" onClick={(event) => { this.handImportFile(event) }}>{translate('document.import')}</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <DocumentImportForm />

                <DialogModal
                    modalID="modal-create-document"
                    formID="form-create-document"
                    title={translate('document.add')}
                    func={this.save} size="100"
                    disableSubmit={!this.isValidateForm()}
                >

                    <form id="form-create-document">
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#doc-info" data-toggle="tab">{translate('document.infomation_docs')}</a></li>
                                <li><a href="#doc-sub-info" data-toggle="tab">{translate('document.relationship_role_store')}</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="doc-info">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                                                <label>{translate('document.name')}<span className="text-red">*</span></label>
                                                <input type="text" className="form-control" onChange={this.handleName} />
                                                <ErrorLabel content={errorName} />
                                            </div>
                                            <div className={`form-group ${!errorOfficialNumber ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.official_number')}<span className="text-red">*</span></label>
                                                <input type="text" className="form-control" onChange={this.handleOfficialNumber} placeholder={translate('document.doc_version.exp_official_number')} />
                                                <ErrorLabel content={errorOfficialNumber} />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.doc_version.issuing_body')}</label>
                                                <input type="text" className="form-control" onChange={this.handleIssuingBody} placeholder={translate('document.doc_version.exp_issuing_body')} />
                                            </div>

                                            <div className="form-group">
                                                <label>{translate('document.doc_version.signer')}</label>
                                                <input type="text" className="form-control" onChange={this.handleSigner} placeholder={translate('document.doc_version.exp_signer')} />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className={`form-group ${errorCategory === undefined ? "" : "has-error"}`}>
                                                <label>{translate('document.category')}<span className="text-red">*</span></label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id="select-documents-relationship"
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={categories}
                                                    onChange={this.handleCategory}
                                                    multiple={false}
                                                    options={{ placeholder: translate('document.administration.categories.select') }}
                                                />
                                                <ErrorLabel content={errorCategory} />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.domain')}</label>
                                                <TreeSelect data={list} handleChange={this.handleDomains} value={documentDomains} mode="hierarchical" />
                                            </div>

                                            <div className="form-group">
                                                <label>{translate('document.description')}</label>
                                                <textarea style={{ height: '100px' }} type="text" className="form-control" onChange={this.handleDescription} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <button style={{ marginTop: 2, marginBottom: 10, marginRight: 15 }} type="submit" className="btn btn-primary pull-right" onClick={this.toggleAddVersion} title={translate('document.add')}>{translate('document.add')}</button>
                                            <AddVersion handleChange={this.addVersion} />
                                            <table className="table table-hover table-striped table-bordered" id="table-document-version">
                                                <thead>
                                                    <tr>
                                                        <th>{translate('document.version')}</th>
                                                        <th>{translate('document.issuing_date')}</th>
                                                        <th>{translate('document.effective_date')}</th>
                                                        <th>{translate('document.expired_date')}</th>
                                                        <th>{translate('document.doc_version.file')}</th>
                                                        <th>{translate('document.doc_version.scanned_file_of_signed_document')}</th>
                                                        <th style={{ width: '80px', textAlign: 'center' }}>
                                                            {translate('general.action')}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        documentVersions && documentVersions.length > 0 ?
                                                            documentVersions.map((version, i) => {
                                                                return <tr key={i}>
                                                                    <td>{version.versionName}</td>
                                                                    <td>{this.formatDate(version.issuingDate)}</td>
                                                                    <td>{this.formatDate(version.effectiveDate)}</td>
                                                                    <td>{this.formatDate(version.expiredDate)}</td>
                                                                    <td>
                                                                        <a href="#" >
                                                                            <u>{version.documentFile && version.documentFile.length && version.documentFile[0].file ? version.documentFile[0].file : ""}</u>
                                                                        </a>
                                                                    </td>
                                                                    <td>
                                                                        <a href="#" >
                                                                            <u>{version.documentFileScan && version.documentFileScan.length && version.documentFileScan[0].file ? version.documentFileScan[0].file : ""}</u>
                                                                        </a>
                                                                    </td>
                                                                    <td>
                                                                        <a className="text-yellow" title={translate('document.edit')} onClick={() => this.toggleEditVersion(version, i)}>
                                                                            <i className="material-icons">edit</i>
                                                                        </a>
                                                                        <a className="text-red" title={translate('document.delete')} onClick={() => this.deleteDocumentVersion(i)}>
                                                                            <i className="material-icons">delete</i>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            }) : <tr><td colSpan={7}>{translate('document.no_version')}</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="doc-sub-info">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label>{translate('document.relationship.description')}</label>
                                                <textarea style={{ height: 107 }} type="text" className="form-control" onChange={this.handleRelationshipDescription} />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.relationship.list')}</label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id="select-documents-relationship-to-document"
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={relationshipDocs}
                                                    value={listDocumentRelationship}
                                                    onChange={this.handleRelationshipDocuments}
                                                    multiple={true}
                                                    onSearch={this.onSearch}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label>{translate('document.store.organizational_unit_manage')}</label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id="select-documents-organizational-unit-manage"
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={department.list.map(organ => { return { value: organ._id, text: organ.name } })}
                                                    onChange={this.handleArchivedRecordPlaceOrganizationalUnit}
                                                    options={{ placeholder: translate('document.store.select_organizational') }}
                                                    multiple={false}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.roles')}</label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id="select-document-users-see-permission"
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={documentRoles}
                                                    onChange={this.handleRoles}
                                                    multiple={true}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.users')}</label>
                                                <SelectBox
                                                    id={`select-document-user-can-view`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={
                                                        user.list.map(user => { return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : "" } })
                                                    }
                                                    onChange={this.handleUserCanView}
                                                    value={documentUserCanView}
                                                    multiple={true}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.store.information')}</label>
                                                <TreeSelect data={archives} handleChange={this.handleArchives} value={documentArchives} mode="hierarchical" />
                                                {path && path.length ? path.map(y =>
                                                    <div>{y}</div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    {
                        currentVersion &&
                        <EditVersionForm
                            index={currentVersion.index}
                            versionName={currentVersion.versionName}
                            issuingDate={currentVersion.issuingDate ? currentVersion.issuingDate : ""}
                            effectiveDate={currentVersion.effectiveDate ? currentVersion.effectiveDate : ""}
                            expiredDate={currentVersion.expiredDate ? currentVersion.expiredDate : ""}
                            documentFile={currentVersion.documentFile ? currentVersion.documentFile : ""}
                            documentFileScan={currentVersion.documentFileScan ? currentVersion.documentFileScan : ""}

                            handleChange={this.editVersion}
                        />
                    }
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments,
    createDocument: DocumentActions.createDocument,

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));
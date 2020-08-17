import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DateTimeConverter, SelectBox, DatePicker, TreeSelect, ErrorLabel } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import moment from 'moment';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleName = (e) => {
        const value = e.target.value;
        this.validateName(value, true)
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
        const value = e.target.value;
        // this.validateIssuingBody(value, true);
        this.setState(state => {
            return {
                ...state,
                documentIssuingBody: value.trim(),
                //errorIssuingBody: msg,
            }
        })
    }
    handleOfficialNumber = (e) => {
        const value = e.target.value;
        // this.validateOfficialNumber(value, true);
        this.setState(state => {
            return {
                ...state,
                documentOfficialNumber: value.trim(),
                // errorOfficialNumber: msg,
            }
        })
    }

    handleSigner = (e) => {
        const value = e.target.value;
        // this.validateSinger(value, true);
        this.setState(state => {
            return {
                ...state,
                documentSigner: value.trim(),
                //  errorSigner: msg,
            }
        })
    }
    handleRelationshipDescription = (e) => {
        const { value } = e.target;
        this.setState({ documentRelationshipDescription: value });
    }

    handleRelationshipDocuments = (e) => {
        const { value } = e.target;
        this.setState({ documentRelationshipDocuments: value });
    }

    handleRoles = (value) => {
        this.setState({ documentRoles: value });
    }

    // handleArchivedRecordPlaceInformation = (e) => {
    //     const { value } = e.target;
    //     this.setState(state => {
    //         return {
    //             ...state,
    //             documentArchivedRecordPlace: {
    //                 ...state.documentArchivedRecordPlace,
    //                 information: value
    //             }
    //         }
    //     });
    // }

    handleArchivedRecordPlaceOrganizationalUnit = (e) => {
        const { value } = e.target;
        this.setState(state => {
            return {
                ...state,
                documentArchivedRecordPlace: {
                    ...state.documentArchivedRecordPlace,
                    organizationalUnit: value
                }
            }
        });
    }

    handleArchivedRecordPlaceManager = (e) => {
        const { value } = e.target;
        this.setState(state => {
            return {
                ...state,
                documentArchivedRecordPlace: {
                    ...state.documentArchivedRecordPlace,
                    manager: value
                }
            }
        });
    }

    handleVersionName = (e) => {
        const value = e.target.value;
        // this.validateVersionName(value, true);
        this.setState(state => {
            return {
                ...state,
                documentVersionName: value.trim(),
                // errorVersionName: msg,
            }
        })
    }

    handleIssuingDate = (value) => {
        // this.validateIssuingDate(value, true);
        this.setState(state => {
            return {
                ...state,
                documentIssuingDate: value,
                //  errorIssuingDate: msg,
            }
        })
    }

    handleEffectiveDate = (value) => {
        // this.validateEffectiveDate(value, true);
        this.setState(state => {
            return {
                ...state,
                documentEffectiveDate: value,
                // errorEffectiveDate: msg,
            }
        })
    }

    handleExpiredDate = (value) => {
        //this.validateExpiredDate(value, true);
        this.setState(state => {
            return {
                ...state,
                documentExpiredDate: value,
                //  errorExpiredDate: msg,
            }
        })
    }
    handleUploadFile = (e) => {
        this.setState({ documentFile: e.target.files[0] });
    }

    handleUploadFileScan = (e) => {
        this.setState({ documentFileScan: e.target.files[0] });
    }
    validateName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value.trim()) {
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
        let val = value.trim();
        const { translate } = this.props;
        if (!val) {
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
        let val = value.trim();
        if (!val) {
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
        const regex = /\d/g
        let msg = undefined;
        let val = value.trim();
        const { translate } = this.props;
        if (!val) {
            msg = translate('document.doc_version.no_blank_official_number');
        }
        else if (!regex.test(val)) {
            msg = translate('document.doc_version.error_office_number');
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
    validateIssuingDate = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_issuingdate');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentIssuingDate: value,
                    errorIssuingDate: msg,
                }
            })
        }
        return msg === undefined;
    }
    validateEffectiveDate = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_effectivedate');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentEffectiveDate: value,
                    errorEffectiveDate: msg,
                }
            })
        }
        return msg === undefined;
    }
    validateExpiredDate = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_expired_date');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentExpiredDate: value,
                    errorExpiredDate: msg,
                }
            })
        }
        return msg === undefined;
    }
    validateSinger = (value, willUpdateState) => {
        let msg = undefined;
        let val = value.trim();
        const { translate } = this.props;
        if (!val) {
            msg = translate('document.doc_version.no_blank_signer');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentSigner: value,
                    errorSigner: msg,
                }
            })
        }
        return msg === undefined;
    }
    validateDocumentFile = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_file');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentFile: value,
                    errorDocumentFile: msg,
                }
            })
        }
        return this.state.documentFile === undefined;
    }
    validateDocumentFileScan = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_file_scan');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentFileScan: value,
                    errorDocumentFileScan: msg,
                }
            })
        }
        return this.state.documentFileScan === undefined;
    }

    isValidateForm = () => {
        // console.log('tttttttttttt', this.validateName(this.state.documentName, false), this.validateCategory(this.state.documentCategory, false),
        //     this.validateOfficialNumber(this.state.documentOfficialNumber, false), this.validateSinger(this.state.documentSigner, false),
        //     this.validateIssuingBody(this.state.documentIssuingBody, false))
        return this.validateName(this.state.documentName, false)
            && this.validateCategory(this.state.documentCategory, false)
        // && this.validateOfficialNumber(this.state.documentOfficialNumber, false)
        // && this.validateSinger(this.state.documentSigner, false)
        // && this.validateIssuingBody(this.state.documentIssuingBody, false);
    }
    save = () => {
        const {
            documentId,
            documentName,
            documentCategory,
            documentDomains,
            documentArchives,
            documentDescription,
            documentIssuingBody,
            documentOfficialNumber,
            documentSigner,
            documentRelationshipDescription,
            documentRelationshipDocuments,
            documentRoles,
            documentArchivedRecordPlaceInfo,
            documentArchivedRecordPlaceOrganizationalUnit,
            documentArchivedRecordPlaceManager,
        } = this.state;

        const formData = new FormData();
        formData.append('name', documentName);
        formData.append('category', documentCategory);
        if (documentDomains) for (var i = 0; i < documentDomains.length; i++) {
            formData.append('domains[]', documentDomains[i]);
        }
        if (documentArchives) for (var i = 0; i < documentArchives.length; i++) {
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

        if (documentRelationshipDocuments) {
            formData.append('relationshipDescription', documentRelationshipDescription);
        }
        if (documentRelationshipDocuments) for (var i = 0; i < documentRelationshipDocuments.length; i++) {
            formData.append('relationshipDocuments[]', documentRelationshipDocuments[i]);
        }
        if (documentRoles) for (var i = 0; i < documentRoles.length; i++) {
            formData.append('roles[]', documentRoles[i]);
        }

        if (documentArchivedRecordPlaceOrganizationalUnit) {
            formData.append('archivedRecordPlaceOrganizationalUnit', documentArchivedRecordPlaceOrganizationalUnit);
        }
        if (documentArchivedRecordPlaceOrganizationalUnit) {
            formData.append('archivedRecordPlaceManager', documentArchivedRecordPlaceManager);
        }
        //console.log('ererererer', formData.getAll());
        this.props.editDocument(documentId, formData);
    }




    addNewVersion = id => {
        const {
            documentVersionName,
            documentIssuingDate,
            documentEffectiveDate,
            documentExpiredDate,
            documentFile,
            documentFileScan
        } = this.state;

        const formData = new FormData();
        formData.append('versionName', documentVersionName);
        formData.append('issuingDate', moment(documentIssuingDate, "DD-MM-YYYY"));
        formData.append('effectiveDate', moment(documentEffectiveDate, "DD-MM-YYYY"));
        formData.append('expiredDate', moment(documentExpiredDate, "DD-MM-YYYY"));
        formData.append('file', documentFile);
        formData.append('fileScan', documentFileScan);
        console.log("FORM DATA: ", formData)
        this.props.editDocument(id, formData, 'ADD_VERSION');
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.documentId !== prevState.documentId) {
            return {
                ...prevState,
                documentId: nextProps.documentId,
                documentName: nextProps.documentName,
                documentDescription: nextProps.documentDescription,
                documentCategory: nextProps.documentCategory,
                documentDomains: nextProps.documentDomains,
                documentArchives: nextProps.documentArchives,
                documentIssuingBody: nextProps.documentIssuingBody,
                documentOfficialNumber: nextProps.documentOfficialNumber,
                documentSigner: nextProps.documentSigner,

                documentVersions: nextProps.documentVersions,

                documentRelationshipDescription: nextProps.documentRelationshipDescription,
                documentRelationshipDocuments: nextProps.documentRelationshipDocuments,

                documentRoles: nextProps.documentRoles,

                documentArchivedRecordPlaceInfo: nextProps.documentArchivedRecordPlaceInfo,
                documentArchivedRecordPlaceOrganizationalUnit: nextProps.documentArchivedRecordPlaceOrganizationalUnit,
                documentArchivedRecordPlaceManager: nextProps.documentArchivedRecordPlaceManager,

                errorName: undefined,
                errorIssuingBody: undefined,
                errorOfficialNumber: undefined,
                errorSigner: undefined,
                errorVersionName: undefined,
                errorDocumentFile: undefined,
                errorDocumentFileScan: undefined,
                errorIssuingDate: undefined,
                errorEffectiveDate: undefined,
                errorExpiredDate: undefined,
                errorCategory: undefined
            }
        } else if (nextProps.documentVersions.length > prevState.documentVersions.length) {
            return {
                ...prevState,
                documentId: nextProps.documentId,
                documentVersions: nextProps.documentVersions,
            }
        } else {
            return null;
        }
    }

    requestDownloadDocumentFile = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFile(id, fileName, numberVersion);
    }

    requestDownloadDocumentFileScan = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFileScan(id, fileName, numberVersion);
    }
    findPath = (archives, select) => {
        console.log(archives, select);
        if (select) {
            let archive = archives.filter(arch => arch._id === select);
            return [archive[0].path];
        }
        else return null;
    }
    render() {
        const {
            documentId, documentName, documentDescription, documentCategory, documentDomains,
            documentIssuingBody, documentOfficialNumber, documentSigner, documentVersions,
            documentRelationshipDescription, documentRelationshipDocuments,
            documentRoles, documentArchives,
            documentArchivedRecordPlaceInfo, documentArchivedRecordPlaceOrganizationalUnit,
        } = this.state;
        const { errorName, errorIssuingBody, errorOfficialNumber, errorSigner, errorVersionName, errorDocumentFile, errorDocumentFileScan, } = this.state;
        const { translate, role, documents, department } = this.props;
        const categories = documents.administration.categories.list.map(category => { return { value: category._id, text: category.name } });
        const { list } = documents.administration.domains;
        const roleList = role.list.map(role => { return { value: role._id, text: role.name } });
        const relationshipDocs = documents.administration.data.list.filter(doc => doc._id !== documentId).map(doc => { return { value: doc._id, text: doc.name } })
        const archives = documents.administration.archives.list;
        let path = documentArchives ? this.findPath(archives, documentArchives[0]) : "";
        console.log('pathhhh', path, documentArchives);

        console.log("STATE:", this.state);

        return (
            <React.Fragment>
                <DialogModal
                    size="100"
                    modalID="modal-edit-document"
                    formID="form-edit-document"
                    title={translate('document.edit')}
                    func={this.save}
                    disableSubmit={!this.isValidateForm()}
                >
                    <form id="form-edit-document">
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#doc-edit-info" data-toggle="tab">{translate('document.infomation_docs')}</a></li>
                                <li><a href="#doc-edit-sub-info" data-toggle="tab">{translate('document.relationship_role_store')}</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="doc-edit-info">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                                                <label>{translate('document.name')}<span className="text-red">*</span></label>
                                                <input type="text" className="form-control" value={documentName} onChange={this.handleName} />
                                                <ErrorLabel content={errorName} />
                                            </div>
                                            <div className={`form-group ${!errorIssuingBody ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.issuing_body')}</label>
                                                <input type="text" className="form-control" onChange={this.handleIssuingBody} value={documentIssuingBody} />
                                                <ErrorLabel content={errorIssuingBody} />
                                            </div>
                                            <div className={`form-group ${!errorOfficialNumber ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.official_number')}</label>
                                                <input type="text" className="form-control" onChange={this.handleOfficialNumber} value={documentOfficialNumber} />
                                                <ErrorLabel content={errorOfficialNumber} />
                                            </div>
                                            <div className={`form-group ${!errorSigner ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.signer')}</label>
                                                <input type="text" className="form-control" onChange={this.handleSigner} value={documentSigner} />
                                                <ErrorLabel content={errorSigner} />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label>{translate('document.category')}<span className="text-red">*</span></label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id={`select-box-edit-document-category-${documentId}`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={categories}
                                                    value={documentCategory}
                                                    onChange={this.handleCategory}
                                                    multiple={false}
                                                    options={{ placeholder: translate('document.administration.categories.select') }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.domain')}</label>
                                                <TreeSelect
                                                    data={list}
                                                    value={documentDomains}
                                                    handleChange={this.handleDomains}
                                                    mode="hierarchical"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.description')}</label>
                                                <textarea type="text" className="form-control" onChange={this.handleDescription} value={documentDescription ? documentDescription : ""} />
                                            </div>


                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <ButtonModal modalID="sub-modal-add-document-new-version" button_name={translate('general.add')} title={translate('document.add')} />
                                            <DialogModal
                                                modalID="sub-modal-add-document-new-version"
                                                formID="sub-form-add-document-new-version"
                                                title={translate('document.add_version')}
                                                func={() => this.addNewVersion(documentId)}
                                            >
                                                <React.Fragment>
                                                    <div className={`form-group `}>
                                                        <label>{translate('document.doc_version.name')}</label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{translate('document.upload_file')}</label>
                                                        <input type="file" onChange={this.handleUploadFile} />
                                                        <ErrorLabel content={errorDocumentFile} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{translate('document.upload_file_scan')}</label>
                                                        <input type="file" onChange={this.handleUploadFileScan} />
                                                        <ErrorLabel content={errorDocumentFileScan} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{translate('document.doc_version.issuing_date')}</label>
                                                        <DatePicker
                                                            id={`document-edit-version-issuing-date-${documentId}`}
                                                            onChange={this.handleIssuingDate}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{translate('document.doc_version.effective_date')}</label>
                                                        <DatePicker
                                                            id={`document-edit-version-effective-date-${documentId}`}
                                                            onChange={this.handleEffectiveDate}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{translate('document.doc_version.expired_date')}</label>
                                                        <DatePicker
                                                            id={`document-edit-version-expired-date-${documentId}`}
                                                            onChange={this.handleExpiredDate}
                                                        />
                                                    </div>
                                                </React.Fragment>
                                            </DialogModal>
                                            <table className="table table-hover table-striped table-bordered" id="table-document-version">
                                                <thead>
                                                    <tr>
                                                        <th>{translate('document.version')}</th>
                                                        <th>{translate('document.issuing_date')}</th>
                                                        <th>{translate('document.effective_date')}</th>
                                                        <th>{translate('document.expired_date')}</th>
                                                        <th>{translate('document.doc_version.file')}</th>
                                                        <th>{translate('document.doc_version.scanned_file_of_signed_document')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        documentVersions !== undefined && documentVersions.length > 0 ?
                                                            documentVersions.map((version, i) => {
                                                                return <tr key={i}>
                                                                    <td>{version.versionName}</td>
                                                                    <td><DateTimeConverter dateTime={version.issuingDate} type="DD-MM-YYYY" /></td>
                                                                    <td><DateTimeConverter dateTime={version.effectiveDate} type="DD-MM-YYYY" /></td>
                                                                    <td><DateTimeConverter dateTime={version.expiredDate} type="DD-MM-YYYY" /></td>
                                                                    <td><a href="#" onClick={() => this.requestDownloadDocumentFile(documentId, documentName, i)}><u>{translate('document.download')}</u></a></td>
                                                                    <td><a href="#" onClick={() => this.requestDownloadDocumentFileScan(documentId, "SCAN_" + documentName, i)}><u>{translate('document.download')}</u></a></td>
                                                                </tr>
                                                            }) : <tr><td colSpan={7}>{translate('document.no_version')}</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="doc-edit-sub-info">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label>{translate('document.relationship.description')}</label>
                                                <textarea type="text" className="form-control" onChange={this.handleRelationshipDescription} value={documentRelationshipDescription} />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.relationship.list')}</label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id="select-edit-documents-relationship-to-document"
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={relationshipDocs}
                                                    onChange={this.handleRelationshipDocuments}
                                                    value={documentRelationshipDocuments}
                                                    multiple={true}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.roles')}</label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id={`select-edit-document-users-see-permission-${documentId}`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={roleList}
                                                    value={documentRoles}
                                                    onChange={this.handleRoles}
                                                    multiple={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label>{translate('document.store.information')}</label>
                                                <TreeSelect
                                                    data={archives}
                                                    value={documentArchives}
                                                    handleChange={this.handleArchives}
                                                    mode="hierarchical"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Đường dẫn chi tiết</label>
                                                <textarea style={{ height: '30px' }} type="text" className="form-control" value={path} disable />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.store.organizational_unit_manage')}</label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id={`select-edit-documents-organizational-unit-manage${documentId}`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={department.list.map(organ => { return { value: organ._id, text: organ.name } })}
                                                    onChange={this.handleArchivedRecordPlaceOrganizationalUnit}
                                                    value={documentArchivedRecordPlaceOrganizationalUnit}
                                                    multiple={false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocument: DocumentActions.editDocument,
    downloadDocumentFile: DocumentActions.downloadDocumentFile,
    downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));
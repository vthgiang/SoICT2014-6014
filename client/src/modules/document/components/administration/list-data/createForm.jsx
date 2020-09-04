import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

import { DialogModal, ButtonModal, SelectBox, DatePicker, TreeSelect, ErrorLabel } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';


class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentName: "",
            documentFile: "",
            documentFileScan: "",
            documentIssuingDate: "",
            documentEffectiveDate: "",
            documentExpiredDate: "",
            documentCategory: "",
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

    handleVersionName = (e) => {
        const value = e.target.value.trim();
        // this.validateVersionName(value, true);
        this.setState(state => {
            return {
                ...state,
                documentVersionName: value,
                // errorVersionName: msg,
            }
        })
    }

    handleIssuingBody = (e) => {
        const value = e.target.value.trim();
        // this.validateIssuingBody(value, true);
        this.setState(state => {
            return {
                ...state,
                documentIssuingBody: value,
                //errorIssuingBody: msg,
            }
        })
    }

    handleOfficialNumber = (e) => {
        const value = e.target.value.trim();
        // this.validateOfficialNumber(value, true);
        this.setState(state => {
            return {
                ...state,
                documentOfficialNumber: value,
                // errorOfficialNumber: msg,
            }
        })
    }

    handleSigner = (e) => {
        const value = e.target.value.trim();
        // this.validateSinger(value, true);
        this.setState(state => {
            return {
                ...state,
                documentSigner: value,
                //  errorSigner: msg,
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

    // handleArchivedRecordPlaceInfo = (e) => {
    //     const { value } = e.target;
    //     this.setState({ documentArchivedRecordPlaceInfo: value });
    // }

    handleArchivedRecordPlaceOrganizationalUnit = (value) => {
        this.setState({ documentArchivedRecordPlaceOrganizationalUnit: value });
    }

    handleArchivedRecordPlaceManager = (e) => {
        const { value } = e.target;
        this.setState({ documentArchivedRecordPlaceManager: value });
    }

    handleUploadFile = (e) => {
        const value = e.target.files[0];
        // this.validateDocumentFile(value, true);
        this.setState(state => {
            return {
                ...state,
                documentFile: value,
                // errorDocumentFile: msg,
            }
        })
    }

    handleUploadFileScan = (e) => {
        const value = e.target.files[0];
        // this.validateDocumentFileScan(value, true);
        this.setState(state => {
            return {
                ...state,
                documentFileScan: value,
                //errorDocumentFileScan: msg,
            }
        })
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
        const regex = /\d/g
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_official_number');
        }
        else if (!regex.test(value)) {
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
        const { translate } = this.props;
        if (!value) {
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
        return msg === undefined;
    }
    validateDocumentFileScan = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value.name) {
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
        return msg === undefined;
    }


    isValidateForm = () => {
        return this.validateName(this.state.documentName, false)
            && this.validateCategory(this.state.documentCategory, false);
        // && this.validateVersionName(this.state.documentVersionName, false)
        // && this.validateOfficialNumber(this.state.documentOfficialNumber, false)
        // && this.validateIssuingDate(this.state.documentIssuingDate, false)
        // && this.validateEffectiveDate(this.state.documentEffectiveDate, false)
        // && this.validateExpiredDate(this.state.documentExpiredDate, false)
        // && this.validateSinger(this.state.documentSigner, false)
        // && this.validateDocumentFile(this.state.documentFile, false)
        // && this.validateDocumentFileScan(this.state.documentFileScan, false)
        // && this.validateIssuingBody(this.state.documentIssuingBody, false);
    }


    save = () => {
        const {
            documentName,
            documentCategory,
            documentDomains,
            documentArchives,
            documentDescription,
            documentVersionName,
            documentIssuingBody,
            documentOfficialNumber,
            documentIssuingDate,
            documentEffectiveDate,
            documentExpiredDate,
            documentSigner,
            documentFile,
            documentFileScan,
            documentRelationshipDescription,
            documentRelationshipDocuments,
            documentRoles,
            //documentArchivedRecordPlaceInfo,
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
        if (documentVersionName) {
            formData.append('versionName', documentVersionName);
        }
        if (documentIssuingDate) {
            formData.append('issuingDate', moment(documentIssuingDate, "DD-MM-YYYY"));
        }
        if (documentEffectiveDate) {
            formData.append('effectiveDate', moment(documentEffectiveDate, "DD-MM-YYYY"));
        }
        if (documentExpiredDate) {
            formData.append('expiredDate', moment(documentExpiredDate, "DD-MM-YYYY"));
        }
        if (documentFile) {
            formData.append('file', documentFile);
        }
        if (documentFileScan) {
            formData.append('fileScan', documentFileScan);
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

        //formData.append('archivedRecordPlaceInfo', documentArchivedRecordPlaceInfo);
        if (documentArchivedRecordPlaceOrganizationalUnit) {
            formData.append('archivedRecordPlaceOrganizationalUnit', documentArchivedRecordPlaceOrganizationalUnit);
        }
        if (documentArchivedRecordPlaceOrganizationalUnit) {
            formData.append('archivedRecordPlaceManager', documentArchivedRecordPlaceManager);
        }


        this.props.createDocument(formData);
    }
    findPath = (archives, select) => {
        let archive = archives.filter(arch => arch._id === select);
        return archive[0] ? archive[0].path : "";
    }

    render() {
        const { translate, role, documents, department } = this.props;
        const { list } = documents.administration.domains;
        const { errorName, errorIssuingBody, errorOfficialNumber, errorSigner, errorVersionName,
            errorDocumentFile, errorDocumentFileScan, errorIssuingDate, errorEffectiveDate,
            errorExpiredDate, errorCategory, documentArchives } = this.state;
        const archives = documents.administration.archives.list;
        const categories = documents.administration.categories.list.map(category => { return { value: category._id, text: category.name } });
        // console.log('rrrrrr', archives);
        const documentRoles = role.list.map(role => { return { value: role._id, text: role.name } });
        const relationshipDocs = documents.administration.data.list.map(doc => { return { value: doc._id, text: doc.name } });
        // console.log('eeeeeeee', documentArchives)
        // console.log('uuuuuuu', documentArchives ? this.findPath(archives, documentArchives[0]) : "");
        let path = documentArchives ? this.findPath(archives, documentArchives[0]) : "";
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-document" button_name={translate('general.add')} title={translate('manage_user.add_title')} />
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
                                            <div className={`form-group ${!errorIssuingBody ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.issuing_body')}</label>
                                                <input type="text" className="form-control" onChange={this.handleIssuingBody} placeholder={translate('document.doc_version.exp_issuing_body')} />
                                                <ErrorLabel content={errorIssuingBody} />
                                            </div>
                                            <div className={`form-group ${!errorOfficialNumber ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.official_number')}</label>
                                                <input type="text" className="form-control" onChange={this.handleOfficialNumber} placeholder={translate('document.doc_version.exp_official_number')} />
                                                <ErrorLabel content={errorOfficialNumber} />
                                            </div>
                                            <div className={`form-group ${!errorSigner ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.signer')}</label>
                                                <input type="text" className="form-control" onChange={this.handleSigner} placeholder={translate('document.doc_version.exp_signer')} />
                                                <ErrorLabel content={errorSigner} />
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
                                                <TreeSelect data={list} handleChange={this.handleDomains} mode="hierarchical" />
                                            </div>
                                            {/* <div className="form-group">
                                                <label>Lưu trữ</label>
                                                <TreeSelect data={archives} handleChange={this.handleArchives} value={path} mode="hierarchical" />
                                            </div> */}
                                            <div className="form-group">
                                                <label>{translate('document.description')}</label>
                                                <textarea style={{ height: '100px' }} type="text" className="form-control" onChange={this.handleDescription} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className={`form-group ${!errorVersionName ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.name')}</label>
                                                <input type="text" className="form-control" onChange={this.handleVersionName} placeholder={translate('document.doc_version.exp_version')} />
                                                <ErrorLabel content={errorVersionName} />
                                            </div>
                                            <div className={`form-group ${!errorDocumentFile ? "" : "has-error"}`}>
                                                <label>{translate('document.upload_file')}</label>
                                                <br />
                                                <div className="upload btn btn-primary">
                                                    <i className="fa fa-folder"></i>
                                                    {" " + translate('document.choose_file')}
                                                    <input className="upload" type="file" name="file" onChange={this.handleUploadFile} />
                                                </div>
                                                <ErrorLabel content={errorDocumentFile} />
                                            </div>
                                            <div className={`form-group ${!errorDocumentFileScan ? "" : "has-error"}`}>
                                                <label>{translate('document.upload_file_scan')}</label>
                                                <br />
                                                <div className="upload btn btn-primary">
                                                    <i className="fa fa-folder"></i>
                                                    {" " + translate('document.choose_file')}
                                                    <input className="upload" type="file" name="file" onChange={this.handleUploadFileScan} />
                                                </div>
                                                <ErrorLabel content={errorDocumentFileScan} />
                                            </div>
                                            <div className={`form-group ${!errorIssuingDate ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.issuing_date')}</label>
                                                <DatePicker
                                                    id="create-document-version-issuing-date"
                                                    value={this.state.documentIssuingDate}
                                                    onChange={this.handleIssuingDate}
                                                />
                                                <ErrorLabel content={errorIssuingDate} />
                                            </div>
                                            <div className={`form-group ${!errorEffectiveDate ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.effective_date')}</label>
                                                <DatePicker
                                                    id="create-document-version-effective-date"
                                                    value={this.state.documentEffectiveDate}
                                                    onChange={this.handleEffectiveDate}
                                                />
                                                <ErrorLabel content={errorEffectiveDate} />
                                            </div>
                                            <div className={`form-group ${!errorExpiredDate ? "" : "has-error"}`}>
                                                <label>{translate('document.doc_version.expired_date')}</label>
                                                <DatePicker
                                                    id="create-document-version-expired-date"
                                                    value={this.state.documentExpiredDate}
                                                    onChange={this.handleExpiredDate}
                                                />
                                                <ErrorLabel content={errorExpiredDate} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="doc-sub-info">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label>{translate('document.relationship.description')}</label>
                                                <textarea style={{ height: '34px' }} type="text" className="form-control" onChange={this.handleRelationshipDescription} />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.relationship.list')}</label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id="select-documents-relationship-to-document"
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={relationshipDocs}
                                                    onChange={this.handleRelationshipDocuments}
                                                    multiple={true}
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
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            {/* <div className="form-group">
                                                <label>{translate('document.store.information')}</label>
                                                <input type="text" className="form-control" onChange={this.handleArchivedRecordPlaceInfo} placeholder="VD: Tủ 301" />
                                            </div> */}
                                            <div className="form-group">
                                                <label>{translate('document.store.information')}</label>
                                                <TreeSelect data={archives} handleChange={this.handleArchives} value={documentArchives} mode="hierarchical" />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.administration.domains.path_detail')}</label>
                                                <textarea style={{ height: '30px' }} type="text" className="form-control" value={path ? path : ""} disable />
                                            </div>
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
    createDocument: DocumentActions.createDocument
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));
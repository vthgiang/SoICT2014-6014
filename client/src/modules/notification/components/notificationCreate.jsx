import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, SelectBox, QuillEditor, convertImageBase64ToFile } from '../../../common-components';

import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';
import { NotificationActions } from '../redux/actions';
import { UploadFile } from '../../../common-components'
import { convertJsonObjectToFormData } from '../../../helpers/jsonObjectToFormDataObjectConverter';
import ValidationHelper from '../../../helpers/validationHelper';

class NotificationCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationTitle: '',
            notificationLevel: 'info',
            notificationContent: '',
            notificationSender: '',
            notificationUsers: [],
            notificationOrganizationalUnits: []
        }
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getUser();
    }

    handleTitle = (e) => {
        let value = e.target.value;
        this.validateTitle(value, true);
    }
    validateTitle = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    notificationTitleError: message,
                    notificationTitle: value,
                }
            });
        }
        return message === undefined;
    }

    handleSender = (e) => {
        let value = e.target.value;
        this.validateSender(value, true);
    }
    validateSender = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateName(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    notificationSenderError: message,
                    notificationSender: value,
                }
            });
        }
        return message === undefined;
    }

    handleContent = (data, imgs) => {
        const image = convertImageBase64ToFile(imgs);
        this.setState(state => {
            return {
                ...state,
                notificationContent: data,
                notificationContentImage: image,
            }
        });
    }

    handleLevel = (value) => {
        this.setState(state => {
            return {
                ...state,
                notificationLevel: value[0]
            }
        });
    }

    handleUsersChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                notificationUsers: value
            }
        });
    }

    handleOrganizationalUnitsChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                notificationOrganizationalUnits: value
            }
        });
    }

    handleChangeFile = (file) => {
        const notificationFiles = file.map(x => ({
            url: x.urlFile,
            fileUpload: x.fileUpload
        }))

        this.setState({
            notificationFiles,
        });
    }

    save = () => {
        const { auth } = this.props;
        const { notificationFiles, notificationTitle, notificationLevel, notificationContent, notificationContentImage,
            notificationSender, notificationUsers, notificationOrganizationalUnits
        } = this.state;
        const data = {
            creator: auth.user._id,
            title: notificationTitle,
            level: notificationLevel,
            content: notificationContent,
            sender: notificationSender,
            users: notificationUsers,
            organizationalUnits: notificationOrganizationalUnits
        };
        let formData;

        formData = convertJsonObjectToFormData(data);
        if (notificationFiles) {
            console.log('notificationFiles', notificationFiles)
            notificationFiles.forEach(obj => {
                formData.append('notificationFiles', obj.fileUpload)
            })
        }
        if (notificationContentImage) {
            notificationContentImage.forEach(obj => {
                formData.append('notificationContentImage', obj)
            })
        }
        return this.props.create(formData);
    }

    render() {
        const { translate, department, user } = this.props;
        return (
            <React.Fragment>
                <a style={{ width: '100%', marginBottom: '15px' }} className="btn btn-success" title={translate('notification.add_title')} data-toggle="modal" href='#modal-create-notification' data-backdrop="static">{translate('notification.add')}</a>
                <DialogModal
                    modalID="modal-create-notification"
                    formID="form-create-notification"
                    title={translate('notification.add')}
                    func={this.save}
                >
                    <form id="form-create-notification">
                        <div className="row">
                            <div className="form-group col-sm-8">
                                <label>{translate('notification.title')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={this.handleTitle} />
                            </div>
                            <div className="form-group col-sm-4">
                                <label>{translate('notification.type.title')}<span className="text-red">*</span></label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id={`create-notification-level`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: 'info', text: translate('notification.type.info') },
                                        { value: 'general', text: translate('notification.type.general') },
                                        { value: 'important', text: translate('notification.type.important') },
                                        { value: 'emergency', text: translate('notification.type.emergency') }
                                    ]}
                                    onChange={this.handleLevel}
                                    multiple={false}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>{translate('notification.sender')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleSender} />
                        </div>

                        {/* Nội dung */}
                        <div className="form-group">
                            <label>{translate('notification.content')}<span className="text-red">*</span></label>
                            <QuillEditor
                                id={'notificationCreate'}
                                getTextData={this.handleContent}
                                table={false}
                            />
                        </div>

                        <div className="form-group">
                            <label>{translate('notification.departments')}</label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`notification-to-organizational-units`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={department.list.map(department => {
                                    return {
                                        value: department._id, text: department.name
                                    }
                                })}
                                onChange={this.handleOrganizationalUnitsChange}
                                multiple={true}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('notification.users')}</label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`notification-to-users`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={user.list.map(user => {
                                    return {
                                        value: user._id, text: user.name
                                    }
                                })}
                                onChange={this.handleUsersChange}
                                multiple={true}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('human_resource.profile.attached_files')}</label>
                            <UploadFile multiple={true} onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department, user, auth } = state;
    return { department, user, auth };
}
const actions = {
    getDepartment: DepartmentActions.get,
    getUser: UserActions.get,
    create: NotificationActions.create,
}

export default connect(mapState, actions)(withTranslate(NotificationCreate));
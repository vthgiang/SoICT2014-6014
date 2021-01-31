import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, UploadFile, TreeSelect } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';
class MajorAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group: {},
            specialized: {},
            urlFile: "",
            fileUpload: "",
            file: "",
        }
    }

    /**
     * Function format ngày hiện tại thành dạnh mm-yyyy
     * @param {*} date : Ngày muốn format
     */
    formatDate = (date) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('-');
        }
        return date;
    }

    handleAction = (value) => {
        let { career } = this.props;
        let listAction = career?.listAction;
        let careerAction = listAction?.find(e => e._id === value[0]);

        this.setState({ careerAction: careerAction });
    };

    handleGroup = (value) => {
        let { major } = this.props;
        let list = major?.listMajor;
        let listMajor = this.getListMajor(list);

        let listGroup = listMajor.listGroup;
        let group = listGroup?.find(e => e._id === value[0]);

        console.log('valueeeee', value, group);
        this.setState(state => {
            return {
                ...state,
                group: group,
                specialized: {},
            }
        });
    };

    handleSpecialized = (value) => {
        let { major } = this.props;
        let list = major?.listMajor;
        let listMajor = this.getListMajor(list);

        let listSpecialized = listMajor.listSpecialized;
        let specialized = listSpecialized?.find(e => e._id === value[0]);

        console.log('valueeeee', value, specialized);
        this.setState({ specialized: specialized });
    };

    /** Bắt sự kiện thay đổi file đính kèm */
    handleChangeFile = (value) => {
        if (value.length !== 0) {
            this.setState({
                file: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload

            })
        } else {
            this.setState({
                file: "",
                urlFile: "",
                fileUpload: ""
            })
        }
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        // validate here!
    }

    /** Bắt sự kiện submit form */
    save = async () => {
        return this.props.handleChange({ ...this.state });
        // let data = this.state;
        // let major = {
        //     groupName: data.group?.name,
        //     groupCode: data.group?.code,
        //     specializedName: data.specialized?.name,
        //     specializedCode: data.specialized?.code,
        //     file: data.file,
        //     urlFile: data.urlFile,
        //     fileUpload: data.fileUpload,
        // }
        // return this.props.handleChange(major);
    }

    getListMajor = (list) => {
        let listGroup = [];
        let listSpecialized = [];
        for (let i in list) {
            let groupMap = list[i].group;
            let group = list[i].group.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    parent: list[i]._id.toString(),
                }
            });
            listGroup = [...listGroup, ...group];
            // listSpecialized = [...listSpecialized, ...group];

            for (let x in groupMap) {
                let specializedMap = groupMap[x].specialized;
                let specialized = groupMap[x].specialized.map(elm => {
                    return {
                        ...elm,
                        id: elm._id,
                        text: elm.name,
                        state: { "opened": true },
                        parent: groupMap[x]._id.toString(),
                    }
                });
                listSpecialized = [...listSpecialized, ...specialized];
            }
        }

        return {
            listGroup,
            listSpecialized
        }
    }

    render() {
        const { translate, major } = this.props;

        const { id } = this.props;

        const { group, specialized } = this.state;

        let list = major?.listMajor;
        let listGroup = [];
        let listSpecialized = [];

        let listMajor = this.getListMajor(list);
        listGroup = listMajor.listGroup;
        listSpecialized = listMajor.listSpecialized;
        if (group?._id) {
            listSpecialized = listMajor.listSpecialized.filter(e => e.parent === group?._id);
        }

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-major-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_certificate')} />
                <DialogModal
                    size='50' modalID={`modal-create-major-${id}`} isLoading={false}
                    formID={`form-create-major-${id}`}
                    title={"Thêm mới chuyên ngành tương đương"}
                    func={this.save}
                // disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-major-${id}`}>
                        <div className="form-group">
                            <label>Nhóm ngành<span className="text-red">*</span></label>
                            <TreeSelect data={listGroup} value={group?._id} handleChange={this.handleGroup} mode="radioSelect" />
                        </div>
                        <div className="form-group">
                            <label>Chuyên ngành<span className="text-red">*</span></label>
                            <TreeSelect data={listSpecialized} value={specialized?._id} handleChange={this.handleSpecialized} mode="radioSelect" />
                        </div>
                        {/* File đính kèm */}
                        <div className="form-group">
                            <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                            <UploadFile onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { major } = state;
    return { major };
}

const addModal = connect(mapState, null)(withTranslate(MajorAddModal));
export { addModal as MajorAddModal };

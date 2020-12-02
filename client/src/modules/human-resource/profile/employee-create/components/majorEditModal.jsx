import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, UploadFile, TreeSelect } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';
class MajorEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
        this.setState({ group: group });
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


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            console.log('mahjor nexxt', nextProps);
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                group: nextProps.group,
                specialized: nextProps.specialized,
                file: nextProps.file,
                urlFile: nextProps.urlFile,
                fileUpload: nextProps.fileUpload,
            }
        } else {
            return null;
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

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-major-${id}`} isLoading={false}
                    formID={`form-edit-major-${id}`}
                    title={"Thêm mới chuyên ngành tương đương"}
                    func={this.save}
                // disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-major-${id}`}>
                        <div className="form-group">
                            <label>Nhóm ngành</label>
                            <TreeSelect data={listGroup} value={group?._id} handleChange={this.handleGroup} mode="radioSelect" />
                        </div>
                        <div className="form-group">
                            <label>Chuyên ngành</label>
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

const addModal = connect(mapState, null)(withTranslate(MajorEditModal));
export { addModal as MajorEditModal };

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, UploadFile, TreeSelect, SelectBox } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';
function CareerEditModal(props) {

    const [state, setState] = useState({
        selectedTab: "hdld",
    })

    useEffect(() => {
        console.log('props', props);
        setState({
            ...state,
            id: props.id,
            _id: props._id,
            index: props.index,
            package: props.package,
            position: props.position,
            action: props.action,
            field: props.field,
            startDate: props.startDate,
            endDate: props.endDate,
            file: props.file,
            urlFile: props.urlFile,
            fileUpload: props.fileUpload,
            errorOnName: undefined,
            errorOnUnit: undefined,
            errorOnStartDate: undefined,
            errorOnEndDate: undefined
        })
    }, [props.id])

    const { translate, career } = props;

    const { id } = props;

    const { selectedTab, file, urlFile, fileUpload, field, position, action, endDate, startDate, errorOnName, errorOnUnit, errorOnEndDate, errorOnStartDate } = state;
    console.log('statetettetetete', state);
    let listAction = [], listPosition = [], listField = [];
    listAction = career?.listAction.filter(e => e.isLabel !== 1).map(elm => { return { ...elm, id: elm._id } });
    listPosition = career?.listPosition.map(elm => { return { ...elm, id: elm._id } });
    listField = career?.listField.map(elm => { return { ...elm, id: elm._id } });

    let files;
    if (file) {
        files = [{ fileName: file, urlFile: urlFile, fileUpload: fileUpload }]
    }

    /**
     * Function format ngày hiện tại thành dạnh mm-yyyy
     * @param {*} date : Ngày muốn format
     */
    const formatDate = (date) => {
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

    const handleAction = (value) => {
        let { career } = props;
        let listAction = career?.listAction.map(elm => { return { ...elm, id: elm._id } });

        let action = listAction?.filter(e => value.indexOf(e._id) !== -1);

        let listField = [], listPosition = [];
        if (!state.position) {
            for (let i in value) {
                let items = career?.listPosition.filter(e => e.description?.find(x => String(x.action._id) === String(value[i]))).map(el => String(el._id));
                for (let k in items) {
                    let tmp = listPosition.find(x => String(items[k]) === String(x));
                    if (!tmp) {
                        listPosition.push(items[k]);
                    }
                }
            }

            for (let i in listPosition) {
                let items = career?.listField.filter(e => e.position?.find(x => String(x.position._id) === String(listPosition[i])));
                for (let k in items) {
                    let tmp = listField.find(x => String(items[k]._id) === String(x._id));
                    if (!tmp) {
                        listField.push(items[k]);
                    }
                }
            }
            console.log('action', action, listField, listPosition);
            setState({
                ...state,
                action: action, field: listField
            });
        }
        else setState({
            ...state,
            action: action
        });
    };

    const handleField = (value) => {
        let { career } = props;
        let listField = career?.listField.map(elm => { return { ...elm, id: elm._id } });
        let field = listField?.find(e => e._id === value[0]);

        console.log('valueeeee', value, field);
        setState({
            ...state,
            field: field
        });
    };

    const handlePosition = (value) => {
        let { career } = props;
        let listPosition = career?.listPosition.map(elm => { return { ...elm, id: elm._id } });
        let position = listPosition?.find(e => e._id === value[0]);


        let listField = career?.listField?.filter(e => e.position?.find(x => String(x.position._id) === String(value[0])));

        console.log('list field', position, listField);

        // let pkg = position?.package;
        setState({
            ...state,
            position: position, field: listField
        });
    };

    const handleChangePackage = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            package: value
        });
    };

    /** Bắt sự kiện thay đổi file đính kèm */
    const handleChangeFile = (value) => {
        if (value.length !== 0) {
            setState({
                ...state,
                file: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload

            })
        } else {
            setState({
                ...state,
                file: "",
                urlFile: "",
                fileUpload: ""
            })
        }
    }

    /**
     * Bắt sự kiện thay đổi ngày cấp
     * @param {*} value : Ngày cấp
     */
    const handleStartDateChange = (value) => {
        const { translate } = props;
        let { errorOnEndDate, endDate } = state;

        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = translate('human_resource.profile.start_date_before_end_date');
        } else {
            errorOnEndDate = undefined;
        }

        console.log('start', value);
        setState({
            ...state,
            startDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /**
     * Bắt sự kiện thay đổi ngày hết hạn
     * @param {*} value : Ngày hết hạn
     */
    const handleEndDateChange = (value) => {
        const { translate } = props;
        let { startDate, errorOnStartDate } = state;

        let errorOnEndDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

        if (d.getTime() > date.getTime()) {
            errorOnEndDate = translate('human_resource.profile.end_date_after_start_date');
        } else {
            errorOnStartDate = undefined;
        }

        console.log('end', value);
        setState({
            ...state,
            endDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { name, issuedBy, startDate, endDate } = state;
        let result //  = validateNameCertificate(name, false) && validateIssuedByCertificate(issuedBy, false);
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        if (endDate) {
            let partEnd = endDate.split('-');
            let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
            if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
                return result;
            } else return false;
        } else {
            return result;
        }
    }

    /** Bắt sự kiện submit form */
    const save = async () => {
        const { startDate, endDate } = state;
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let endDateNew = null;
        if (endDate) {
            let partEnd = endDate.split('-');
            endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        };

        console.log("---", state);
        return props.handleChange({ ...state, startDate: startDateNew, endDate: endDateNew });
    }

    const changeActiveTab = async (tab) => {
        await setState({
            ...state,
            selectedTab: tab
        });
    }

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={`modal-edit-career-${id}`} isLoading={false}
                formID={`form-edit-career-${id}`}
                title={"Chỉnh sửa công việc tương đương"}
                func={save}
            // disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-edit-career-${id}`}>
                    <div className="row">
                        <div className="col-md-6">
                            <div style={{ justifyContent: "center" }}>
                                <h4 style={{ fontWeight: "bold" }}>Hướng dẫn nhập thông tin từ hợp đồng</h4>
                            </div>
                            <br /><br />
                            <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }}>
                                <ul className="nav nav-tabs">
                                    <li className="active"><a onClick={() => changeActiveTab("hdld")} title={"Hướng dẫn nhập thông tin từ hợp đồng lao động"} data-toggle="tab" href={`#hdld`}>Hợp đồng lao động</a></li>
                                    <li><a onClick={() => changeActiveTab("hdkv")} title={"Hướng dẫn nhập thông tin từ hợp đồng khoán việc"} data-toggle="tab" href={`#hdkv`}>Hợp đồng khoán việc</a></li>
                                    <li><a onClick={() => changeActiveTab("hddv")} title={"Hướng dẫn nhập thông tin từ hợp đồng dịch vụ"} data-toggle="tab" href={`#hddv`}>Hợp đồng dịch vụ</a></li>
                                </ul>
                                <div className="tab-content">
                                    <div id="hdld" className={`tab-pane ${selectedTab === "hdld" ? "active" : ""}`}>
                                        <div className="box-body">
                                            <h4>Hướng dẫn nhập thông tin từ hợp đồng lao động</h4>
                                            <div style={{ lineHeight: 2 }}>
                                                <p>Với hợp đồng lao động thì người dùng có thể điền các thông tin cần thiết như sau:</p>
                                                <li>Thông tin gói thầu không cần điền</li>
                                                <li>Thông tin vị trí công việc chính là phần thông tin về "chức danh" ở tại Điều 1 mục a trong hợp đồng</li>
                                                <li>Thông tin hoạt động công việc chính là phần thông tin về "công việc phải làm" ở tại Điều 1 mục c trong hợp đồng</li>
                                                <li>Thông tin về ngày bắt đầu và ngày kết thúc là phần thông tin được tìm thấy ở Điều 2 - Thời hạn hợp đồng lao động</li>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="hdkv" className={`tab-pane ${selectedTab === "hdkv" ? "active" : ""}`}>
                                        <div className="box-body">
                                            <h4>Hướng dẫn nhập thông tin từ hợp đồng khoán việc</h4>
                                            <div style={{ lineHeight: 2 }}>
                                                <p>Với hợp đồng khoán việc thì người dùng có thể điền các thông tin cần thiết như sau:</p>
                                                <li>Thông tin gói thầu có trong Điều 1 - Nội dung công việc. Tại đó có nêu ra thông tin của hợp đồng. Hoặc có thể dựa trên mã số hợp đồng để tra cứu</li>
                                                <li>Thông tin vị trí công việc thường sẽ bỏ trống</li>
                                                <li>Thông tin hoạt động công việc chính là phần thông tin về "Bên A giao cho bên B các công việc" ở tại Điều 1 - Nội dung công việc</li>
                                                <li>Thông tin về ngày bắt đầu và ngày kết thúc là phần thông tin thời gian thực hiện được tìm thấy ở Điều 2 - Tiến độ thực hiện công việc</li>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="hddv" className={`tab-pane ${selectedTab === "hddv" ? "active" : ""}`}>
                                        <div className="box-body">
                                            <h4>Hướng dẫn nhập thông tin từ hợp đồng dịch vụ</h4>
                                            <div style={{ lineHeight: 2 }}>
                                                <p>Với hợp đồng dịch vụ thì người dùng có thể điền các thông tin cần thiết như sau:</p>
                                                <li>Thông tin gói thầu có trong Điều 1 - Nội dung thực hiện, mục 1.1-Tên dịch vụ, và mục 1.2-Nội dung dịch vụ</li>
                                                <li>Thông tin vị trí công việc có thể tìm được ở phụ lục 3 - Danh sách nhân sự chủ chốt tham gia thực hiện</li>
                                                <li>Thông tin hoạt động công việc chính là phần thông tin về "Chi tiết nội dung công việc" được nêu ở phụ lục 02 - Nội dung công việc</li>
                                                <li>Thông tin về ngày bắt đầu và ngày kết thúc là phần thông tin thời gian triển khai được tìm thấy ở Điều 2 - Thời gian và tiến độ triển khai</li>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            {/* <div className="form-group">
                                    <label>Lĩnh vực công việc</label>
                                    <TreeSelect data={listField} value={field?._id} handleChange={handleField} mode="radioSelect" />
                                </div> */}

                            {/* <div className="form-group">
                                    <label>Gói thầu: </label> {state.package ? state.package : "Chưa có"}
                                </div> */}
                            <div className="form-group">
                                <label>Gói thầu</label>
                                {/* {state.package ? state.package : "Chưa có"} */}
                                <input type="text" className="form-control" name="package" value={state.package} onChange={handleChangePackage} />
                            </div>
                            <div className="form-group">
                                <label>Vị trí công việc</label>
                                <TreeSelect data={listPosition} value={position?._id} handleChange={handlePosition} mode="radioSelect" />
                            </div>
                            <div className="form-group">
                                <label>Hoạt động công việc</label>
                                {/* <TreeSelect data={listAction} value={action?.id} handleChange={handleAction} mode="radioSelect" /> */}
                                <SelectBox
                                    id={`edit-career-action-select-${id}`}
                                    lassName="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listAction.map(x => {
                                        return { text: x.name, value: x._id }
                                    })}
                                    options={{ placeholder: "Chọn hoạt động công việc" }}
                                    onChange={handleAction}
                                    value={action?.map(e => e?._id)}
                                    multiple={true}
                                />
                            </div>
                            <div className="row">
                                {/* Ngày cấp */}
                                <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                    <label>Ngày bắt đầu<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit-start-date-${id}`}
                                        deleteValue={false}
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                    />
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>
                                {/* Ngày hết hạn */}
                                <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                                    <label>ngày kết thúc<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit-end-date-${id}`}
                                        deleteValue={true}
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                    />
                                    <ErrorLabel content={errorOnEndDate} />
                                </div>
                            </div>
                            {/* File đính kèm */}
                            <div className="form-group">
                                <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                                <UploadFile files={files} onChange={handleChangeFile} />
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { career } = state;
    return { career };
}

const addModal = connect(mapState, null)(withTranslate(CareerEditModal));
export { addModal as CareerEditModal };

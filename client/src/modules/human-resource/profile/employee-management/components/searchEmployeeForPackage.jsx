import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti, ExportExcel, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';

import { EmployeeCreateForm, EmployeeDetailForm, EmployeeEditFrom, EmployeeImportForm } from './combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { CareerReduxAction } from '../../../career/redux/actions';
import { MajorActions } from '../../../major/redux/actions';
import { SearchDataImportForm } from './searchDataImportForm';


class SearchEmployeeForPackage extends Component {
    constructor(props) {
        super(props);
        let search = window.location.search.split('?')
        let keySearch = 'organizationalUnits';
        let organizationalUnits = null;
        for (let n in search) {
            let index = search[n].lastIndexOf(keySearch);
            if (index !== -1) {
                organizationalUnits = search[n].slice(keySearch.length + 1, search[n].length);
                if (organizationalUnits !== 'null' && organizationalUnits.trim() !== '') {
                    organizationalUnits = organizationalUnits.split(',')
                } else organizationalUnits = null
                break;
            }
        }

        this.state = {
            searchForPackage: true,
            // organizationalUnits: organizationalUnits,
            status: 'active',
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.getAllEmployee(this.state);
        this.props.getDepartment();
        this.props.getListMajor({ name: '', page: 1, limit: 1000 });
        this.props.getListCareerPosition({ name: '', page: 1, limit: 1000 });
        this.props.getListCareerAction({ name: '', page: 1, limit: 1000 });
        this.props.getListCareerField({ name: '', page: 1, limit: 1000 });
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
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

    /**
     *  Bắt sự kiện click xem thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn xem
     */
    handleView = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowView: value
            }
        });
        window.$(`#modal-detail-employee${value._id}`).modal('show');
    }

    /**
     * Bắt sự kiện click chỉnh sửa thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn chỉnh sửa
     */
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$(`#modal-edit-employee${value._id}`).modal('show');
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id đơn vị
     */
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnits: value
        })
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id trình độ
     */
    handleChangeProfessionalSkill = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            professionalSkill: value[0]
        })
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id Chuyên ngành
     */
    handleMajor = (value) => {
        let { major } = this.props;
        const listMajor = major.listMajor;
        let dataTreeMajor = []
        for (let i in listMajor) {
            let groupMap = listMajor[i].group;
            let group = listMajor[i].group.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    parent: "#",
                }
            });
            dataTreeMajor = [...dataTreeMajor, ...group];
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
                dataTreeMajor = [...dataTreeMajor, ...specialized];
            }
        }

        let majorSearch;
        let tmp = dataTreeMajor.find(e => e.id === value[0])
        if (tmp) {
            if (tmp?.specialized) { // là group
                majorSearch = tmp?.id
            } else { // là specialize
                majorSearch = tmp?.parent;
            }
        }

        this.setState({ majorID: value[0], majorInfo: majorSearch });
    }

    /**
     * function lưu giá trị của hd công việc
     * @param {*} value : Array id Vị trí công việc
     */

    handleAction = (value) => {
        // let { career } = this.props;
        // let listAction = career?.listAction.map(elm => { return { ...elm, id: elm._id } });

        // let action = listAction?.filter(e => value.indexOf(e._id) !== -1);

        let action = this.state.action;
        if(!this.state.action){
            action = [];
        }
        // if(action.indexOf(value[value.length-1]) === -1){
            console.log('quangyDsd');
            this.setState({ action: value });
        // } else {
        //     this.forceUpdate();
        // }

        console.log('value', value, value[value.length-1], action.indexOf(value[value.length-1]));
    };

    handleField = (value) => {
        this.setState({ field: value[0], position: undefined });
    };

    handlePosition = (value) => {
        // let { career } = this.props;
        // let listPosition = career?.listPosition.map(elm => { return { ...elm, id: elm._id } });
        // let position = listPosition?.find(e => e._id === value[0]);
        console.log('value', value);
        this.setState({ position: value[0] });
    };

    // handleCareer = (value) => {
    //     this.setState({ careerInfo: value[0] });
    // }

    /**
     * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
     * @param {*} value : Tháng hết hạn hợp đồng
     */
    handleEndDateOfCertificateChange = (value) => {
        // if (value) {
        //     let partMonth = value.split('-');
        //     value = [partMonth[1], partMonth[0]].join('-');
        // }
        this.setState({
            ...this.state,
            certificatesEndDate: value
        });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        this.props.getAllEmployee(this.state);
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng trên 1 trang
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getAllEmployee(this.state);
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang muốn xem
     */
    setPage = async (pageNumber) => {
        console.log('xx', pageNumber);
        let page = (pageNumber - 1);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getAllEmployee(this.state);
    }

    /** show more option search */
    clickShowMore = () => {
        this.setState(state => {
            return {
                ...state,
                showMore: !state.showMore,
            }
        });
    }

    // import thông tin tìm kiếm
    clickImport = async () => {
        await this.setState({
            importSearch: true
        })
        window.$('#modal_import_file_search').modal('show');
    }

    clickExport = () => {
        console.log('export data search click');
    }

    convertDataExport = () => {
        let datas = [];
        let { position, professionalSkill, majorInfo,
            certificatesName, certificatesType, certificatesEndDate,
            exp, sameExp, field, action } = this.state;
            console.log('state', this.state);
        let out = {
            STT: 1,
            position: position,
            professionalSkill: professionalSkill,
            majorSearch: majorInfo,
            certificatesType: certificatesType,
            certificatesName: certificatesName,
            certificatesEndDate: certificatesEndDate,
            exp: exp,
            sameExp: sameExp,
            field: field,
            package: this.state.package,
            action: action && action.join(","),
        }
        datas = [...datas, out];

        let res = {
            fileName: "Mẫu thông tin tìm kiếm",
            dataSheets: [{
                sheetName: "Sheet1",
                sheetTitle: 'Mẫu thông tin tìm kiếm',
                tables: [{
                    rowHeader: 1,
                    merges: [],
                    columns: [
                        { key: "position", value: "Vị trí công việc" },
                        { key: "professionalSkill", value: "Trình độ chuyên môn" },
                        { key: "majorSearch", value: "Chuyên ngành" },
                        { key: "certificatesType", value: "Loại chứng chỉ" },
                        { key: "certificatesName", value: "Tên chứng chỉ" },
                        { key: "certificatesEndDate", value: "Hiệu lực chứng chỉ" },
                        { key: "exp", value: "Số năm kinh nghiệm" },
                        { key: "sameExp", value: "Số năm kinh nghiệm tương đương" },
                        { key: "field", value: "Lĩnh vực công việc" },
                        { key: "package", value: "Gói thầu" },
                        { key: "action", value: "Hoạt động công việc" },
                    ],
                    data: datas
                }]
            }]
        }
        return res;
    }

    updateSearchData = async (data) => {
        console.log('dataa', data);
        let { position, professionalSkill, majorSearch,
            certificatesName, certificatesType, certificatesEndDate,
            exp, sameExp, field, action } = data;
        this.setState({
            position: position,
            professionalSkill: professionalSkill,
            majorInfo: majorSearch,
            certificatesType: certificatesType,
            certificatesName: certificatesName,
            certificatesEndDate: certificatesEndDate,
            exp: exp,
            sameExp: sameExp,
            field: field,
            package: data.package,
            action: action,
        });

    }
    
    formatSkill = (item) => {
        if(item === "intermediate_degree") return "Trung cấp";
        if(item === "colleges") return "Cao đẳng";
        if(item === "university") return "Đại học";
        if(item === "bachelor") return "Cử nhân";
        if(item === "engineer") return "Kỹ sư";
        if(item === "master_degree") return "Thạc sĩ";
        if(item === "phd") return "Tiến sĩ";
        if(item === "unavailable") return "Không có";
    }
    
    formatDegreeType = (item) => {
         //excellent-Xuất sắc, very_good-Giỏi, good-Khá, average_good-Trung bình khá, ordinary-Trung bình
        if(item === "excellent") return "Xuất sắc";
        if(item === "very_good") return "Giỏi";
        if(item === "good") return "Khá";
        if(item === "average_good") return "Trung bình khá";
        if(item === "ordinary") return "Trung bình";
    }


    render() {
        const { employeesManager, translate, department, career, major } = this.props;

        const { showMore, importEmployee, limit, page, currentRow, currentRowView,
                certificatesEndDate, certificatesType, certificatesName, 
                professionalSkill, majorInfo, exp, sameExp, majorID, 
                field, position, action } = this.state; // filterField, filterPosition, filterAction, 

        let listEmployees = [];
        if (employeesManager.listEmployees) {
            listEmployees = employeesManager.listEmployees;
        }

        let pageTotal = ((employeesManager.totalList % limit) === 0) ?
            parseInt(employeesManager.totalList / limit) :
            parseInt((employeesManager.totalList / limit) + 1);
        let currentPage = parseInt(page + 1);

        let listField = career.listField;
        let dataTreeField = []
        let lField = listField.map(elm => {
            return {
                ...elm,
                id: elm._id,
                text: elm.name,
                state: { "opened": true },
                parent: "#",
            }
        });
        dataTreeField = [...dataTreeField, ...lField];

        let listPosition = career.listPosition;
        let dataTreePosition = []
        let pos = listPosition.map(elm => {
            return {
                ...elm,
                id: elm._id,
                text: elm.name,
                state: { "opened": true },
                parent: "#",
            }
        });
        dataTreePosition = [...dataTreePosition, ...pos];

        if(field) {
            let listPos = listField.find(e => String(e._id) === String(field) )?.position?.map(elm => elm.position._id)
            let tmp = dataTreePosition.filter(e => listPos.indexOf(String(e.id)) !== -1);
            dataTreePosition = tmp;
        }
        
        let listAction = career.listAction.filter(e => e.isLabel !== 1);
        let dataTreeAction = []
        let acts = listAction.map(elm => {
            return {
                ...elm,
                id: elm._id,
                text: elm.name,
                state: { "opened": true },
                parent: "#",
            }
        });
        // dataTreeAction = [...dataTreeAction, ...act];
        for (let i in listAction) {
            let labelMap = listAction[i].label;
            let labels = labelMap.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    // state: { "opened": true },
                    // parent: listAction[i]._id.toString(),
                }
            });
            dataTreeAction = [...dataTreeAction, ...labels];
        }

        let listSelectAction = career.listAction.filter(e => e.isLabel === 1).map(e => {
            return { id: e._id, text: e.name, value: []}
        });

        for(let i in listSelectAction) {
            for(let x in listAction){
                if( listAction[x].label.map(lb => lb._id).indexOf(String(listSelectAction[i].id)) !== -1 ){
                    listSelectAction[i].value.push(
                        {text: listAction[x].name, value: listAction[x]._id}
                    )
                }
            }
        }

        const listMajor = major.listMajor;
        let dataTreeMajor = []
        for (let i in listMajor) {
            let groupMap = listMajor[i].group;
            let group = listMajor[i].group.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    parent: "#",
                }
            });
            dataTreeMajor = [...dataTreeMajor, ...group];
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
                dataTreeMajor = [...dataTreeMajor, ...specialized];
            }
        }

        let professionalSkillArr = [
            { value: "", text: "Chọn trình độ" },
            { value: "intermediate_degree", text: "Trung cấp" },
            { value: "colleges", text: "Cao đẳng" },
            { value: "university", text: "Đại học" },
            { value: "bachelor", text: "Cử nhân" },
            { value: "engineer", text: "Kỹ sư" },
            { value: "master_degree", text: "Thạc sĩ" },
            { value: "phd", text: "Tiến sĩ" },
            { value: "unavailable", text: "Không có" },
        ];

        // Filter danh sách
        let filterField = dataTreeField;
        let filterPosition = dataTreePosition;
        let filterAction = dataTreeAction;

        let posCodeArr = [];
        if (field?.id) {
            for (let x in field.position) {
                posCodeArr = [...posCodeArr, ...field.position[x].code];
            }
            filterPosition = listPosition.filter((item) => posCodeArr.find(e => e === item.code));
            dataTreePosition = [];
            let pos = filterPosition.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    parent: "#",
                }
            });
            dataTreePosition = [...dataTreePosition, ...pos];
            for (let i in filterPosition) {
                let desMap = filterPosition[i].description;
                let description = desMap.map(elm => {
                    return {
                        ...elm,
                        id: elm._id,
                        text: elm.name,
                        state: { "opened": true },
                        parent: filterPosition[i]._id.toString(),
                    }
                });
                dataTreePosition = [...dataTreePosition, ...description];
            };
        }

        console.log('listEmployees', career, );

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Vị trí công việc  */}
                        <div className="form-group">
                            <label className="form-control-static">Vị trí công việc</label>
                            <TreeSelect data={dataTreePosition} value={[position]} handleChange={this.handlePosition} mode="radioSelect" />
                        </div>
                        {/* Trình độ chuyên môn  */}
                        <div className="form-group">
                            <label className="form-control-static">Trình độ chuyên môn</label>
                            <SelectBox id={`professionalSkillArr-selectbox`}
                                multiple={false}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={professionalSkill}
                                items={professionalSkillArr} onChange={this.handleChangeProfessionalSkill}>
                            </SelectBox>
                        </div>
                        {/* Chuyên ngành  */}
                        <div className="form-group">
                            <label className="form-control-static">Chuyên ngành</label>
                            <TreeSelect data={dataTreeMajor} value={[majorInfo]} handleChange={this.handleMajor} mode="radioSelect" />
                        </div>
                    </div>

                    <div className="form-inline">
                        {/* Loại chứng chỉ */}
                        <div className="form-group">
                            <label className="form-control-static">Loại chứng chỉ</label>
                            <input type="text" className="form-control" value={certificatesType} name="certificatesType" onChange={this.handleChange} placeholder={"Oracle Database"} />
                        </div>
                        {/* Loại hợp đồng lao động */}
                        <div className="form-group">
                            <label className="form-control-static">Tên chứng chỉ</label>
                            <input type="text" className="form-control" value={certificatesName} name="certificatesName" onChange={this.handleChange} />
                        </div>
                        {/* Tháng hết hạn chứng chỉ */}
                        <div className="form-group">
                            <label className="form-control-static">Hiệu lực chứng chỉ</label>
                            <DatePicker
                                id="month-endDate-certificate"
                                // dateFormat="month-year"
                                value={certificatesEndDate}
                                onChange={this.handleEndDateOfCertificateChange}
                            />
                        </div>
                    </div>

                    <div className="form-inline">
                        {/* Số năm kinh nghiệm */}
                        <div className="form-group">
                            <label className="form-control-static">Số năm KN</label>
                            <input type="number" className="form-control" value={exp} name="exp" onChange={this.handleChange} placeholder={"Số năm kinh nghiệm"} />
                        </div>
                        {/* Số năm kinh nghiệm công việc tương đương */}
                        <div className="form-group">
                            <label className="form-control-static">Số năm KN công việc tương đương</label>
                            <input type="number" className="form-control" value={sameExp} name="sameExp" onChange={this.handleChange} placeholder={"Kinh nghiệm công việc tương tự"} />
                        </div>
                    </div>


                    {showMore &&
                        <div className="form-inline">
                            {/* Lĩnh vực công việc  */}
                            <div className="form-group">
                                <label className="form-control-static">Lĩnh vực công việc</label>
                                <TreeSelect data={dataTreeField} value={[field]} handleChange={this.handleField} mode="radioSelect" />
                            </div>
                            {/* Tên gói thầu */}
                            <div className="form-group">
                                <label className="form-control-static">Tên gói thầu</label>
                                <input type="text" className="form-control" value={this.state.package} name="package" onChange={this.handleChange} />
                            </div>
                            {/* Hoạt động công việc  */}
                            <div className="form-group">
                                <label className="form-control-static">Hoạt động công việc</label>
                                {/* <TreeSelect data={dataTreeAction} value={action?.id} handleChange={this.handleAction} mode="radioSelect" /> */}
                                <SelectBox
                                    id={`select-career-action-select`}
                                    lassName="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listSelectAction}
                                    // items={listAction.map(x => {
                                    //     return { text: x.name, value: x._id }
                                    // })}
                                    options={{ placeholder: "Chọn hoạt động công việc" }}
                                    onChange={this.handleAction}
                                    value={action}
                                    multiple={true}
                                />
                            </div>

                        </div>
                    }
                    <div className="form-inline" style={{ marginBottom: 15 }}>
                        {/* Button show more */}
                        <div className="form-group">
                            <label></label>
                            <div className="dropdown">
                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="true" title={translate('human_resource.profile.employee_management.add_employee_title')} >Tùy chọn</button>
                                <ul className="dropdown-menu" style={{ marginTop: 0 }}>
                                    <li><a style={{ cursor: 'pointer' }} onClick={this.clickImport}>Nhập thông tin tìm kiếm từ file</a></li>
                                    {/* <li><a style={{ cursor: 'pointer' }} onClick={this.clickExport}>Lưu thông tin tìm kiếm</a></li> */}
                                    <li>
                                        <ExportExcel id="download_template_search_package" type='link' exportData={this.convertDataExport()}
                                            buttonName='Lưu thông tin tìm kiếm' />
                                    </li>
                                </ul>
                            </div>
                            <button type="button" className="btn btn-primary" title={translate('general.search')} onClick={this.clickShowMore} >
                                {showMore ?
                                    <span>
                                        Show less <i className="fa fa-angle-double-up"></i>
                                    </span>
                                    : <span>
                                        Show more <i className="fa fa-angle-double-down"></i>
                                    </span>
                                }
                            </button>
                        </div>
                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label>
                                <button type="button" className="btn btn-success" title={translate('general.search')} onClick={this.handleSunmitSearch} >{translate('general.search')}</button>
                            </label>
                        </div>
                    </div>

                    <table id="employee-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('human_resource.staff_name')}</th>
                                <th>Vị trí công việc</th>
                                <th>Trình độ chuyên môn</th>
                                <th>Chuyên ngành</th>
                                <th>Chứng chỉ</th>
                                <th>Bằng cấp</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                    <DataTableSetting
                                        tableId="employee-table"
                                        columnArr={[
                                            translate('human_resource.staff_name'),
                                            "Vị trí công việc",
                                            "Trình độ chuyên môn",
                                            "Chuyên ngành",
                                            "Chứng chỉ",
                                            "Bằng cấp",
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listEmployees && listEmployees.length !== 0 &&
                                listEmployees.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.fullName}</td>
                                        <td>
                                            {x.career?.length > 0 ? (x.career?.map((e, key) => {
                                                return <li key={key}> {e?.position?.name} </li>
                                            })) : <p>Chưa có dữ liệu</p>
                                            }
                                        </td>
                                        <td>{this.formatSkill(x.professionalSkill)}</td>
                                        <td>{x.major?.length > 0 ? (x.major?.map((e, key) => {
                                            return <li key={key}> {e?.group?.name} - {e?.specialized?.name} </li>
                                        })) : <p>Chưa có dữ liệu</p>}
                                        </td>
                                        <td>
                                            {x.certificates?.length > 0 ? x.certificates?.map((e, key) => {
                                                return <li key={key}> {e?.name} - {e?.issuedBy} - Hiệu lực: {this.formatDate(e?.endDate)} </li>
                                            }) : <p>Chưa có dữ liệu</p>}
                                        </td>
                                        <td>
                                            {x.degrees?.length > 0 ? x.degrees?.map((e, key) => {
                                                return <li key={key}> {e?.name} - Năm: {e?.year} - Loại: {this.formatDegreeType(e?.degreeType)}</li>
                                            }) : <p>Chưa có dữ liệu</p>}
                                        </td>
                                        <td>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">view_list</i></a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>

                    </table>
                    {employeesManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listEmployees || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>
                {/* From thêm mới thông tin nhân viên */}
                <EmployeeCreateForm />

                {/* From import thông tin nhân viên*/
                    importEmployee && <EmployeeImportForm />
                }

                {/* From xem thông tin nhân viên */
                    <EmployeeDetailForm
                        _id={currentRowView ? currentRowView._id : ""}
                    />
                }
                {/* From chinh sửa thông tin nhân viên */
                    <EmployeeEditFrom
                        _id={currentRow ? currentRow._id : ""}
                    />
                }
                {/** modal import - export */
                    this.state.importSearch && <SearchDataImportForm updateSearchData={this.updateSearchData} />
                }
            </div>
        );
    };
}

function mapState(state) {
    const { employeesManager, department, career, major } = state;
    return { employeesManager, department, career, major };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    getListCareerAction: CareerReduxAction.getListCareerAction,
    getListCareerField: CareerReduxAction.getListCareerField,
    getListMajor: MajorActions.getListMajor,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    deleteEmployee: EmployeeManagerActions.deleteEmployee,
};

const searchEmployeeForPackage = connect(mapState, actionCreators)(withTranslate(SearchEmployeeForPackage));
export { searchEmployeeForPackage as SearchEmployeeForPackage };
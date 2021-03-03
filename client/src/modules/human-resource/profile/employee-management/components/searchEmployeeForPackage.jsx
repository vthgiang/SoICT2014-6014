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
import { ViewEmployeeCVForm } from './viewEmployeeCVForm';
import { formatDate } from '../../../../../helpers/formatDate';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';


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

        const tableId = "search-employee-for-package";
        const defaultConfig = { limit: 5 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            searchForPackage: true,
            // organizationalUnits: organizationalUnits,
            status: 'active',
            page: 0,
            limit: limit,
            listSuggest: {},
            listSuggestForProps: {},
            tableId
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
        window.$(`#modal-view-cv-form-employee${value._id}`).modal('show');
    }

    /**
     *  Xóa đề xuất
     * @param {*} value : Thông tin nhân viên muốn xem
     */
    deleteSuggest = async (id) => {
        console.log('state.listSuggest', id, this.state.listSuggest);
        await this.setState(state => {
            delete state.listSuggest[id];
            state.listSuggestForProps[id] = {
                ...state.listSuggestForProps[id],
                suggested: false
            }
            return {
                ...state,
            }
        });
    }

    /**
     *  Thêm đề xuất
     * @param {*} value : Thông tin nhân viên muốn xem
     */
    addSuggest = async (id, x) => {
        await this.setState(state => {
            state.listSuggest[id] = x;
            state.listSuggestForProps[id] = x;
            return {
                ...state,
            }
        });
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
        let action = this.state.action;
        if (!this.state.action) {
            action = [];
        }

        this.setState({ action: value });

        console.log('value', value, value[value.length - 1], action.indexOf(value[value.length - 1]));
    };

    handleField = (value) => {
        this.setState({ field: value[0], position: undefined });
    };

    handlePosition = (value) => {
        let { career } = this.props;
        let listPosition = career?.listPosition.map(elm => { return { ...elm, id: elm._id } });
        let position = listPosition?.find(e => e._id === value[0]);
        console.log('value', value, position);
        this.setState({ position: value[0], posName: position?.name });
    };

    /**
     * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
     * @param {*} value : Tháng hết hạn hợp đồng
     */
    handleEndDateOfCertificateChange = (value) => {
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
        console.log('state', this.state);
        let data = this.state;
        let keySearch = {
            organizationalUnits: data.organizationalUnits,
            professionalSkill: data.professionalSkill,
            majorInfo: data.majorInfo,
            certificatesName: data.certificatesName,
            certificatesType: data.certificatesType,
            certificatesEndDate: data.certificatesEndDate,
            field: data.field,
            package: data.package,
            position: data.position,
            action: data.action,
            exp: data.exp,
            sameExp: data.sameExp,
            page: data.page,
            limit: data.limit,
            searchForPackage: true,
            status: "active"
        }
        console.log('keysearch', keySearch, this.state);
        this.props.getAllEmployee(keySearch);
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
            fileName: "Mẫu thông tin tìm kiếm mẫu",
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

    getYear = (date) => {
        let t1 = new Date(date).getTime();
        let t2 = new Date().getTime();

        let year = Math.round((t2 - t1) / (365 * 24 * 3600 * 1000) * 10) / 10;
        return year;
    }

    convertExportSearchResult = () => {
        let datasA = [];
        let datasB = [];
        let datasC = [];
        const { employeesManager } = this.props;
        const { listSuggest } = this.state;

        let listEmployees = [];
        if (employeesManager.listEmployees) {
            listEmployees = employeesManager.listEmployees;
        }

        let stt = 0
        // mẫu 11A
        for (let a in listSuggest) {
            let x = listSuggest[a];
            stt = stt + 1;
            let outA = {
                STT: stt,
                fullName: x.emp?.fullName,
                position: x.position,
            }
            datasA = [...datasA, outA];
        }

        stt = 0;
        // mẫu 11B
        for (let b in listSuggest) {
            let x = listSuggest[b].emp;
            stt = stt + 1;
            let outB = {
                STT: stt,
                fullName: x?.fullName,
                position: x?.roles?.map(e => e.roleId.name).join(", "),
                birthdate: this.formatDate(x?.birthdate),

                professionalSkill: (`- Trình độ: ${this.formatSkill(x?.professionalSkill)}\n- Chứng chỉ: ${x?.certificates?.length > 0 && x?.certificates?.map((e, key) => {
                    return `- ${e?.name} - ${e?.issuedBy} - Hiệu lực: ${this.formatDate(e?.endDate)}`
                }).join("\n")}`).split("\n").join("\n"),

                boss: x?.company?.name,
                address: x?.company?.address,
                jobTitle: `${this.formatSkill(x?.professionalSkill)} ${x?.major?.length > 0 ? `về ${x?.major[0].specialized?.name}` : ""}`,
                yearExp: this.getYear(x?.experiences[0].startDate),
                contactPerson: x?.company?.contactPerson?.name,
                phone: `- Điện thoại: ${x?.company?.phone}\n- Fax: ${x?.company?.fax}\n-Email: ${x?.company?.email}`,
            }
            datasB = [...datasB, outB];
        }


        stt = 0;
        // mẫu 11C
        for (let i in listSuggest) {
            let x = listSuggest[i].emp;
            stt = stt + 1;
            let outC = {
                STT: stt,
                fullName: x?.fullName,
                startDate: x?.career?.length > 0 ? this.formatDate(x?.career[0].startDate) : "Không có dữ liệu",
                endDate: x?.career?.length > 0 ? this.formatDate(x?.career[0].startDate) : "Không có dữ liệu",
                career: x?.career?.length > 0 ? `-Dự án: ${x?.career[0].package}\n-Chức vụ: ${x?.career[0].position?.name}\n-Kinh nghiệm chuyên môn và quản lý có liên quan:\n${x?.career[0].action.map(act => `  + ${act?.name}`).join("\n")}`.split("\n").join("\n") : `Chưa có dữ liệu`,
            }
            datasC = [...datasC, outC];
            let lengthOfCareer = x?.career.length;
            if (lengthOfCareer > 1) {
                for (let k = 1; k < lengthOfCareer; k++) {
                    outC = {
                        STT: "",
                        fullName: "",
                        startDate: x?.career?.length > 0 ? this.formatDate(x.career[k].startDate) : "Không có dữ liệu",
                        endDate: x?.career?.length > 0 ? this.formatDate(x.career[k].startDate) : "Không có dữ liệu",
                        career: x?.career?.length > 0 ? `-Dự án: ${x?.career[k].package}\n-Chức vụ: ${x?.career[k].position?.name}\n-Kinh nghiệm chuyên môn và quản lý có liên quan:\n${x?.career[k].action.map(act => `  + ${act?.name}`).join("\n")}`.split("\n").join("\n") : `Chưa có dữ liệu`,
                    }
                    datasC = [...datasC, outC];
                }
            }
        }


        let res = {
            fileName: "Danh sách tìm kiếm nhân viên",
            dataSheets: [
                {
                    sheetName: "A.Bảng đề xuất nhân sự chủ chốt",
                    sheetTitle: 'Bảng đề xuất nhân sự chủ chốt',
                    tables: [{
                        rowHeader: 1,
                        merges: [],
                        columns: [
                            { key: "STT", value: "STT", width: 7 },
                            { key: "fullName", value: "Họ và tên", width: 20 },
                            { key: "position", value: "Vị trí công việc", width: 30 },
                        ],
                        data: datasA
                    }]
                },
                {
                    sheetName: "B.Bảng lý lịch chuyên môn của nhân sự chủ chốt",
                    sheetTitle: 'Bảng lý lịch chuyên môn của nhân sự chủ chốt',
                    tables: [{
                        rowHeader: 2,
                        merges: [{
                            key: "info",
                            columnName: "Thông tin nhân sự",
                            keyMerge: 'STT',
                            colspan: 5
                        }, {
                            key: "career",
                            columnName: "Công việc hiện tại",
                            keyMerge: 'boss',
                            colspan: 6
                        }],
                        columns: [
                            { key: "STT", value: "STT", width: 7 },
                            { key: "fullName", value: "Tên", width: 20 },
                            { key: "position", value: "Vị trí", width: 25 },
                            { key: "birthdate", value: "Ngày, tháng, năm sinh", width: 25 },
                            { key: "professionalSkill", value: "Trình độ chuyên môn", width: 25 },
                            { key: "boss", value: "Tên người sử dụng lao động", width: 30 },
                            { key: "address", value: "Địa chi người sử dụng lao động", width: 30 },
                            { key: "jobTitle", value: "Chức danh", width: 25 },
                            { key: "yearExp", value: "Số năm làm việc cho người sủ dụng lao động hiện tại", width: 15 },
                            { key: "contactPerson", value: "Người liên lạc (tưởng phòng / cán bộ phụ trách nhân sự)", width: 25 },
                            { key: "phone", value: "Điện thoại/ Fax/ Email", width: 35 },
                        ],
                        data: datasB
                    }]
                },
                {
                    sheetName: "C.Bảng kinh nghiệm chuyên môn",
                    sheetTitle: 'Bảng kinh nghiệm chuyên môn',
                    tables: [{
                        rowHeader: 1,
                        merges: [],
                        columns: [
                            { key: "STT", value: "STT", width: 7 },
                            { key: "fullName", value: "Tên nhân sự chủ chốt", width: 20 },
                            { key: "startDate", value: "Từ ngày", width: 25 },
                            { key: "endDate", value: "Đến ngày", width: 25 },
                            { key: "career", value: "Dự án/ Chức vụ/ Kinh nghiệm chuyên môn và quản lý có liên quan", width: 60 },
                        ],
                        data: datasC
                    }]
                }
            ]
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
        if (item === "intermediate_degree") return "Trung cấp";
        if (item === "colleges") return "Cao đẳng";
        if (item === "university") return "Đại học";
        if (item === "bachelor") return "Cử nhân";
        if (item === "engineer") return "Kỹ sư";
        if (item === "master_degree") return "Thạc sĩ";
        if (item === "phd") return "Tiến sĩ";
        if (item === "unavailable") return "Không có";
    }

    formatDegreeType = (item) => {
        //excellent-Xuất sắc, very_good-Giỏi, good-Khá, average_good-Trung bình khá, ordinary-Trung bình
        if (item === "excellent") return "Xuất sắc";
        if (item === "very_good") return "Giỏi";
        if (item === "good") return "Khá";
        if (item === "average_good") return "Trung bình khá";
        if (item === "ordinary") return "Trung bình";
    }


    render() {
        const { employeesManager, translate, department, career, major } = this.props;

        const { showMore, importEmployee, limit, page, currentRow, currentRowView,
            certificatesEndDate, certificatesType, certificatesName,
            professionalSkill, majorInfo, exp, sameExp, majorID,
            field, position, posName, action, listSuggest, listSuggestForProps, tableId } = this.state; // filterField, filterPosition, filterAction, 

        let listEmployees = [];
        if (employeesManager.listEmployees) {
            listEmployees = employeesManager.listEmployees;
        }
        console.log('listEmployees1', listEmployees);

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

        if (field) {
            let listPos = listField.find(e => String(e._id) === String(field))?.position?.map(elm => elm.position._id)
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
            return { id: e._id, text: e.name, value: [] }
        });

        for (let i in listSelectAction) {
            for (let x in listAction) {
                if (listAction[x].label.map(lb => lb._id).indexOf(String(listSelectAction[i].id)) !== -1) {
                    listSelectAction[i].value.push(
                        { text: listAction[x].name, value: listAction[x]._id }
                    )
                }
            }
        }

        let additionalItems = career.listAction.filter(e => e.isLabel !== 1 && e.label.length === 0).map(x => { return { text: x.name, value: x._id } })

        listSelectAction = [...listSelectAction, ...additionalItems];

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

        console.log('listEmployees2', listEmployees);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    { // Object.keys(listSuggest).length > 0 &&
                        <div className="form-inline">
                            {/* Button export nhân viên */}
                            {<ExportExcel id="export-process-template" exportData={this.convertExportSearchResult()} buttonName={"Xuất file tìm kiếm"} style={{ marginLeft: 5, marginTop: 5 }} />}
                        </div>
                    }
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
                                        Ẩn bớt <i className="fa fa-angle-double-up"></i>
                                    </span>
                                    : <span>
                                        Hiện thêm <i className="fa fa-angle-double-down"></i>
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


                    <h4>Danh sách nhân viên tìm kiếm</h4>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
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
                                        tableId={tableId}
                                        columnArr={[
                                            translate('human_resource.staff_name'),
                                            "Vị trí công việc",
                                            "Trình độ chuyên môn",
                                            "Chuyên ngành",
                                            "Chứng chỉ",
                                            "Bằng cấp",
                                        ]}
                                        setLimit={this.setLimit}
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
                                                return <li key={key}>{new Date(e.startDate).getFullYear()} - {new Date(e.endDate).getFullYear()} : {e?.position ? (e?.position?.name) : "Không có thông tin vị trí"}</li>
                                            })) : <p>Chưa có dữ liệu</p>}
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

                    <h4>Bảng đề xuất nhân sự chủ chốt</h4>
                    <table id="employee-table-suggest" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('human_resource.staff_name')}</th>
                                <th>Vị trí công việc</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                    <DataTableSetting
                                        tableId="employee-table-suggest"
                                        columnArr={[
                                            translate('human_resource.staff_name'),
                                            "Vị trí công việc",
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(listSuggest).length !== 0 &&
                                Object.values(listSuggest).map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.emp.fullName}</td>
                                        <td>{x.position}</td>
                                        <td>
                                            <a onClick={() => this.deleteSuggest(x.id)} style={{ width: '5px' }} title={"Xóa đề xuất nhân sự"}><i style={{ color: "red" }} className="material-icons">delete</i></a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {
                        (Object.keys(listSuggest).length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </div>

                {/* From thêm mới thông tin nhân viên */}
                <EmployeeCreateForm />

                {/* From import thông tin nhân viên*/
                    importEmployee && <EmployeeImportForm />
                }

                {/* From xem thông tin nhân viên */
                    <ViewEmployeeCVForm
                        _id={currentRowView ? currentRowView._id : ""}
                        company={currentRowView?.company}
                        experiences={currentRowView?.experiences}
                        suggestItem={listSuggestForProps[currentRowView?._id]}
                        emp={currentRowView}
                        position={posName}

                        addSuggest={this.addSuggest}
                        deleteSuggest={this.deleteSuggest}
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
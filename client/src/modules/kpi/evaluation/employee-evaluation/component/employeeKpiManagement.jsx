import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { kpiMemberActions } from '../redux/actions';
import { DataTableSetting, ExportExcel } from '../../../../../common-components';
import { DatePicker, SelectBox } from '../../../../../common-components/index';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { EmployeeKpiApproveModal } from './employeeKpiApproveModal';
import { EmployeeKpiEvaluateModal } from './employeeKpiEvaluateModal';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';
import { withTranslate } from 'react-redux-multilingual';

class EmployeeKpiManagement extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            commenting: false,
            user: '',
            status: -1,
            startDate: null,
            endDate: null,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                user: '',
                status: -1,
                startDate: null,
                endDate: null
            },
            showApproveModal: null,
            showEvaluateModal: null,
            dataStatus : this.DATA_STATUS.NOT_AVAILABLE
        };
    }
    componentDidMount() {
        const { infosearch } = this.state;
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        this.props.getEmployeeKPISets(infosearch);
    }

    shouldComponentUpdate=(nextProps, nextStates)=>
    {
        const { dataStatus } =this.state;
        if (dataStatus === this.DATA_STATUS.QUERYING)
        {
            if (!nextProps.kpimembers.tasksList) {
                
                return false;
            } else {
                let exportData=this.convertDataToExportTotalData();
                if(exportData)ExportExcel.export(exportData)
                this.setState(state => {
                    return {
                        ...state,
                        dataStatus: this.DATA_STATUS.FINISHED,
                    }
                });
                return false;
            }
        }
        return true;
    }

    formatDateBack(date) {
        let d = new Date(date), month, day, year;
        if (d.getMonth() === 0) {
            month = '' + 12;
            day = '' + d.getDate();
            year = d.getFullYear() - 1;
        } else {
            month = '' + (d.getMonth() + 1);
            day = '' + d.getDate();
            year = d.getFullYear();
        }
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    checkStatusKPI = (status) => {
        if (status === 0) {
            return "Đang thiết lập";
        } else if (status === 1) {
            return "Chờ phê duyệt";
        } else if (status === 2) {
            return "Đã kích hoạt";
        }
    }
    handleStartDateChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                startDate: value,
            }
        });

    }
    handleEndDateChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                endDate: value,
            }
        });

    }
    handleEmployeeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                user: value
            }
        });
    }
    handleStatusChange = (value) => {
        if (value === -1) value = null;
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        });
    }

    handleExportTotalData = ()=>{
        let kpimember;
        const { kpimembers } =this.props;
        if(kpimembers.kpimembers)
        {
            kpimember = kpimembers.kpimembers
        }
        let data = kpimember.map(item=>{
            return item._id;
        })
        this.props.getTaskByListKpis(data);
        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    pushDataIntoTable =(dataOfOneSheet, time)=>{
        let table =[];
        for(let i=0;i<dataOfOneSheet.data.length;i++)
        {
            let name =dataOfOneSheet.data[i].name
            let kpisTable ={
                tableName: "-" + name+" " +"Danh sách KPI con trong tập KPI tháng ",
                columns: [
                    { key: "STT", value: "STT" },
                    { key: "name", value: "Tên KPI con" }, 
                    { key: "criteria", value : "Mô tả"},                               
                    { key: "status", value: "Trạng thái mục tiêu" },
                    { key: "automaticPoint", value: "Điểm KPI tự động" },
                    { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                    { key: "approverPoint", value: "Điểm KPI được phê duyệt" },
                    { key: "weight", value: "Trọng số" }
                ],
                data: dataOfOneSheet.data[i].kpis
            };
            table.push(kpisTable);
            for(let j=0;j<(dataOfOneSheet.data[i].oneKpiSetTasks.length);j++)
            {
                let oneTaskTable ={
                    tableName: dataOfOneSheet.data[i].oneKpiSetTasks[j].tableTitle,
                    columns: [
                        { key: "STT", value: "STT" },
                        { key: "name", value: "Tên hoạt động" },
                        { key: "startTaskDate", value: "Ngày bắt đầu công việc" },
                        { key: "endTaskDate", value: "Ngày kết thúc công việc" },
                        { key: "startApproveDate", value: "Ngày bắt đầu đánh giá" },
                        { key: "endApproveDate", value: "Ngày kết thúc đánh giá" },
                        { key: "status", value: "Trạng thái" },
                        { key: "contributionPoint", value: "Đóng góp (%)" },
                        { key: "automaticPoint", value: "Điểm KPI tự động" },
                        { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                        { key: "approverPoint", value: "Điểm KPI được phê duyệt" },
                        { key: "importantLevel", value: "Độ quan trọng" }
                    ],
                    data: dataOfOneSheet.data[i].oneKpiSetTasks[j].oneKpiTasks
                }
                table.push(oneTaskTable);
            }
        }
        
        return table;
    }

    convertDataToExportTotalData =()=>{
        const { kpimembers } =this.props;
        let listTasks,listKpis,data={},convertedData=[];
        if(kpimembers.tasksList)
        {
            listTasks =kpimembers.tasksList;
            listKpis =kpimembers.kpimembers
        }
        if(listTasks&&listKpis)
        {
            for(let i=0;i<listKpis.length;i++){
                let d = new Date(listKpis[i].date),
                    month = (d.getMonth()+1),
                    year = d.getFullYear(),
                    date = month+"-"+year;
                if(!data.hasOwnProperty(date))
                {
                    data[date]=[]
                }
                
                let kpis =listKpis[i].kpis.map((x,index)=>{
                    let name = x.name;
                    let createdAt = new Date(x.createdAt);
                    let automaticPoint = (x.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.automaticPoint);
                    let employeePoint = (x.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.employeePoint);
                    let approverPoint = (x.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x.approvedPoint);
                    let status = this.checkStatusKPI(x.status);
                    let criteria =x.criteria;
                    let weight =x.weight;
                    return {
                        STT: index + 1,
                        name: name,
                        criteria:criteria,
                        automaticPoint: automaticPoint,
                        status: status,
                        employeePoint: employeePoint,
                        approverPoint: approverPoint,
                        createdAt:createdAt,
                        weight:weight
                    }
                });
                let oneKpiSetTasks = listTasks[i].map((item,index)=>{
                    let oneKpiTasks = item.map((x,idx)=>{
                        let name = x.name;
                        let startTaskD = new Date(x.startDate);
                        let endTaskD = new Date(x.endDate);
                        let startApproveD = new Date(x.preEvaDate);
                        let endApproveD = new Date(x.date);
                        let automaticPoint = (x.results.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.results.automaticPoint);
                        let employeePoint = (x.results.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.results.employeePoint);
                        let approverPoint = (x.results.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x.results.approvedPoint);
                        let status = x.status;
                        let contributionPoint = parseInt(x.results.contribution);
                        let importantLevel = parseInt(x.results.taskImportanceLevel);

                        return {
                            STT: idx + 1,
                            name: name,
                            automaticPoint: automaticPoint,
                            status: status,
                            employeePoint: employeePoint,
                            approverPoint: approverPoint,
                            startTaskDate: startTaskD,
                            endTaskDate: endTaskD,
                            startApproveDate: startApproveD,
                            endApproveDate: endApproveD,
                            contributionPoint: contributionPoint,
                            importantLevel: importantLevel
                        };
                    })
                    return {
                        oneKpiTasks:oneKpiTasks,
                        tableTitle: "Danh sách các hoạt động ứng với KPI con "+ kpis[index].name
                    }
                })
                let oneSet = {
                    name:listKpis[i].creator.name,
                    oneKpiSetTasks,
                    kpis:kpis
                }
                let keys= Object.keys(data);
                data[date].push( oneSet);
            }
            
            let keys= Object.keys(data);
            for(let i=0;i<keys.length;i++){
                let temp ={
                    time:keys[i],
                    data:data[keys[i]]
                }
                convertedData.push(temp);
            }        
        
            let dataSheets =[];
            for(let i=0;i<convertedData.length;i++)
            {
                let table = this.pushDataIntoTable(convertedData[i], convertedData[i].time);
                let temp={
                    sheetName : convertedData[i].time,
                    sheetTitle:"Bảng theo dõi các hoạt động ứng với tập KPI nhân viên theo tháng "+ convertedData[i].time,
                    tables:table
                }
                dataSheets.push(temp);
            }
            let exportData = {
                fileName: "Bảng theo dõi các hoạt động ứng với tập KPI nhân viên theo từng tháng ",
                dataSheets: dataSheets
            }
            return exportData;
        }
        
    }

    handleSearchData = async () => {
        const { startDate, endDate, user, status, infosearch } = this.state;
        if (startDate === "") startDate = null;
        if (endDate === "") endDate = null;
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    user: user,
                    status: status,
                    startDate: startDate,
                    endDate: endDate
                },
                kpiId: null,
                employeeKpiSet: { _id: null },
            }
        })

        let start_Date, end_Date;
        let startdate = null, enddate = null;

        if (infosearch.startDate !== null) {
            start_Date = infosearch.startDate.split("-");
            startdate = new Date(start_Date[1], start_Date[0], 0);
        }
        if (infosearch.endDate !== null) {
            end_Date = infosearch.endDate.split("-");
            enddate = new Date(end_Date[1], end_Date[0], 28);
        }
        const { translate } = this.props;

        if (startdate && enddate && Date.parse(startdate) > Date.parse(enddate)) {
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
        else {
            this.props.getEmployeeKPISets(infosearch);
        }
    }
    handleShowApproveModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                kpiId: id
            }
        })
        window.$(`modal-approve-KPI-member`).modal('show');
    }
    showEvaluateModal = async (item) => {
        await this.setState(state => {
            return {
                ...state,
                employeeKpiSet: item
            }
        })
        window.$(`employee-kpi-evaluation-modal`).modal('show');
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data,unitName) => {
        let fileName = "Bảng theo dõi KPI nhân viên "+ (unitName?unitName:"");
        if (data) {           
            data = data.map((x, index) => {
               
                let fullName =x.creator.name;
                let email = x.creator.email;
                let automaticPoint = (x.automaticPoint === null)?"Chưa đánh giá":parseInt(x.automaticPoint);
                let employeePoint = (x.employeePoint === null)?"Chưa đánh giá":parseInt(x.employeePoint);
                let approverPoint =(x.approvedPoint===null)?"Chưa đánh giá":parseInt(x.approvedPoint);
                let time = new Date(x.date)
                let status = this.checkStatusKPI(x.status);
                let numberTarget =parseInt(x.kpis.length);               

                return {
                    STT: index + 1,
                    fullName: fullName,    
                    email:email,               
                    automaticPoint: automaticPoint,
                    status: status,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    time :time,
                    numberTarget:numberTarget                   
                };
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle : fileName,
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "time", value: "Thời gian" },
                                { key: "fullName", value: "Họ và tên" }, 
                                { key: "email", value : "Email nhân viên"},                               
                                { key: "numberTarget", value: "Số lượng mục tiêu" },
                                { key: "status", value: "Trạng thái mục tiêu" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" }
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData;        
       
    }

    render() {
        const { user, kpimembers } = this.props;
        const { translate } = this.props;
        const { status, startDate, endDate, kpiId, employeeKpiSet, perPage } = this.state;
        let userdepartments, kpimember, unitMembers, exportData;
        if (user.userdepartments) userdepartments = user.userdepartments;
        if (kpimembers.kpimembers) {
            kpimember = kpimembers.kpimembers;
        }
        if (userdepartments) {
            unitMembers = getEmployeeSelectBoxItems([userdepartments]);
            unitMembers = [{ text: translate('kpi.evaluation.employee_evaluation.choose_employee'), value: 0 }, ...unitMembers[0].value];
        }

        if(kpimember&&userdepartments){
            exportData = this.convertDataToExportData(kpimember,userdepartments.department);            
        }
       
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-body qlcv">
                        <EmployeeKpiApproveModal id={kpiId} />
                        <EmployeeKpiEvaluateModal employeeKpiSet={employeeKpiSet} />
                        <div className="form-inline">
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.employee')}:</label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`employee-kpi-manage`}
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={this.handleEmployeeChange}
                                        value={user}
                                    />}
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.status')}:</label>
                                <SelectBox
                                    id={`status-kpi`}
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: -1, text: translate('kpi.evaluation.employee_evaluation.choose_status') },
                                        { value: 0, text: translate('kpi.evaluation.employee_evaluation.establishing') },
                                        { value: 1, text: translate('kpi.evaluation.employee_evaluation.expecting') },
                                        { value: 2, text: translate('kpi.evaluation.employee_evaluation.activated') }
                                    ]}
                                    onChange={this.handleStatusChange}
                                    value={status}
                                />
                            </div>
                        </div>
                        <div className="form-inline">
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.from')}:</label>
                                <DatePicker
                                    id='start_date'
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                    dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.to')}:</label>
                                <DatePicker
                                    id='end_date'
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                    dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-success"  onClick={() => this.handleSearchData()}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                            </div>
                            {exportData&&<ExportExcel id="export-employee-kpi-evaluation-management" buttonName ="Báo cáo chung" exportData={exportData} style={{ marginRight: 15, marginTop:5 }} />}
                            {kpimember&&
                                 <ExportExcel buttonName ="Báo cáo tổng hợp" onClick={()=>this.handleExportTotalData(kpimember)}/> 
                            }
                        </div>

                        <DataTableSetting className="pull-right" tableId="kpiManagement" tableContainerId="tree-table-container" tableWidth="1300px"
                            columnArr={[
                                'STT',
                                'Thời gian',
                                'Tên nhân viên',
                                'Số lượng mục tiêu',
                                'Trạng thái KPI',
                                'Kết quả',
                                'Phê duyệt',
                                'Đánh giá']}
                            limit={perPage}
                            setLimit={this.setLimit}
                            hideColumnOption={true} />

                        <table id="kpiManagement" className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th title="STT" style={{ width: "40px" }} className="col-fixed">STT</th>
                                    <th title="Thời gian">{translate('kpi.evaluation.employee_evaluation.time')}</th>
                                    <th title="Tên nhân viên">{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                    <th title="Số lượng mục tiêu">{translate('kpi.evaluation.employee_evaluation.num_of_kpi')}</th>
                                    <th title="Trạng thái KPI">{translate('kpi.evaluation.employee_evaluation.kpi_status')}</th>
                                    <th title={translate('kpi.evaluation.employee_evaluation.system_evaluate')}>{translate('kpi.evaluation.employee_evaluation.system_evaluate')}</th>
                                    <th title={translate('kpi.evaluation.employee_evaluation.result_self_evaluate')}>{translate('kpi.evaluation.employee_evaluation.result_self_evaluate')}</th>
                                    <th title={translate('kpi.evaluation.employee_evaluation.evaluation_management')}>{translate('kpi.evaluation.employee_evaluation.evaluation_management')}</th>
                                    <th title="Phê duyệt" style={{ textAlign: "center" }}>{translate('kpi.evaluation.employee_evaluation.approve')}</th>
                                    <th title="Đánh giá">{translate('kpi.evaluation.employee_evaluation.evaluate')}</th>
                                </tr>
                            </thead>
                            <tbody className="task-table">
                                {(kpimember && kpimember.length !== 0) ?
                                    kpimember.map((item, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item ? this.formatDate(item.date) : "Deleted"}</td>
                                            <td>{item.creator ? item.creator.name : "Deleted"}</td>
                                            <td>{item.kpis ? item.kpis.length : "Deleted"}</td>
                                            <td>{item ? this.checkStatusKPI(item.status) : "Deleted"}</td>
                                            <td>{item.automaticPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.automaticPoint}</td>
                                            <td>{item.employeePoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.employeePoint}</td>
                                            <td>{item.approvedPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.approvedPoint}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a data-target={`#modal-approve-KPI-member`} onClick={() => this.handleShowApproveModal(item._id)} data-toggle="modal" className="approve"
                                                    title={translate('kpi.evaluation.employee_evaluation.approve_this_kpi')}><i className="fa fa-bullseye"></i></a>
                                            </td>
                                            <td>
                                                <a data-target={`#employee-kpi-evaluation-modal`} onClick={() => this.showEvaluateModal(item)} data-toggle="modal"
                                                    className="copy" title={translate('kpi.evaluation.employee_evaluation.evaluate_this_kpi')}><i className="fa fa-list"></i></a>
                                            </td>
                                        </tr>
                                    ) : <tr>
                                        <td colSpan={8}>
                                            <center>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</center>
                                        </td>
                                    </tr>}
                            </tbody>
                            
                        </table>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user, kpimembers, KPIPersonalManager } = state;
    return { user, kpimembers, KPIPersonalManager };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getEmployeeKPISets: kpiMemberActions.getEmployeeKPISets,
    getTaskByListKpis: kpiMemberActions.getTaskByListKpis
};
const connectedKPIMember = connect(mapState, actionCreators)(withTranslate(EmployeeKpiManagement));
export { connectedKPIMember as EmployeeKpiManagement };
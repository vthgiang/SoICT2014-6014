import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer, toast } from 'react-toastify';
import { ModalDetailTrainingPlan } from './ModalDetailTrainingPlan';
import { ModalEditTrainingPlan } from './ModalEditTrainingPlan';
import { ModalAddTrainingPlan } from './ModalAddTrainingPlan';
import { CourseActions } from '../redux/actions';
import { EducationActions } from '../../list-education/redux/actions';
import { ActionColumn } from '../../../../common-components/src/ActionColumn';
import { PaginateBar } from '../../../../common-components/src/PaginateBar';
import { DeleteNotification } from '../../../../common-components';
class TrainingPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberCourse: "",
            typeCourse: "All",
            page: 0,
            limit: 5,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.props.getListCourse(this.state);
        this.props.getAllEducation();
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleSunmitSearch = () => {
        this.props.getListCourse(this.state);
    }

    setLimit = async (number) => {
        await this.setState({ limit: parseInt(number) });
        this.props.getListCourse(this.state);
        window.$(`#setting-table`).collapse("hide");
    }

    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListCourse(this.state);
    }

    render() {
        var { listCourse } = this.props.course;
        const { translate } = this.props;
        console.log(listCourse)
        var pageTotal = (this.props.course.totalList % this.state.limit === 0) ?
            parseInt(this.props.course.totalList / this.state.limit) :
            parseInt((this.props.course.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box" id="qlcv">
                <div className="box-body">
                    <div className="form-inline">
                        <div className="form-group">
                            <h4 className="box-title">Danh sách các khoá đào tạo:</h4>
                        </div>
                        <button type="button" className="btn btn-success pull-right" data-toggle="modal" data-target="#modal-addTrainingPlan" >Thêm khoá đào tạo</button>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label htmlFor="numberCourse" style={{width:110}} className="form-control-static">Mã khoá đào tạo:</label>
                            <input type="text" className="form-control" name="numberCourse" onChange={this.handleChange} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label htmlFor="typeCourse" style={{width:110}} className="form-control-static">Loại đào tạo:</label>
                            <select className="form-control" defaultValue="All" name="typeCourse" onChange={this.handleChange}>
                                <option value="All">--Tất cả--</option>
                                <option value="Đào tạo nội bộ">Đào tạo nội bộ</option>
                                <option value="Đào tạo ngoài">Đào tạo ngoài</option>
                            </select>
                            <button type="submit" className="btn btn-success" onClick={() => this.handleSunmitSearch()} title="Tìm kiếm" >Tìm kiếm</button>
                        </div>
                    </div>
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Mã khoá đào tạo</th>
                                <th>Tên khoá đào tạo</th>
                                <th>Bắt đầu</th>
                                <th>Kết thúc</th>
                                <th>Địa điểm đào tạo</th>
                                <th>Đơn vị đào tạo</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>
                                    <ActionColumn
                                        columnName="Hành động"
                                        columnArr={[
                                            "Tên khoá đào tạo",
                                            "Bắt đầu",
                                            "Kết thúc",
                                            "Địa điểm đào tạo",
                                            "Đơn vị đào tạo"
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (listCourse.length === 0 || listCourse === []) ? <tr><td colSpan={7}><center> Không có dữ liệu</center></td></tr> :
                                    listCourse.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.numberCourse}</td>
                                            <td>{x.nameCourse}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{x.address}</td>
                                            <td>{x.unitCourse}</td>
                                            <td>
                                                <ModalDetailTrainingPlan data={x} />
                                                <ModalEditTrainingPlan data={x} />
                                                <DeleteNotification
                                                    content={{
                                                        title: "Xoá khoá đào tạo",
                                                        btnNo: translate('confirm.no'),
                                                        btnYes: translate('confirm.yes'),
                                                    }}
                                                    data={{
                                                        id: x._id,
                                                        info: x.nameCourse + " - " + x.numberCourse
                                                    }}
                                                    func={this.props.deleteCourse}
                                                />
                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                <ModalAddTrainingPlan />
                <ToastContainer />
            </div>
        );
    };
};

function mapState(state) {
    const { course } = state;
    return { course };
};

const actionCreators = {
    getListCourse: CourseActions.getListCourse,
    deleteCourse: CourseActions.deleteCourse,
    getAllEducation: EducationActions.getAll,
};

const connectedListCourse = connect(mapState, actionCreators)(withTranslate(TrainingPlan));
export { connectedListCourse as TrainingPlan };
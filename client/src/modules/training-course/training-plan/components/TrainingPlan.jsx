import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer, toast } from 'react-toastify';
import { ModalDetailTrainingPlan } from './ModalDetailTrainingPlan';
import { ModalEditTrainingPlan } from './ModalEditTrainingPlan';
import { ModalAddTrainingPlan } from './ModalAddTrainingPlan';
import { CourseActions } from '../redux/actions';
import { EducationActions } from '../../list-education/redux/actions';
import { ActionColumn } from '../../../../common-components';
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
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <div className="box">

                            {/* /.box-header */}
                            <div className="box-body">
                                <div className="col-md-12">
                                    <div className="box-header col-md-12">
                                        <h3 className="box-title" style={{ marginTop: 10 }}>Danh sách các khoá đào tạo:</h3>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="numberCourse" >Mã khoá đào tạo:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
                                            <input type="text" className="form-control" name="numberCourse" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="typeCourse" style={{ paddingTop: 5 }}>Loại đào tạo:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
                                            <select className="form-control" defaultValue="All" name="typeCourse" onChange={this.handleChange}>
                                                <option value="All">--Tất cả--</option>
                                                <option value="Đào tạo nội bộ">Đào tạo nội bộ</option>
                                                <option value="Đào tạo ngoài">Đào tạo ngoài</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-3" style={{ paddingTop: 5 }}>
                                        <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <button type="submit" className="btn btn-success" onClick={() => this.handleSunmitSearch()} title="Tìm kiếm" >Tìm kiếm</button>
                                        </div>
                                    </div>
                                    <div className="col-md-3" style={{ paddingTop: 5, paddingRight: 0 }}>
                                        <button type="submit" className="btn btn-success pull-right" id="" data-toggle="modal" data-target="#modal-addTrainingPlan" >Thêm khoá đào tạo</button>
                                    </div>
                                    <table id="listexample" className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>Mã đào tạo</th>
                                                <th style={{ width: "22%" }}>Tên khoá đào tạo</th>
                                                <th title="Thời gian bắt đầu">Bắt đầu</th>
                                                <th title="Thời gian kết thúc">Kết thúc</th>
                                                <th style={{ width: "15%" }}>Địa điểm đào tạo</th>
                                                <th style={{ width: "22%" }}>Đơn vị đào tạo</th>
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
                            </div>
                            {/* /.box-body */}
                        </div>
                        <ModalAddTrainingPlan />
                        {/* /.box */}
                    </div>
                    {/* /.col */}
                </div>
                <ToastContainer />
            </React.Fragment>
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
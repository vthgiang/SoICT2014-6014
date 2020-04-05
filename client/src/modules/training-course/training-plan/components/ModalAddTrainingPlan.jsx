import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import { CourseActions } from '../redux/actions';
class ModalAddTrainingPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: "VND",
            nameCourse: "",
            numberCourse: "",
            unitCourse: "",
            address: "",
            costsCourse: "",
            teacherCourse: "",
            time: "",
            typeCourse: "Đào tạo nội bộ",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleCloseModal = () => {
        this.setState({
            unit: "VND",
            nameCourse: "",
            numberCourse: "",
            unitCourse: "",
            address: "",
            costsCourse: "",
            teacherCourse: "",
            time: "",
            typeCourse: "Đào tạo nội bộ",
        });
        document.getElementById("add-course").reset();
        window.$(`#modal-addTrainingPlan`).modal("hide");
    }

    handleSubmit = async () => {
        var { translate } = this.props;
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value,
            educationProgram: this.refs.educationProgram.value,
        })
        console.log(this.state)
        if (this.state.numberCourse === "") {
            this.notifyerror("Bạn chưa nhập mã khoá học");
        } else if (this.state.nameCourse === "") {
            this.notifyerror("Bạn chưa nhập tên khoá học");
        } else if (this.state.startDate === "") {
            this.notifyerror("Bạn chưa nhập ngày bắt đầu");
        } else if (this.state.endDate === "") {
            this.notifyerror("Bạn chưa nhập ngày kết thúc");
        } else if (this.state.address === "") {
            this.notifyerror("Bạn chưa nhập địa chỉ đào tạo");
        } else if (this.state.unitCourse === "") {
            this.notifyerror("Bạn chưa nhập đơn vị đào tạo");
        } else if (this.state.educationProgram === "None") {
            this.notifyerror("Bạn chưa chọn thuộc chương trình đào tạo");
        } else if (this.state.costsCourse === "") {
            this.notifyerror("Bạn chưa nhập chi phí đào tạo");
        } else if (this.state.time === "") {
            this.notifyerror("Bạn chưa nhập thời gian cam kết");
        } else {
            this.props.createNewCourse(this.state);
            this.setState({
                unit: "VND",
                nameCourse: "",
                numberCourse: "",
                unitCourse: "",
                address: "",
                costsCourse: "",
                teacherCourse: "",
                time: "",
                typeCourse: "Đào tạo nội bộ",
            });
            document.getElementById("add-course").reset();
            window.$(`#modal-addTrainingPlan`).modal("hide");
        }
    }

    render() {
        var listEducation = [];
        if (this.props.education.listAll) {
            listEducation = this.props.education.listAll;
        }
        return (
            <div className="modal modal-full fade" id="modal-addTrainingPlan" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-size-75 ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => this.handleCloseModal()}>
                                <span aria-hidden="true">×</span></button>
                            <h4 style={{ textAlign: "center" }} className="modal-title">Thêm khoá đào tạo</h4>
                        </div>
                        <div className="modal-body" style={{ paddingTop: 0 }}>
                            {/* /.box-header */}
                            <div className="box-body">
                                <div className="col-md-12">
                                    <form id="add-course">
                                        <div className="checkbox" style={{ marginTop: 0, marginLeft: 30 }}>
                                            <label style={{ paddingLeft: 0 }}>
                                                (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                        </div>
                                        <div className="col-md-6" style={{ paddingLeft: 20, paddingRight: 20 }}>
                                            <div className="form-group">
                                                <label htmlFor="numberCourse">Mã khoá đào tạo:<span className="required">&#42;</span></label>
                                                <input type="text" className="form-control" name="numberCourse" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="startDate">Thời gian bắt đầu:<span className="required">&#42;</span></label>
                                                <input type="text" style={{ height: 33 }} className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="address">Địa điểm đào tạo:<span className="required">&#42;</span></label>
                                                <input type="text" className="form-control" name="address" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="teacherCourse">Giảng viên:</label>
                                                <input type="text" className="form-control" name="teacherCourse" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="educationProgram">Thuộc chương trình đào tạo:<span className="required">&#42;</span></label>
                                                <select
                                                    name="educationProgram"
                                                    className="form-control select2 pull-left"
                                                    onChange={this.handleChange}
                                                    style={{ width: '100%' }}
                                                    value="None"
                                                    ref="educationProgram"
                                                >
                                                    <option value="None">Hãy chọn chương trình đào tạo</option>
                                                    {
                                                        listEducation.length !== 0 &&
                                                        listEducation.map((education, index) => <option key={index} value={education._id}>{education.numberEducation} - {education.nameEducation}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="time">Thời gian cam kết (đơn vị: Tháng):<span className="required">&#42;</span></label>
                                                <input type="number" className="form-control" name="time" onChange={this.handleChange} autoComplete="off" />
                                            </div>

                                        </div>
                                        <div className="col-md-6" style={{ paddingLeft: 20, paddingRight: 20 }}>
                                            <div className="form-group">
                                                <label htmlFor="nameCourse">Tên khoá đào tạo:<span className="required">&#42;</span></label>
                                                <input type="text" className="form-control" name="nameCourse" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="endDate">Thời gian kết thúc:<span className="required">&#42;</span></label>
                                                <input type="text" style={{ height: 33 }} className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="unitCourse">Đơn vị đào tạo:<span className="required">&#42;</span></label>
                                                <input type="text" className="form-control" name="unitCourse" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="typeCourse">Loại đào tạo:<span className="required">&#42;</span></label>
                                                <select className="form-control" defaultValue="All" name="typeCourse" onChange={this.handleChange}>
                                                    <option value="Đào tạo nội bộ">Đào tạo nội bộ</option>
                                                    <option value="Đào tạo ngoài">Đào tạo ngoài</option>
                                                </select>
                                            </div>
                                            {/* TODO */}
                                            <div className="form-group">
                                                <label htmlFor="costsCourse">Chi phí đào tạo:<span className="required">&#42;</span></label>
                                                <input style={{ display: "inline", width: "80%" }} type="number" className="form-control" name="costsCourse" onChange={this.handleChange} autoComplete="off" />
                                                <select name="unit" id="" className="form-control" onChange={this.handleChange} style={{ height: 34, display: "inline", width: "20%" }}>
                                                    <option value="VND">VND</option>
                                                    <option value="USD">USD</option>
                                                </select>
                                            </div>

                                        </div>
                                    </form>
                                    <div className="col-md-12" style={{ paddingLeft: 20, paddingRight: 20 }}>
                                        <div className="form-group">
                                            <label className="pull-left">Nhân viên tham gia:</label>
                                        </div>
                                        <div className="form-group col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }} >
                                            <fieldset className="scheduler-border">
                                                <div className="form-group col-md-10" style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 5 }} >
                                                    <label className="pull-left">Thêm nhân viên:</label>
                                                    <select
                                                        name="employee"
                                                        className={`form-control select2`}
                                                        multiple="multiple"
                                                        onChange={this.handleChange}
                                                        style={{ width: '100%' }}
                                                        ref="employee"
                                                    >
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-2" style={{ paddingTop: 28, paddingRight: 0 }}>
                                                    <button type="submit" style={{ height: 34 }} className="btn btn-success pull-right" onClick={() => this.handleAdd()} title="Thêm nhân viên tham gia">Thêm nhân viên</button>
                                                </div>
                                                <div className=" col-md-12 pull-left" style={{ paddingLeft: 0, paddingRight: 0, width: "100%" }}>
                                                    <div className="box-header pull-left" style={{ paddingLeft: 0, paddingTop: 0 }}>
                                                        <h3 className="box-title pull-left">Danh sách nhân viên tham gia khoá đào tạo:</h3>
                                                    </div>
                                                </div>
                                                <table className="table table-bordered table-hover listcourse">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "18%" }}>Mã nhân viên</th>
                                                            <th>Tên nhân viên</th>
                                                            <th>Đơn vị</th>
                                                            <th style={{ width: '20%' }}>Kết quả</th>
                                                            <th style={{ width: "120px" }}>Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    </tbody>
                                                </table>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/* /.box-body */}
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModal()} >Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" title="Thêm mới khoá đào tạo" onClick={() => this.handleSubmit()} className="btn btn-success pull-right">Thêm mới</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};

function mapState(state) {
    const { course, education } = state;
    return { course, education };
};

const actionCreators = {
    createNewCourse: CourseActions.createNewCourse,
};

const connectedAddTrainingPlan = connect(mapState, actionCreators)(ModalAddTrainingPlan);
export { connectedAddTrainingPlan as ModalAddTrainingPlan };
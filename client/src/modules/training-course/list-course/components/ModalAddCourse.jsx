import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CourseActions } from '../redux/actions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class ModalAddCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCourse: {
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);


    handleChange(event) {
        const { name, value } = event.target;
        const { newCourse } = this.state;
        this.setState({
            show: "",
            newCourse: {
                ...newCourse,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        var { newCourse } = this.state;
        let select1 = this.refs.positionEducation;
        let positionEducation = [].filter.call(select1.options, o => o.selected).map(o => o.value);
        let select2 = this.refs.unitEducation;
        let unitEducation = [].filter.call(select2.options, o => o.selected).map(o => o.value);
        if (!newCourse.numberEducation) {
            this.notifyerror("Bạn chưa nhập mã chương trình đào tạo");
        } else if (!newCourse.nameEducation) {
            this.notifyerror("Bạn chưa nhập tên chương trình đào tạo");
        } else if (unitEducation.length <= 0) {
            this.notifyerror("Bạn chưa nhập đơn vị được áp dụng");
        } else if (positionEducation.length <= 0) {
            this.notifyerror("Bạn chưa nhập chức vụ được áp dụng");
        } else {
            const formData = new FormData();
            formData.append('numberEducation', newCourse.numberEducation);
            formData.append('nameEducation', newCourse.nameEducation);
            formData.append('unitEducation', []);
            formData.append('positionEducation', []);
            //this.props.addNewCourse(formData);
            this.props.addNewCourse({ ...this.state.newCourse, unitEducation, positionEducation });
            window.$(`#modal-addCourse`).modal("hide");
        }
    }
    render() {
        console.log(this.state);
        return (
            <div className="modal fade" id="modal-addCourse" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm chương trình đào tạo</h4>
                        </div>
                        <div className="modal-body">
                            {/* /.box-header */}
                            <div className="box-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="numberEducation">Mã chương trình đào tạo:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="numberEducation" defaultValue="" onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nameEducation">Tên chương trình đào tạo:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="nameEducation" onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Áp dụng cho đơn vị:</label>
                                        <select
                                            name="unitEducation"
                                            className="form-control select2"
                                            multiple="multiple"
                                            //onChange={this.inputChange}
                                            style={{ width: '100%' }}
                                            ref="unitEducation"
                                        >
                                            <option>Phòng Kinh doanh</option>
                                            <option>Phòng sản xuất</option>
                                            <option>Phòng kế hoạch</option>

                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Áp dụng cho chức vụ:</label>
                                        <select
                                            name="positionEducation"
                                            className="form-control select2"
                                            multiple="multiple"
                                            //onChange={this.inputChange}
                                            style={{ width: '100%' }}
                                            ref="positionEducation"
                                        >
                                            <option>Trưởng phòng</option>
                                            <option>Phó phòng</option>
                                            <option>Nhân viên</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* /.box-body */}
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" title="Thêm mới chương trình đào tạo" className="btn btn-success pull-right" onClick={this.handleSubmit}>Thêm mới</button>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div >
        );
    }
};
function mapState(state) {
    const { Course } = state;
    return { Course };
};

const actionCreators = {
    addNewCourse: CourseActions.createNewCourse,
};

const connectedAddCourse = connect(mapState, actionCreators)(ModalAddCourse);
export { connectedAddCourse as ModalAddCourse };
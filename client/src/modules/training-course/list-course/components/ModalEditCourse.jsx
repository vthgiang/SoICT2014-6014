import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CourseActions } from '../redux/actions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ModalEditCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoCourse: { ...this.props.data }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { infoCourse } = this.state;
        this.setState({
            infoCourse: {
                ...infoCourse,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        var { infoCourse } = this.state;
        let select1 = this.refs.positionEducation;
        let positionEducation = [].filter.call(select1.options, o => o.selected).map(o => o.value);
        let select2 = this.refs.unitEducation;
        let unitEducation = [].filter.call(select2.options, o => o.selected).map(o => o.value);
        if (!infoCourse.nameEducation) {
            this.notifyerror("Bạn chưa nhập tên chương trình đào tạo");
        } else if (unitEducation.length <= 0) {
            this.notifyerror("Bạn chưa nhập đơn vị được áp dụng");
        } else if (positionEducation.length <= 0) {
            this.notifyerror("Bạn chưa nhập chức vụ được áp dụng");
        } else {
            this.props.updateCourse(this.props.data.numberEducation, {...this.state.infoCourse,positionEducation,unitEducation});
            window.$(`#modal-editCourse-${this.props.data.numberEducation}`).modal("hide");
        }
    }
   
    render() {
        console.log(this.state);
        var { data } = this.props;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editCourse-${data.numberEducation}`} className="edit" title="Chỉnh sửa chương trình đào tạo" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal fade" id={`modal-editCourse-${data.numberEducation}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chỉnh sửa chương trình đào tạo: {data.nameEducation + "-" + data.numberEducation}</h4>
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
                                            <input type="text" className="form-control" defaultValue={data.numberEducation} name="numberEducation" disabled />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="nameEducation">Tên chương trình đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue={data.nameEducation} name="nameEducation" onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Áp dụng cho đơn vị:</label>
                                            <select
                                                name="unitEducation"
                                                className="form-control select2"
                                                multiple="multiple"
                                                value={data.unitEducation}
                                                onChange={this.handleChange}
                                                style={{ width: '100%' }}
                                                ref="unitEducation"
                                            >
                                                <option value="Phong hành chính">Phong hành chính</option>
                                                <option value="Phong nhan su">Phong nhan su</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Áp dụng cho chức vụ:</label>
                                            <select
                                                name="positionEducation"
                                                className="form-control select2"
                                                multiple="multiple"
                                                value={data.positionEducation}
                                                onChange={this.handleChange}
                                                style={{ width: '100%' }}
                                                ref="positionEducation"
                                            >
                                                <option value="Phó phòng">Phó phòng</option>
                                                <option value="pho phong">pho phong</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {/* /.box-body */}
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" title="Lưu lại các thay đổi" className="btn btn-success pull-right" onClick={this.handleSubmit}>Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                    <ToastContainer/>
                </div >
            </div>
        );
    }
};
function mapState(state) {
    const { course } = state;
    return { course };
};

const actionCreators = {
    updateCourse: CourseActions.updateCourse,
};

const connectedEditCourse = connect(mapState, actionCreators)(ModalEditCourse);
export { connectedEditCourse as ModalEditCourse };
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CourseActions } from '../redux/actions';

class ModalDeleteCourse extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        this.props.deleteCourse(this.props.data.numberEducation);
        window.$(`#modal-deleteCourse-${this.props.data.numberEducation}`).modal("hide");
    }
    render() {
        var { data } = this.props;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-deleteCourse-${data.numberEducation}`} className="delete" title="Xoá chương trình đào tạo" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal modal-full fade" id={`modal-deleteCourse-${data.numberEducation}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Xoá chương trình đào tạo: {data.nameEducation +"-"+data.numberEducation}</h4>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xoá chương trình đào tạo</p>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 25 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" title="Xoá khoá học" className="btn btn-success pull-right" onClick={this.handleSubmit}>Xoá</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { course } = state;
    return { course };
};

const actionCreators = {
    deleteCourse: CourseActions.deleteCourse,
};

const connectedDeleteCourse = connect(mapState, actionCreators)(ModalDeleteCourse);
export { connectedDeleteCourse as ModalDeleteCourse };
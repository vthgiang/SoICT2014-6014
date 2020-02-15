import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SabbaticalActions } from '../redux/actions';
class ModalDeleteSabbatical extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        this.props.deleteSabbatical(this.props.data._id);
        window.$(`#modal-deleteSabbatical-${this.props.data._id}`).modal("hide");
    }
    render() {
        var { data } = this.props;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-deleteSabbatical-${data._id}`} className="delete" title="Xoá bảng lương" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal modal-full fade" id={`modal-deleteSabbatical-${data._id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Xoá đơn xin nghỉ:</h4>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xoá đơn xin nghỉ</p>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 25 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" title="Xoá đơn xin nghỉ" onClick={this.handleSubmit} className="btn btn-success pull-right">Xoá</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { Sabbatical } = state;
    return { Sabbatical };
};

const actionCreators = {
    deleteSabbatical: SabbaticalActions.deleteSabbatical,
};

const connectedDeleteSabbatical = connect(mapState, actionCreators)(ModalDeleteSabbatical);
export { connectedDeleteSabbatical as ModalDeleteSabbatical };
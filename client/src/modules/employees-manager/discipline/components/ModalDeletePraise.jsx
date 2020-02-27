import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DisciplineActions } from '../redux/actions';

class ModalDeletePraise extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        this.props.deletePraise(this.props.data._id);
        window.$(`#modal-deletePraise-${this.props.data._id}`).modal("hide");
    }
    render() {
        var { data } = this.props;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-deletePraise-${data._id}`} className="delete" title="Xoá thông tin kỷ luật" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal modal-full fade" id={`modal-deletePraise-${data._id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Xoá thông tin khen thưởng: {data.employee.fullName + " - Số ra quyết định: " + data.number}</h4>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xoá thông tin khen thưởng</p>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 25 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" title="Xoá thông tin khen thưởng" onClick={this.handleSubmit} className="btn btn-success pull-right">Xoá</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { discipline } = state;
    return { discipline };
};

const actionCreators = {
    deletePraise: DisciplineActions.deletePraise,
};

const connectedDeleteDiscipline = connect(mapState, actionCreators)(ModalDeletePraise);
export { connectedDeleteDiscipline as ModalDeletePraise };
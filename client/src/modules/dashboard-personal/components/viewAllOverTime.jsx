import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../common-components';

class ViewAllOverTime extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { title, dataView, id, showCheck = false, hideEmployee = false } = this.props;
        console.log(dataView);
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-view-${id}`} isLoading={false}
                    formID={`form-view-${id}`}
                    title={title}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form className="form-group" id={`form-view-${id}`}>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Tổng số giờ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataView.length !== 0 &&
                                    dataView.map((x, index) => (
                                        <tr key={index} style={{ color: (x._id === localStorage.getItem('userId') && showCheck) ? "#28A745" : "none" }}>
                                            <td>{index + 1}</td>
                                            <td>{hideEmployee ? `Nhân viên ${index + 1}` : x.name}</td>
                                            <td>{x.totalHours}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const viewAllOverTime = connect(null, null)(withTranslate(ViewAllOverTime));
export { viewAllOverTime as ViewAllOverTime };
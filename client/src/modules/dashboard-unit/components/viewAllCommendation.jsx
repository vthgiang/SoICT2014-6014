import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../common-components';

class ViewAllCommendation extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { dataCommendation, title } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={'modal-view-all-commendation'} isLoading={false}
                    formID={`form-view-all-commendation`}
                    title={title}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form className="form-group" id={`form-view-all-commendation`}>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Lý do khen thưởng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataCommendation && dataCommendation.length !== 0 &&
                                    dataCommendation.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x.employee.fullName}</td>
                                            <td>{x.reason}</td>
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

const viewAllCommendation = connect(null, null)(withTranslate(ViewAllCommendation));
export { viewAllCommendation as ViewAllCommendation };
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../common-components';

class ViewAllDiscipline extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { dataDiscipline, title } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={'modal-view-all-discipline'} isLoading={false}
                    formID={`form-view-all-discipline`}
                    title={title}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form className="form-group" id={`form-view-all-discipline`}>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Lý do kỷ luật</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataDiscipline && dataDiscipline.length !== 0 &&
                                    dataDiscipline.map((x, index) => (
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

const viewAllDiscipline = connect(null, null)(withTranslate(ViewAllDiscipline));
export { viewAllDiscipline as ViewAllDiscipline };
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, PaginateBar } from '../../../common-components';

class ViewAllTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            limit: 10,
        }
    };

    /**
    * Bắt sự kiện chuyển trang
    * @param {*} pageNumber :  Số trang muốn xem
    */
    setPage = async (pageNumber) => {
        await this.setState({
            page: parseInt(pageNumber - 1),
        });
    }

    render() {
        const { title, employeeTasks, showCheck = false } = this.props;
        const { page, limit } = this.state;

        let pageTotal = (employeeTasks.length % limit === 0) ?
            parseInt(employeeTasks.length / limit) :
            parseInt((employeeTasks.length / limit) + 1);
        let currentPage = parseInt(page + 1);
        const listData = employeeTasks.slice(page * limit, page * limit + limit)
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={'modal-view-all-task'} isLoading={false}
                    formID={`form-view-all-task`}
                    title={title}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form className="form-group" id={`form-view-all-task`}>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Số công việc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listData.length !== 0 &&
                                    listData.map((x, index) => (
                                        <tr key={index} style={{ color: (x._id === localStorage.getItem('userId') && showCheck) ? "#28A745" : "none" }}>
                                            <td>{page * limit + index + 1}</td>
                                            <td>{x.name}</td>
                                            <td>{x.totalTask}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const viewAllTasks = connect(null, null)(withTranslate(ViewAllTasks));
export { viewAllTasks as ViewAllTasks };
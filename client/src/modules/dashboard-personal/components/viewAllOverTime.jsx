import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, PaginateBar } from '../../../common-components';

class ViewAllOverTime extends Component {
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
        const { title, dataView, id, showCheck = false, hideEmployee = false } = this.props;

        const { page, limit } = this.state;

        let pageTotal = (dataView.length % limit === 0) ?
            parseInt(dataView.length / limit) :
            parseInt((dataView.length / limit) + 1);
        let currentPage = parseInt(page + 1);
        const listData = dataView.slice(page * limit, page * limit + limit)

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
                                {listData.length !== 0 &&
                                    listData.map((x, index) => (
                                        <tr key={index} style={{ color: (x._id === localStorage.getItem('userId') && showCheck) ? "#28A745" : "none" }}>
                                            <td>{page * limit + index + 1}</td>
                                            <td>{hideEmployee ? `Nhân viên ${index + 1}` : x.name}</td>
                                            <td>{x.totalHours}</td>
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

const viewAllOverTime = connect(null, null)(withTranslate(ViewAllOverTime));
export { viewAllOverTime as ViewAllOverTime };
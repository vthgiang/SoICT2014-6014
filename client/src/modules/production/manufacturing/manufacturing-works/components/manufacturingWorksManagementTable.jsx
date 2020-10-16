import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { worksActions } from '../redux/actions';
import { DataTableSetting, DeleteNotification } from "../../../../../common-components";
import ManufacturingWorksCreateForm from './manufacturingWorksCreateForm';
class ManufacturingWorksManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5
        }
    }

    componentDidMount = () => {
        const { page, limit } = this.state;
        this.props.getAllManufacturingWorks({ page, limit });
    }

    render() {
        const { translate } = this.props;
        const { manufacturingWorks } = this.props;
        let listWorks = [];
        if (manufacturingWorks.isLoading === false) {
            listWorks = manufacturingWorks.listWorks;
        }
        console.log(listWorks);
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <ManufacturingWorksCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.manufacturing_works.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="NMSX201015153823" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.manufacturing_works.name')}</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleChangeData} placeholder="Nhà máy sản xuất thuốc Việt Anh I" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manufacturing.manufacturing_works.search')} onClick={this.handleSubmitSearch}>{translate('manufacturing.manufacturing_works.search')}</button>
                        </div>
                    </div>
                    <table id="manufacturing-works-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('manufacturing.manufacturing_works.index')}</th>
                                <th>{translate('manufacturing.manufacturing_works.code')}</th>
                                <th>{translate('manufacturing.manufacturing_works.name')}</th>
                                <th>{translate('manufacturing.manufacturing_works.worksManager')}</th>
                                <th>{translate('manufacturing.manufacturing_works.foreman')}</th>
                                <th>{translate('manufacturing.manufacturing_works.mills')}</th>
                                <th>{translate('manufacturing.manufacturing_works.phone')}</th>
                                <th>{translate('manufacturing.manufacturing_works.address')}</th>
                                <th>{translate('manufacturing.manufacturing_works.status')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="manufacturing-works-table"
                                        columnArr={[
                                            translate('manufacturing.manufacturing_works.index'),
                                            translate('manufacturing.manufacturing_works.code'),
                                            translate('manufacturing.manufacturing_works.name'),
                                            translate('manufacturing.manufacturing_works.worksManager'),
                                            translate('manufacturing.manufacturing_works.foreman'),
                                            translate('manufacturing.manufacturing_works.mills'),
                                            translate('manufacturing.manufacturing_works.phone'),
                                            translate('manufacturing.manufacturing_works.address'),
                                            translate('manufacturing.manufacturing_works.status')
                                        ]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listWorks && listWorks.length !== 0) &&
                                listWorks.map((work, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{work.code}</td>
                                        <td>{work.name}</td>
                                        <td>{work.worksManager.name}</td>
                                        <td>{work.foreman.name}</td>
                                        <td>{work.manufacturingMills.length > 0 && work.manufacturingMills.map((mill, index) => {
                                            if (work.manufacturingMills.length !== index + 1)
                                                return `${index + 1}. ${mill.name}\n`
                                            return `${index + 1}. ${mill.name}`
                                        })}</td>
                                        <td>{work.phoneNumber}</td>
                                        <td>{work.address}</td>
                                        <td>{work.status ? "Đang hoạt động" : "Dừng hoạt động"}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title="Sửa nhà máy"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa nhà máy"
                                                data={{
                                                    id: work._id,
                                                    info: work.code + " - " + work.name
                                                }}
                                                func={this.props.deleteWork}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {
    const manufacturingWorks = state.manufacturingWorks;
    return { manufacturingWorks }
}

const mapDispatchToProps = {
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingWorksManagementTable));
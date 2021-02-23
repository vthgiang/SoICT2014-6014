import React, { Component } from 'react';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DataTableSetting, PaginateBar } from "../../../../../common-components";
import { connect } from 'react-redux';
import { millActions } from '../redux/actions';
import ManufacturingMillCreateForm from './manafacturingMillCreateForm';
import { worksActions } from '../../manufacturing-works/redux/actions';
import ManufacturingMillEditForm from './manufacturingMillEditForm'
import ManufacturingMillDetailForm from './manufacturingMillDetailForm';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
class ManufacturingMillMangementTable extends Component {
    constructor(props) {
        const tableId = "manufacturing-mill-table";
        const defaultConfig = { limit: 5 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        super(props);
        this.state = {
            page: 1,
            limit: limit,
            code: '',
            name: '',
            tableId
        }
    }

    componentDidMount() {
        const { page, limit } = this.state;
        this.props.getAllManufacturingMills({ page, limit });
        this.props.getAllManufacturingWorks({ status: 1 });
    }

    handleCodeChange = (e) => {
        const { value } = e.target;
        this.setState({
            code: value
        })
    }

    handleNameChange = (e) => {
        const { value } = e.target;
        this.setState({
            name: value
        })
    }

    handleSubmitSearch = async () => {
        await this.setState({
            page: 1
        });
        const { name, code, page, limit } = this.state;
        const data = {
            name: name,
            code: code,
            page: page,
            limit: limit
        }
        this.props.getAllManufacturingMills(data);
    }

    setPage = async (page) => {
        await this.setState({
            page: page
        });
        const data = {
            page: page,
            limit: this.state.limit
        }
        this.props.getAllManufacturingMills(data)
    }

    setLimit = async (limit) => {
        await this.setState({
            limit: limit
        });
        const data = {
            limit: limit,
            page: this.state.page
        }
        this.props.getAllManufacturingMills(data);
    }

    // Tìm trong trong listWorks object có _id = _id truyền vào 
    findIndex = (array, value) => {
        let result = -1;
        array.map((item, index) => {
            if (item._id === value) {
                result = index
            }
        })
        return result;
    }

    handleEditMill = async (mill) => {
        const { manufacturingWorks } = this.props;
        const { listWorks } = manufacturingWorks;
        let result = this.findIndex(listWorks, mill.manufacturingWorks._id);
        let currentOrganizationalUnit;
        if (result != -1) {
            currentOrganizationalUnit = listWorks[result].organizationalUnit._id;
        }

        await this.setState((state) => ({
            ...state,
            currentRow: mill,
            currentOrganizationalUnit: currentOrganizationalUnit
        }));
        window.$('#modal-edit-mill').modal('show');
    }

    handleShowDetailMill = async (mill) => {
        await this.setState((state) => ({
            ...state,
            millDetail: mill
        }));
        window.$('#modal-detail-info-mill').modal('show');
    }

    render() {
        const { translate } = this.props;
        const { manufacturingMill } = this.props;
        const { tableId } = this.state;
        const { page, totalPages } = manufacturingMill;
        let listMills = [];
        if (manufacturingMill.listMills) {
            listMills = manufacturingMill.listMills
        }
        return (
            <React.Fragment>
                {
                    <ManufacturingMillDetailForm millDetail={this.state.millDetail} />
                }
                {
                    this.state.currentRow &&
                    <ManufacturingMillEditForm
                        millId={this.state.currentRow._id}
                        code={this.state.currentRow.code}
                        name={this.state.currentRow.name}
                        worksValue={this.state.currentRow.manufacturingWorks._id}
                        description={this.state.currentRow.description}
                        status={this.state.currentRow.status}
                        teamLeaderValue={this.state.currentRow.teamLeader._id}
                        currentOrganizationalUnit={this.state.currentOrganizationalUnit}
                    />
                }
                <div className="box-body qlcv">
                    <ManufacturingMillCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.manufacturing_mill.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder="XSX200815153823" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.manufacturing_mill.name')}</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleNameChange} placeholder="Xưởng thuốc bột" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manufacturing.manufacturing_mill.search')} onClick={this.handleSubmitSearch}>{translate('manufacturing.manufacturing_mill.search')}</button>
                        </div>
                    </div>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('manufacturing.manufacturing_mill.index')}</th>
                                <th>{translate('manufacturing.manufacturing_mill.code')}</th>
                                <th>{translate('manufacturing.manufacturing_mill.name')}</th>
                                <th>{translate('manufacturing.manufacturing_mill.team_leader')}</th>
                                <th>{translate('manufacturing.manufacturing_mill.worksName')}</th>
                                <th>{translate('manufacturing.manufacturing_mill.description')}</th>
                                <th>{translate('manufacturing.manufacturing_mill.status')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('manufacturing.manufacturing_mill.index'),
                                            translate('manufacturing.manufacturing_mill.code'),
                                            translate('manufacturing.manufacturing_mill.name'),
                                            translate('manufacturing.manufacturing_mill.team_leader'),
                                            translate('manufacturing.manufacturing_mill.worksName'),
                                            translate('manufacturing.manufacturing_mill.description'),
                                            translate('manufacturing.manufacturing_mill.status'),
                                        ]}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listMills && listMills.length !== 0) &&
                                listMills.map((mill, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{mill.code}</td>
                                        <td>{mill.name}</td>
                                        <td>{mill.teamLeader.name}</td>
                                        <td>{mill.manufacturingWorks.name}</td>
                                        <td>{mill.description}</td>
                                        {
                                            mill.status
                                                ?
                                                <td style={{ color: "green" }}>{translate('manufacturing.manufacturing_mill.1')}</td>
                                                :
                                                <td style={{ color: "orange" }}>{translate('manufacturing.manufacturing_mill.0')}</td>

                                        }
                                        <td style={{ textAlign: "center" }}>
                                            <a style={{ width: '5px' }} title={translate('manufacturing.manufacturing_mill.mill_detail')} onClick={() => { this.handleShowDetailMill(mill) }}><i className="material-icons">view_list</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manufacturing.manufacturing_mill.mill_edit')} onClick={() => { this.handleEditMill(mill) }}><i className="material-icons">edit</i></a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {manufacturingMill.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listMills === 'undefined' || listMills.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingMill, manufacturingWorks } = state
    return { manufacturingMill, manufacturingWorks }
}

const mapDispatchToProps = {
    getAllManufacturingMills: millActions.getAllManufacturingMills,
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingMillMangementTable));
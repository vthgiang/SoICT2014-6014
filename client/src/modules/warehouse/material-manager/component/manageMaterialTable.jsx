import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { materialManagerActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import MaterialCreateForm  from './materialCreateForm';
import MaterialEditForm from './materialEditForm';

import { PaginateBar, DataTableSetting, SearchBar, DeleteNotification, ToolTip } from '../../../../common-components';

class ManageMaterialTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            materialName: "",
            description: "",
            cost: "",
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.getMaterial(this.state);
        this.props.getUser();
    }

    handleEdit = async (materials) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: materials
            }
        });
        window.$('#modal-edit-material').modal('show');
    }

    handleSubmitSearch = async () => {
        this.props.getMaterial(this.state);
    }

    handleMaterialCodeChange = async (e) => {
        const {name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    handleMaterialNameChange = async (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number)
        });
        this.props.getMaterial(this.state)
    }

    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page)
        });
        this.props.getMaterial(this.state)
    }

    render() {
        var { materials, translate } = this.props;
        var lists = "";
        if (this.props.materials.isLoading === false) {
            lists = this.props.materials.listMaterials;
        }

        var pageTotal = ((materials.totalList % this.state.limit) === 0) ?
            parseInt(materials.totalList / this.state.limit) :
            parseInt((materials.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        console.log(materials.isLoading)
        
        return (
            <React.Fragment>
                {
                    this.state.currentRow &&
                    <MaterialEditForm
                        materialId={this.state.currentRow._id}
                        code={this.state.currentRow.code}
                        materialName={this.state.currentRow.materialName}
                        cost={this.state.currentRow.cost}
                        description={this.state.currentRow.description}
                        serial={this.state.currentRow.serial}
                    />
                }
                <div className="box-body qlcv">
                <MaterialCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.material_manager.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleMaterialCodeChange} placeholder={translate('manage_warehouse.material_manager.code')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.material_manager.name')}</label>
                            <input type="text" className="form-control" name="materialName" onChange={this.handleMaterialNameChange} placeholder={translate('manage_warehouse.material_manager.name')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={this.handleSubmitSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="material-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('manage_warehouse.material_manager.index')}</th>
                                <th>{translate('manage_warehouse.material_manager.code')}</th>
                                <th>{translate('manage_warehouse.material_manager.name')}</th>
                                <th>{translate('manage_warehouse.material_manager.cost')}</th>
                                <th>{translate('manage_warehouse.material_manager.description')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                        tableId="material-table"
                                        columnArr={[
                                            translate('manage_warehouse.material_manager.index'),
                                            translate('manage_warehouse.material_manager.code'),
                                            translate('manage_warehouse.material_manager.name'),
                                            translate('manage_warehouse.material_manager.cost'),
                                            translate('manage_warehouse.material_manager.description')
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof lists !== 'undefined' && lists.length !== 0) &&
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td>{(index + 1) + ((page - 1) * this.state.limit)}</td>
                                        <td>{x.code}</td>
                                        <td>{x.materialName}</td>
                                        <td>{String(x.cost).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</td>
                                        <td>{x.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title= {translate('manage_warehouse.material_manager.edit')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('manage_warehouse.material_manager.delete')}
                                                data={{
                                                    id: x._id,
                                                    info: x.code + " - " + x.materialName
                                                }}
                                                func={this.props.deleteMaterial}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {materials.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
            </React.Fragment>
            
        );
    }
};

function mapStateToProps(state) {
    const { materials } = state;
    return { materials };
}

const mapDispatchToProps = {
    getMaterial: materialManagerActions.getAll,
    deleteMaterial: materialManagerActions.deleteMaterial,
    getUser: UserActions.get,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManageMaterialTable));

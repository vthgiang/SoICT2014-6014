import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmGroupActions } from '../redux/actions';
import { SearchBar, PaginateBar, DataTableSetting, ConfirmNotification } from '../../../../common-components';
import CreateForm from './createForm';
class CrmGroup extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 10,
            page: 1,
            option: 'name',
            value: ''
         }
    }

    render() { 
        const {crm, translate} = this.props;
        const {group, option} = this.state;

        return ( 
            <div className="box">
                <div className="box-body">
                    <CreateForm/>
                    {/* { group !== undefined && <EditForm group={group} /> } */}

                    <SearchBar
                        columns={[
                            { title: translate('crm.group.name'), value: 'name' },
                            { title: translate('crm.group.code'), value: 'code' },
                            { title: translate('crm.group.description'), value: 'description' },
                        ]}
                        option={option}
                        setOption={this.setOption}
                        search={this.searchWithOption}
                    />
                    <table className="table table-hover table-striped table-bordered" id="table-manage-crm-group">
                        <thead>
                            <tr>
                                <th>{translate('crm.group.name')}</th>
                                <th>{translate('crm.group.code')}</th>
                                <th>{translate('crm.group.description')}</th>
                                <th style={{ width: "120px" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        columnArr={[
                                            translate('crm.group.name'),
                                            translate('crm.group.code'),
                                            translate('crm.group.descripiton'),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        tableId="table-manage-crm-group"
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                crm.group.listPaginate.length > 0 ? 
                                crm.group.listPaginate.map(gr =>
                                        <tr key={gr._id}>
                                            <td>{gr.name}</td>
                                            <td>{gr.code}</td>
                                            <td>{gr.description}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a className="text-green" onClick={() => this.handleInfo(gr)}><i className="material-icons">visibility</i></a>
                                                <a className="text-yellow" onClick={() => this.handleEdit(gr)}><i className="material-icons">edit</i></a>
                                                <ConfirmNotification
                                                    icon="question"
                                                    title="Xóa thông tin về khách hàng"
                                                    content="<h3>Xóa thông tin khách hàng</h3>"
                                                    name="delete"
                                                    className="text-red"
                                                    func={()=>this.deleteGroup(gr._id)}
                                                />
                                            </td>
                                        </tr>
                                    ) : crm.group.isLoading ?
                                    <tr><td colSpan={4}>{translate('general.loading')}</td></tr> :
                                    <tr><td colSpan={4}>{translate('general.no_data')}</td></tr>
                            }
                        </tbody>
                    </table>

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={crm.group.totalPages} currentPage={crm.group.page} func={this.setPage} />
                </div>
            </div>
         );
    }

    componentDidMount(){
        this.props.getGroups();
        this.props.getGroups({limit: this.state.limit, page: this.state.page});
    }

    // Cac ham thiet lap va tim kiem gia tri
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async () => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getGroups(data);
    }

    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getGroups(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getGroups(data);
    }

    deleteGroup = async (id) => {
        const {group} = this.props.crm;
        if(group.listPaginate.length === 1 && group.totalPages > 1){
            await this.props.deleteGroup(id);
            const data = {
                limit: this.state.limit,
                page: group.page === group.totalPages ? group.prevPage : this.state.page,
                key: this.state.option,
                value: this.state.value
            };
            await this.props.getGroups(data);
        }else {
            await this.props.deleteGroup(id);
        }
    }
}
 

function mapStateToProps(state) {
    const {crm} = state;
    return {crm};
}

const mapDispatchToProps = {
    getGroups: CrmGroupActions.getGroups,
    deleteGroup: CrmGroupActions.deleteGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmGroup));
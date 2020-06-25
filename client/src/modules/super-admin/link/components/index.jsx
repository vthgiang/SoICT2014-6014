import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LinkActions } from '../redux/actions';
import { ToolTip, SearchBar, DataTableSetting, PaginateBar } from '../../../../common-components';
import LinkInfoForm from './linkInfoForm';

class ManageLink extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'url', //mặc định tìm kiếm theo tên
            value: { $regex: '', $options: 'i' }
        }
    }

    render() { 
        const { translate, link } = this.props;
        const { currentRow } = this.state;

        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <React.Fragment>
                        {
                            currentRow !== undefined &&
                            <LinkInfoForm 
                                linkId={ currentRow._id }
                                linkUrl={ currentRow.url }
                                linkDescription={ currentRow.description }
                                linkRoles={ currentRow.roles.map(role => role.roleId._id) }
                            />
                        }
                        <SearchBar 
                            columns={[
                                { title: translate('manage_link.url'), value:'url' },
                                { title: translate('manage_link.category'), value:'category' },
                                { title: translate('manage_link.description'), value:'description' },
                            ]}
                            option={this.state.option}
                            setOption={this.setOption}
                            search={this.searchWithOption}
                        />
                        
                        <table className="table table-hover table-striped table-bordered" id="table-manage-link">
                            <thead>
                                <tr>
                                    <th>{ translate('manage_link.url') }</th>
                                    <th>{ translate('manage_link.category') }</th>
                                    <th>{ translate('manage_link.description') }</th>
                                    <th>{ translate('manage_link.roles') }</th>
                                    <th style={{width: "120px"}}>
                                        {translate('table.action')}
                                        <DataTableSetting 
                                            columnArr={[
                                                translate('manage_link.url'),
                                                translate('manage_link.category'),
                                                translate('manage_link.description'),
                                                translate('manage_link.roles')
                                            ]}
                                            limit={this.state.limit}
                                            setLimit={this.setLimit}
                                            tableId="table-manage-link"
                                        /> 
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    link.listPaginate.length > 0 ? link.listPaginate.map( link => 
                                        <tr key={link._id}>
                                            <td>{ link.url }</td>
                                            <td>{ link.category }</td>
                                            <td>{ link.description }</td>
                                            <td><ToolTip dataTooltip={link.roles.map(role => role.roleId.name)}/></td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a className="edit" onClick={() => this.handleEdit(link)}><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr> 
                                    ): link.isLoading ?
                                    <tr><td colSpan={4}>{translate('confirm.loading')}</td></tr>:
                                    <tr><td colSpan={4}>{translate('confirm.no_data')}</td></tr>
                                }
                            </tbody>
                        </table>
                        {/* PaginateBar */}
                        <PaginateBar pageTotal={link.totalPages} currentPage={link.page} func={this.setPage}/>
                    </React.Fragment>
                </div>
            </div>
        );
    }
    
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async() => {
        const data = {
            limit: this.state.limit,
            page: 1
        };
        data[this.state.option] = this.state.value;
        await this.props.getPaginate(data);
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber };
        if(this.state.value !== null){
            data[this.state.option] = this.state.value;
        }
        this.props.getPaginate(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = { limit: number, page: this.state.page };
        if(this.state.value !== null){
            data[this.state.option] = this.state.value;
        }
        this.props.getPaginate(data);
    }
     
    componentDidMount(){
        this.props.getLinks();
        this.props.getPaginate({page: this.state.page, limit: this.state.limit});
    }

    // Cac ham xu ly du lieu voi modal
    handleEdit = async (link) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: link
            }
        });

        window.$('#modal-edit-link').modal('show');
    }
}
 
const mapState = state => state;
const getState =  {
    getLinks: LinkActions.get,
    getPaginate: LinkActions.getPaginate,
    destroy: LinkActions.destroy
}
 
export default connect(mapState, getState) (withTranslate(ManageLink));
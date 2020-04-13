import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LinkDefaultActions } from '../redux/actions';
import LinkInfoForm from './LinkInfoForm';
import CreateLinkForm from './CreateLinkForm';
import { SearchBar, ActionColumn, PaginateBar, DeleteNotification, ModalEditButton } from '../../../../common-components';

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

    // Cac ham xu ly du lieu voi modal
    handleEdit = async (link) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: link
            }
        });
        window.$('#modal-edit-link-default').modal('show');
    }

    render() { 
        const { translate, linksDefault } = this.props;
        const {currentRow} = this.state;
        
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <React.Fragment>
                        <CreateLinkForm/>
                        {
                            currentRow !== undefined &&
                            <LinkInfoForm
                                linkId={currentRow._id}
                                linkUrl={currentRow.url}
                                linkCategory={currentRow.category}
                                linkDescription={currentRow.description}
                                linkRoles={currentRow.roles.map(role => role._id)}
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
                        
                        <table className="table table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>{ translate('manage_link.url') }</th>
                                    <th>{ translate('manage_link.category') }</th>
                                    <th>{ translate('manage_link.description') }</th>
                                    <th>{ translate('manage_link.roles') }</th>
                                    <th style={{width: "120px"}}>
                                        { translate('table.action') }
                                        <ActionColumn 
                                            columnName={translate('table.action')} 
                                            columnArr={[
                                                translate('manage_link.url'),
                                                translate('manage_link.category'),
                                                translate('manage_link.description'),
                                                translate('manage_link.roles')
                                            ]}
                                            setLimit={this.setLimit}
                                        /> 
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    linksDefault.listPaginate.length > 0 ? linksDefault.listPaginate.map( link => 
                                        <tr key={link._id}>
                                            <td>{ link.url }</td>
                                            <td>{ link.category }</td>
                                            <td>{ link.description }</td>
                                            <td>{ link.roles.map((role, index, arr) => {
                                                if(index !== arr.length - 1)
                                                    return <span key={role._id}>{role.name}, </span>
                                                else
                                                    return <span key={role._id}>{role.name}</span>
                                            }) }</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a onClick={() => this.handleEdit(link)} className="edit" title={translate('manage_link.edit')}><i className="material-icons">edit</i></a>
                                                <DeleteNotification 
                                                    content={translate('manage_link.delete')}
                                                    data={{
                                                        id: link._id,
                                                        info: link.url
                                                    }}
                                                    func={this.props.destroy}
                                                />
                                            </td>
                                        </tr> 
                                    ): linksDefault.isLoading ?
                                    <tr><td colSpan={5}>{translate('confirm.loading')}</td></tr>:
                                    <tr><td colSpan={5}>{translate('confirm.no_data')}</td></tr>
                                }
                            </tbody>
                        </table>
                        {/* PaginateBar */}
                        <PaginateBar pageTotal={linksDefault.totalPages} currentPage={linksDefault.page} func={this.setPage}/>
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
        this.props.getCategories();
        this.props.getPaginate({page: this.state.page, limit: this.state.limit});
    }
}
 
const mapState = state => state;
const getState =  {
    getLinks: LinkDefaultActions.get,
    getCategories: LinkDefaultActions.getCategories,
    getPaginate: LinkDefaultActions.getPaginate,
    destroy: LinkDefaultActions.destroy
}
 
export default connect(mapState, getState) (withTranslate(ManageLink));
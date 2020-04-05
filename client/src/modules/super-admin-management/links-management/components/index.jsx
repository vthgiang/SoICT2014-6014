import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LinkActions } from '../redux/actions';
import { DeleteNotification } from '../../../../common-components';
import LinkInfoForm from './LinkInfoForm';
import { SearchBar } from '../../../../common-components';
import { ActionColumn } from '../../../../common-components';
import { PaginateBar } from '../../../../common-components';

class ManageLink extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'url', //mặc định tìm kiếm theo tên
            value: null,
            url: null,
            description: null,
            role: null
        }
        this.setPage = this.setPage.bind(this);
        this.setOption = this.setOption.bind(this);
        this.searchWithOption = this.searchWithOption.bind(this);
        this.setLimit = this.setLimit.bind(this);
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

    render() { 
        const { translate, link } = this.props;

        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <React.Fragment>
                        <SearchBar 
                            columns={[
                                { title: translate('manage_link.url'), value:'url' },
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
                                    <th>{ translate('manage_link.description') }</th>
                                    <th>{ translate('manage_link.roles') }</th>
                                    <th style={{width: "120px"}}>
                                        <ActionColumn 
                                            columnName={translate('table.action')}
                                            columnArr={[
                                                translate('manage_link.url'),
                                                translate('manage_link.description'),
                                                translate('manage_link.roles')
                                            ]}
                                            limit={this.state.limit}
                                            setLimit={this.setLimit}
                                        /> 
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    link.listPaginate.length > 0 ? link.listPaginate.map( link => 
                                        <tr key={link._id}>
                                            <td>{ link.url }</td>
                                            <td>{ link.description }</td>
                                            <td>{
                                                link.roles.map((role, index, arr) => {
                                                    if(arr.length < 4){
                                                        if(index !== arr.length - 1) return `${role.roleId.name}, `;
                                                        else return `${role.roleId.name}`
                                                    }else{
                                                        if(index < 3 ){
                                                            return `${role.roleId.name}, `
                                                        }
                                                    }
                                                })
                                            }{
                                                link.roles.length >=4 &&
                                                
                                                <React.Fragment>
                                                    <div className="tooltip2">...
                                                        <span className="tooltip2text">
                                                            {
                                                                link.roles.map((role, index, arr) => {
                                                                    if(index !== arr.length - 1) return `${role.roleId.name}, `;
                                                                    else return `${role.roleId.name}`
                                                                })
                                                            }
                                                        </span>
                                                    </div>
                                                </React.Fragment>
                                            }
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <LinkInfoForm 
                                                    linkId={ link._id }
                                                    linkName={ link.url }
                                                    linkDescription={ link.description }
                                                    linkRoles={ link.roles.map(role => role.roleId._id) }
                                                />
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
}
 
const mapState = state => state;
const getState =  {
    getLinks: LinkActions.get,
    getPaginate: LinkActions.getPaginate,
    destroy: LinkActions.destroy
}
 
export default connect(mapState, getState) (withTranslate(ManageLink));
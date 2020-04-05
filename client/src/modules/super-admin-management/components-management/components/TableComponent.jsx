import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ComponentActions } from '../redux/actions';
import ComponentInfoForm from './ComponentInfoForm';
import { PaginateBar, ActionColumn, SearchBar } from '../../../../common-components';
import { LinkActions } from '../../../super-admin-management/links-management/redux/actions';
import { RoleActions } from '../../../super-admin-management/roles-management/redux/actions';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'name', //mặc định tìm kiếm theo tên
            value: null
        }
        this.setPage = this.setPage.bind(this);
        this.setOption = this.setOption.bind(this);
        this.searchWithOption = this.searchWithOption.bind(this);
        this.setLimit = this.setLimit.bind(this);
    }

    componentDidMount(){
        this.props.getLinks();
        this.props.getComponents();
        this.props.getPaginate({page: this.state.page, limit: this.state.limit});
        this.props.getRoles();
        // let script = document.createElement('script');
        // script.src = 'lib/main/js/CoCauToChuc.js';
        // script.async = true;
        // script.defer = true;
        // document.body.appendChild(script);
    }

    render() { 
        const { component, translate } = this.props;
        return ( 
            <React.Fragment>
                <SearchBar 
                    columns={[
                        { title: translate('table.name'), value:'name' },
                        { title: translate('table.description'), value:'description' },
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                
                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>{ translate('table.name') }</th>
                            <th>{ translate('table.description') }</th>
                            <th style={{width: "120px"}}>
                                <ActionColumn 
                                    columnName={translate('table.action')} 
                                    hideColumn={false}
                                    setLimit={this.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            component.listPaginate.length > 0 ?
                            component.listPaginate.map( component => 
                                <tr key={component._id}>
                                    <td>{ component.name }</td>
                                    <td>{ component.description }</td>
                                    <td style={{ textAlign: 'center'}}>
                                        <ComponentInfoForm 
                                            componentId={ component._id }
                                            componentName={ component.name }
                                            componentDescription={ component.description }
                                            componentRoles={ component.roles.map(role => role.roleId) }
                                        />
                                    </td>
                                </tr>
                            ): component.isLoading ?
                            <tr><td colSpan={"3"}>{translate('confirm.loading')}</td></tr>:
                            <tr><td colSpan={"3"}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>
                {/* PaginateBar */}
                <PaginateBar pageTotal={component.totalPages} currentPage={component.page} func={this.setPage}/>
            </React.Fragment>
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
}
 
const mapState = state => state;
const getState = {
    getComponents: ComponentActions.get,
    destroy: ComponentActions.destroy,
    getPaginate: ComponentActions.getPaginate,
    getLinks: LinkActions.get,
    getRoles: RoleActions.get
}
 
export default connect(mapState, getState) (withTranslate(TableComponent));
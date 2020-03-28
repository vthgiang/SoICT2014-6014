import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ComponentDefaultActions } from '../redux/actions';
import ComponentInfoForm from './ComponentInfoForm';
import { PaginateBar, ActionColumn, DeleteNotification, SearchBar } from '../../../../common-components';
import ComponentCreateForm from './ComponentCreateForm';
import { LinkDefaultActions } from '../../links-default-management/redux/actions';

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
        this.props.get();
        this.props.getPaginate({page: this.state.page, limit: this.state.limit})
    }

    render() { 
        const { componentsDefault, translate } = this.props;
        return ( 
            <React.Fragment>
                <div className="row">
                    <SearchBar 
                        columns={[
                            { title: translate('table.name'), value:'name' },
                            { title: translate('table.description'), value:'description' },
                        ]}
                        option={this.state.option}
                        setOption={this.setOption}
                        search={this.searchWithOption}
                    />
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <ComponentCreateForm />
                    </div>
                </div>
                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>{ translate('manage_component.name') }</th>
                            <th>{ translate('manage_component.description') }</th>
                            <th>{ translate('manage_component.link') }</th>
                            <th>{ translate('manage_component.roles') }</th>
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
                            componentsDefault.listPaginate.length > 0 ?
                            componentsDefault.listPaginate.map( component => 
                                <tr key={component._id}>
                                    <td>{ component.name }</td>
                                    <td>{ component.description }</td>
                                    <td>{component.link.url}</td>
                                    <td>{ component.roles.map((role, i, arr) => {
                                        if(i !== arr.length - 1)
                                            return <span>{role.name}, </span>
                                        else
                                            return <span>{role.name}</span> 
                                    }) }</td>
                                    <td style={{ textAlign: 'center'}}>
                                        <ComponentInfoForm 
                                            componentId={ component._id }
                                            componentName={ component.name }
                                            componentDescription={ component.description }
                                            componentLink={ component.link._id }
                                            componentRoles={ component.roles.map(role => role._id) }
                                        />
                                        <DeleteNotification 
                                            content={{
                                                title: translate('manage_component.delete'),
                                                btnNo: translate('confirm.no'),
                                                btnYes: translate('confirm.yes'),
                                            }}
                                            data={{
                                                id: component._id,
                                                info: component.name
                                            }}
                                            func={this.props.destroy}
                                        />
                                    </td>
                                </tr>
                            ):<tr><td colSpan={"3"}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>
                {/* PaginateBar */}
                <PaginateBar pageTotal={componentsDefault.totalPages} currentPage={componentsDefault.page} func={this.setPage}/>
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
    get: ComponentDefaultActions.get,
    destroy: ComponentDefaultActions.destroy,
    getPaginate: ComponentDefaultActions.getPaginate,
    getLinks: LinkDefaultActions.get,
}
 
export default connect(mapState, getState) (withTranslate(TableComponent));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RoleActions} from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../manage-user/redux/actions';
import RoleInfoForm from './RoleInfoForm';
import { SearchBar, DeleteNotification, PaginateBar, ActionColumn } from '../../../../common-components';
import RoleCreateForm from './RoleCreateForm';

class RoleTable extends Component {
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

    render() { 
        const { role, translate } = this.props;
        console.log()
        return ( 
            <React.Fragment>
                <div className="row">
                    <SearchBar 
                        columns={[
                            { title: translate('table.name'), value:'name' }
                        ]}
                        option={this.state.option}
                        setOption={this.setOption}
                        search={this.searchWithOption}
                    />
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <RoleCreateForm />
                    </div>
                </div>
                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>{ translate('manage_role.name') }</th>
                            <th>{ translate('manage_role.extends') }</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                <ActionColumn 
                                    columnName={translate('table.action')} 
                                    columnArr={[
                                        translate('table.name')
                                    ]}
                                    setLimit={this.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            role.listPaginate.length > 0 ? 
                            role.listPaginate.map( role => 
                                <tr key={ `roleList${role._id}` }>
                                    <td> { role.name } </td>
                                    <td> { 
                                        role.parents.map((parent, index, arr) => {
                                            if(arr.length < 4){
                                                if(index !== arr.length - 1) return `${parent.name}, `;
                                                else return `${parent.name}`
                                            }else{
                                                if(index < 3 ){
                                                    return `${parent.name}, `
                                                }
                                            }
                                        })
                                    }{
                                        role.parents.length >=4 &&
                                        <React.Fragment>
                                            <div className="tooltip2">...
                                                <span className="tooltip2text">
                                                    {
                                                        role.parents.map((parent, index, arr) => {
                                                            if(index !== arr.length - 1) return `${parent.name}, `;
                                                            else return `${parent.name}`
                                                        })
                                                    }
                                                </span>
                                            </div>
                                        </React.Fragment>
                                    } </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <RoleInfoForm 
                                            roleType={role.type.name}
                                            roleId={role._id}
                                            roleName={role.name}
                                            roleParents={role.parents.map(parent => parent._id)}
                                            roleUsers={role.users.map(user=>user.userId._id)}
                                        />
                                        {
                                            role.type.name === 'tutao' && 
                                            <DeleteNotification 
                                                content={{
                                                    title: translate('manage_role.delete'),
                                                    btnNo: translate('confirm.no'),
                                                    btnYes: translate('confirm.yes'),
                                                }}
                                                data={{
                                                    id: role._id,
                                                    info: role.name
                                                }}
                                                func={this.props.destroy}
                                            />
                                        }
                                    </td>
                                </tr>       
                            ): <tr><td colSpan={'2'}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>
                {/* PaginateBar */}
                <PaginateBar pageTotal={role.totalPages} currentPage={role.page} func={this.setPage}/>
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

    componentDidMount(){
        this.props.getPaginate({page: this.state.page, limit: this.state.limit});
        this.props.get();
        this.props.getUser();
    }

    deleteRole = (roleId) => {
        this.props.destroy(roleId);
    }

}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    get: RoleActions.get,
    getPaginate: RoleActions.getPaginate,
    getUser: UserActions.get,
    destroy: RoleActions.destroy
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleTable) );
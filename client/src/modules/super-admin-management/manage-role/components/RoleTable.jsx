import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get, getPaginate, destroy } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { get as getUser } from '../../manage-user/redux/actions';
import RoleInfoForm from './RoleInfoForm';
import './css/Pagination.css';
import SearchBar from '../../../../common-components/SearchBar';
import RoleCreateForm from './RoleCreateForm';
import DeleteNotification from '../../../../common-components/DeleteNotification';
import PaginateBar from '../../../../common-components/PaginateBar';
import ActionColumn from '../../../../common-components/ActionColumn';

class RoleTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: '5',
            page: '1'
        }
        this.inputChange = this.inputChange.bind(this);
        this.setPage = this.setPage.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber };
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

    render() { 
        const { role, translate } = this.props;
        return ( 
            <React.Fragment>
                <div className="row">
                    <SearchBar 
                        columns={[
                            { title: translate('manageRole.roleName'), value:'name' }
                        ]}
                        func={this.props.getPaginate}
                    />
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <RoleCreateForm />
                    </div>
                </div>
                
                {
                    role.list.length > 0 && 
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{ translate('manageRole.roleName') }</th>
                                <th style={{ width: '120px' }}>
                                    <ActionColumn columnName={translate('table.action')} hideColumn={false}/>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                role.listPaginate !== undefined ? 
                                role.listPaginate.map( role => 
                                    <tr key={ `roleList${role._id}` }>
                                        <td> { role.name } </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <RoleInfoForm 
                                                roleInfo={ role }
                                            />
                                            {
                                                role.type.name !== 'abstract' && 
                                                <DeleteNotification 
                                                content={{
                                                    title: translate('delete'),
                                                    btnNo: translate('question.no'),
                                                    btnYes: translate('delete'),
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
                                ): 
                                (
                                    <tr>
                                        <td colSpan={'3'}>no data</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                }   
                {/* PaginateBar */}
                <PaginateBar pageTotal={role.totalPages} currentPage={role.page} func={this.setPage}/>
                {/* <div className="row">
                    <div className="col-sm-3">
                        <p style={{ marginTop: '25px'}}>{ translate('page') }{ `${role.page}/${role.totalPages}` }</p>
                    </div>
                    <div className="col-sm-6">
                        <div className="center">
                            <div className="pagination">
                                <button className="btn btn-default" disabled={!role.hasPrevPage} onClick={() => this.setPage(role.prevPage)} >&laquo;</button>
                                {
                                    role.hasPrevPage && <button className="btn btn-default" onClick={() => this.setPage(role.prevPage)} >{role.prevPage}</button>
                                }
                                <button className="btn btn-primary">{role.page}</button>
                                {
                                    role.hasNextPage && <button className="btn btn-default" onClick={() => this.setPage(role.nextPage)} >{role.nextPage}</button>
                                }
                                <button className="btn btn-default" disabled={!role.hasNextPage} onClick={() => this.setPage(role.nextPage)} >&raquo;</button>
                            </div>
                        </div>
                    </div>
                </div> */}
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => {
    return{
        get: () => {
            dispatch(get()); 
        },
        getPaginate: (data) => {
            dispatch(getPaginate(data)); 
        },
        getUser: () => {
            dispatch( getUser() );
        },
        destroy: (id) => {
            dispatch( destroy(id))
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleTable) );
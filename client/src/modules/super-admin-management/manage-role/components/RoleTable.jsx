import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get, getPaginate, destroy } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { get as getUser } from '../../manage-user/redux/actions';
import RoleInfoForm from './RoleInfoForm';
import DeleteRoleNotification from './DeleteRoleNotification';
import './css/Pagination.css';

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
        console.log("PAGE: ", this.state);
        return ( 
            <React.Fragment>
                <div className="pagination">
                    <label>{ translate('show') }</label>
                    <select name="limit" className="form-control" onChange={ this.inputChange }>
                        <option key='1' value={5}>5</option>
                        <option key='2' value={10}>10</option>
                        <option key='3' value={15}>15</option>
                        <option key='4' value={20}>20</option>
                    </select>
                </div>
                {
                    role.list.length > 0 && 
                    <table className="table table-bordered table-hover">
                        <thead className="bg bg-gray">
                            <tr>
                                <th>{ translate('manageRole.roleName') }</th>
                                <th style={{ width: '120px' }}>{ translate('table.action') }</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                role.listPaginate !== undefined ? 
                                role.listPaginate.map( role => 
                                    <tr key={ `roleList${role._id}` }>
                                        <td> { role.name } </td>
                                        <td>
                                            <a className="btn btn-sm btn-primary" data-toggle="modal" href={`#role-info-${role._id}`}><i className="fa fa-edit"></i></a>
                                            <RoleInfoForm roleInfo={ role }/>
                                            {
                                                (
                                                    !role.isAbstract && 
                                                    <React.Fragment>
                                                        <a className="btn btn-sm btn-danger" data-toggle="modal" href={`#modal-delete-${role._id}`}><i className="fa fa-trash"></i></a>
                                                        <DeleteRoleNotification roleId={ role._id } roleName={ role.name } deleteRole={ this.deleteRole }/>
                                                    </React.Fragment>
                                                )
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
                <div className="row">
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
                </div>
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
            dispatch( destroy(id) );
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleTable) );
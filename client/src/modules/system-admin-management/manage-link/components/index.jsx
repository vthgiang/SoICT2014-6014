import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get } from '../redux/actions';
import DeleteLinkModal from './DeleteLinkModal';
import LinkInfoForm from './LinkInfoForm';
import CreateLinkForm from './CreateLinkForm';

class ManageLink extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            url: null,
            description: null,
            role: null
        }
        this.inputChange = this.inputChange.bind(this);
        this.deleteLink = this.deleteLink.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    componentDidMount(){
        this.props.getLinks();
    }

    deleteLink = (id) => {
        this.props.destroy(id);
    }

    render() { 
        const { translate, link } = this.props;
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <React.Fragment>
                        <CreateLinkForm/>
                        <table 
                            style={{marginTop: '50px'}}
                            className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>{ translate('table.url') }</th>
                                    <th>{ translate('table.description') }</th>
                                    <th style={{width: "110px"}}>{ translate('table.action') }</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    link.list.map( link => 
                                        <tr key={link._id}>
                                            <td>{ link.url }</td>
                                            <td>{ link.description }</td>
                                            <td>
                                                <a className="btn btn-sm btn-primary" data-toggle="modal" href={ `#modal-link-${link._id}` }><i className="fa fa-edit"></i></a>
                                                <LinkInfoForm 
                                                    linkId={ link._id }
                                                    linkName={ link.url }
                                                    linkDescription={ link.description }
                                                    linkRoles={ link.roles.map(role => role.roleId) }
                                                />
                                                <DeleteLinkModal 
                                                    pageInfo={link}
                                                />
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </React.Fragment>
                </div>
            </div>
        );

    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        getLinks: () => {
            dispatch(get());
        }
    }
}
 
export default connect(mapState, getState) (withTranslate(ManageLink));
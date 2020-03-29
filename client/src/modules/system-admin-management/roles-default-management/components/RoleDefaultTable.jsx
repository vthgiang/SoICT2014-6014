import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RoleDefaultActions} from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { SearchBar, DeleteNotification, PaginateBar, ActionColumn } from '../../../../common-components';

class RoleTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        const { rolesDefault, translate } = this.props;

        return ( 
            <React.Fragment>
                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>{ translate('manage_role.name') }</th>
                            <th>{ translate('manage_role.description') }</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rolesDefault.list.map( role => 
                                <tr key={ `role-default-${role._id}` }>
                                    <td> { role.name } </td>
                                    <td> { role.description } </td>
                                </tr>       
                            )
                        }
                    </tbody>
                </table>
            </React.Fragment>
         );
    }

    componentDidMount(){
        this.props.get();
    }

}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    get: RoleDefaultActions.get
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleTable) );
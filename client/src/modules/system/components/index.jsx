import React, { Component } from 'react';
import { getLogState, toggleLogState } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class System extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.getLogState();
    }

    render() { 
        const { translate } = this.props;
        var type = this.props.system.log ? 'danger' : 'success';
        var toggleButton = this.props.system.log ? translate('manage_system.turn_off') : translate('manage_system.turn_on');
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <p>{ translate('manage_system.log') }</p>
                    <button className={`btn btn-${type}`} onClick={ this.props.toggleLogState }>{ toggleButton }</button>
                </div>
            </div>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => {
    return{
        getLogState: () => {
            dispatch(getLogState());
        },
        toggleLogState: () => {
            dispatch(toggleLogState());
        },
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(System) );
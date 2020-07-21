import React, { Component } from 'react';
import { LogActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class LogSystem extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount(){
        this.props.getLogState();
    }

    render() { 
        const { translate, log } = this.props;

        var type = log.status ? 'danger' : 'success';
        var toggleButton = log.status  ? translate('manage_system.turn_off') : translate('manage_system.turn_on');
        
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <p>{ translate('manage_system.log') }</p>
                    <button className={`btn btn-${type}`} onClick={ this.props.toggleLogState() }>{ toggleButton }</button>
                </div>
            </div>
         );
    }
}
 
function mapState(state) {
    const { log } = state;
    return { log }
}
const actions = {
    getLogState: LogActions.getLogState,
    toggleLogState: LogActions.toggleLogState
}

const connectedLogSystem = connect(mapState, actions)(withTranslate(LogSystem));
export { connectedLogSystem as LogSystem }
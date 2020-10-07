import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class SystemHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            mess: ''
        }
    }

    _handleMess = (e) => {
        this.setState({
            mess: e.target.value
        })
    }

    _handleMessage = (data) => {
        let {messages} = this.state;
        messages = [...messages, data];

        this.setState({
            messages
        })
    }

    _sendMessage = () => {
        this._handleMessage(this.state.mess);
        this.props.socket.io.emit('chat message', this.state.mess);
    }

    componentDidMount(){
        this.props.socket.io.on('chat message', data => {
            this._handleMessage(data);
        })
    }

    render() {
        const {messages} = this.state;
        console.log("Message: ", this.state);

        return (
            <React.Fragment>
                <div className="qlcv">
                    <h4>Message chat</h4>
                    <input className="form-control" type="text" placeholder="Input message ..." onChange={this._handleMess} style={{ marginBottom: '8px' }}/>
                    <button className="btn btn-primary" onClick={this._sendMessage}>Send</button>
                    <ul style={{
                        marginTop: '30px',
                        padding: '30px',
                        backgroundColor: '#fff',
                        minHeight: '200px',
                        border: '0.4px solid dodgerblue'
                    }}>
                        {
                            messages.map((mess, index) => <li key={index}>{mess}</li>)
                        }
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks, socket } = state;
    return { tasks, socket };
}
const actionCreators = {
};
const connectedHome = connect(mapState, actionCreators)(withTranslate(SystemHome));
export { connectedHome as SystemHome };
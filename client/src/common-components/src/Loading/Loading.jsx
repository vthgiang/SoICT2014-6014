import React, { Component } from 'react';
import './loading.css';
import ReactLoading from 'react-loading';

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <div className="modal fade in show-on" id="loading-data">
                    <div className="modal-dialog top-250" style={{textAlign: 'center',width:'20%', marginLeft:'40%'}}>
                         <p className="fa fa-spin fa-refresh" style={{width: '100%', fontSize: '72px', color: 'white'}}></p>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
export { Loading };
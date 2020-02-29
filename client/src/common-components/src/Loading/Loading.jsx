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
                    <div class="modal-dialog top-250" style={{textAlign: 'center',width:'8%', marginLeft:'46%'}}>
                        <ReactLoading type="spin" width="100%"/>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
export { Loading };
import React, { Component } from 'react';
import TableComponent from './TableComponent';

class ManageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    render() { 
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <TableComponent />
                </div>
            </div>
         );
    }
}
 
export default ManageComponent;
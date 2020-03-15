import React, { Component } from 'react';
import TableComponent from './TableComponent';

class ManageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
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

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        let script2 = document.createElement('script');
        script2.src = '/lib/main/js/defindMultiSelect.js';
        script2.async = true;
        script2.defer = true;
        document.body.appendChild(script2);
    }
}
 
export default ManageComponent;
import React, { Component } from 'react';
import './SelectMulti.css';

class SelectMulti extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '../lib/main/js/SelectMulti.js'
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        const { nonSelectedText, allSelectedText, id } = this.props;

        window.$("#" + id).multiselect({
            nonSelectedText: nonSelectedText,
            allSelectedText: allSelectedText
        });
    }
    render() { 
        const { id, items, selectAllByDefault } = this.props;
        console.log(items);
        return ( 
            <React.Fragment>
                <div className="selectmulti">
                    <select className="form-control" style ={{display: "none"}} id={id} multiple="multiple" defaultValue={selectAllByDefault?items.map(item => item.value):[]}>
                        {items.map(item => {
                            return <option value={item.value}>{item.text}</option>
                        })}
                    </select>
                </div>
            </React.Fragment>
         );
    }
}
 
export { SelectMulti };
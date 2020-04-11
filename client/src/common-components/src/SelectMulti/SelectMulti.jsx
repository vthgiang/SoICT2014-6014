import React, { Component } from 'react';
import './SelectMulti.css';
import './bootstrap-multiselect.css';
import { selelectMultiScript } from './bootstrap-multiselect.js'

class SelectMulti extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        if (document.getElementById("script-select-multi") === null) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-select-multi";
            script.innerHTML = selelectMultiScript
            document.body.appendChild(script);
        }

        const { id, options, onChange } = this.props;
        window.$("#" + id).multiselect(options);
        if (onChange !== undefined) {
            window.$("#" + id).on("change", () => {
                let value = [].filter.call(this.refs.selectmulti.options, o => o.selected).map(o => o.value);
                onChange(value)
            })
        }
    }

    componentDidUpdate() {
        // Cập nhật lại danh sách lựa chọn (theo select với id là this.props.id)
        const { id, defaultValue } = this.props;
        window.$("#" + id).multiselect('rebuild');
        window.$("#" + id).multiselect('select', defaultValue);
    }

    render() {
        const { id, items, defaultValue } = this.props;
        return (
            <React.Fragment>
                <div className="selectmulti">
                <select className="form-control" style ={{display: "none"}} ref="selectmulti" id={id} multiple="multiple" defaultValue={defaultValue} onChange={()=>{}}>
                        {items.map(item => {
                            return <option key={item.value} value={item.value}>{item.text}</option>
                        })}
                    </select>
                </div>
            </React.Fragment>
        );
    }
}

export { SelectMulti };
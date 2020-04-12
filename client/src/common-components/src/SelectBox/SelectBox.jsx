import React, { Component } from 'react';
import { select2 } from './select2.full.min.js';
import './select2.css';
import './SelectBox.css';

class SelectBox extends Component {
    constructor(props) {
        super(props);
        this.state = { }

        if (document.getElementById("script-select-box") === null){
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-select-box";
            script.innerHTML = select2
            document.body.appendChild(script);
        }
    }
    

    componentDidMount(){
        const { id, onChange } = this.props;
        window.$("#" + id).select2();

        window.$("#" + id).on("change", () => {
            let value = [].filter.call(this.refs.select.options, o => o.selected).map(o => o.value);
            this.setState(state => {
                return {
                    ...state,
                    value
                }
            });
            if (onChange!==undefined && onChange!==null){
                onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
            }
        });
    }

    getValue = () => { // Nếu không dùng onChange, có thể gọi phương thức này qua đối tượng ref để lấy các giá trị đã chọn
        return this.state.value;
    }

    componentDidUpdate() {
        const { id } = this.props;
        window.$("#" + id).select2();
    }

    static isEqual = (items1, items2) => {
        if(!items1 || !items2){
            return false;
        }
        if (items1.length !== items2.length){
            return false;
        }
        for (let i=0; i<items1.length; ++i){
            if (items1[i].value !== items2[i].value){
                return false;
            }
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || !SelectBox.isEqual(nextProps.items, prevState.items)){
            return {
                value: nextProps.value, // Lưu value ban đầu vào state
                id: nextProps.id,
                items: nextProps.items,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Chỉ render lại khi id thay đổi, hoặc khi tập items thay đổi
        if (nextProps.id !== this.state.id || !SelectBox.isEqual(nextProps.items, this.state.items))
            return true;
        return false;
    }

    render() { 
        const { id, items, className, style, multiple=false} = this.props;
        return ( 
            <React.Fragment>
                <div>
                    <select className={className} style={style} ref="select" value={this.state.value} id={id} multiple={multiple} onChange={() => {}}>
                        {items.map(item => {
                            return <option key={item.value} value={item.value}>{item.text}</option>
                        })}
                    </select>
                </div>
            </React.Fragment>
         );
    }
}
 
export { SelectBox };
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
        const { id, onChange, multiple=true, options={} } = this.props;
        window.$("#" + id).select2(options);

        window.$("#" + id).on("change", () => {
            if(multiple){
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
            }else{
                let value = this.refs.select.value;
                this.setState(state => {
                    return {
                        ...state,
                        value
                    }
                });
                if (onChange!==undefined && onChange!==null){
                    onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
                }
            }
            
        });
    }

    getValue = () => { // Nếu không dùng onChange, có thể gọi phương thức này qua đối tượng ref để lấy các giá trị đã chọn
        return this.state.value;
    }

    componentDidUpdate() {
        const { id, options={} } = this.props;
        window.$("#" + id).select2(options);
    }

    static isEqual = (items1, items2) => {
        if(!items1 || !items2){
            return false;
        }
        if (items1.length !== items2.length){
            return false;
        }
        for (let i=0; i<items1.length; ++i){
            if (!(items1[i].value instanceof Array) && items1[i].value !== items2[i].value){ // Kiểu bình thường
                return false;
            } else if (items1[i].value instanceof Array && JSON.stringify(items1[i].value) !== JSON.stringify(items2[i].value)){ // Kiểu group
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
        const { id, items, className, style, multiple=false, emptySelection=false} = this.props;
        return ( 
            <React.Fragment>
                <div>
                    <select className={className} style={style} ref="select" value={this.state.value} id={id} multiple={multiple} onChange={() => {}}>
                        {emptySelection && <option></option>}
                        {items.map(item => {
                            if (!(item.value instanceof Array)) { // Dạng bình thường
                                return <option key={item.value} value={item.value}>{item.text}</option>
                            } else {
                                return ( // Dạng group
                                    <optgroup label={item.text}>
                                        {item.value.map(subItem => {
                                            return <option key={subItem.value} value={subItem.value}>{subItem.text}</option>
                                        })}
                                    </optgroup>
                                )
                            }
                        })}
                    </select>
                </div>
            </React.Fragment>
         );
    }
}
 
export { SelectBox };
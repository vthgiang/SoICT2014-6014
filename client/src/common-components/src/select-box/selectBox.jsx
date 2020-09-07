import React, { Component } from 'react';
import './selectBox.css';

class SelectBox extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    delay = (callback, ms) => {
        var timer = 0;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    }


    
    componentDidMount = () => {
        const { id, onChange, options = { minimumResultsForSearch: 1 }, multiple, onSearch } = this.props;
        window.$("#" + id).select2(options);

        window.$("#" + id).on("change", () => {
            let value = [].filter.call(this.refs.select.options, o => o.selected).map(o => o.value);
            this.setState(state => {
                return {
                    ...state,
                    value
                }
            });
            if (onChange !== undefined && onChange !== null) {
                onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
            }
        });


        // Xử lý sự kiện gõ phím trên input search trong selectBox
        let inputSearch;
        if (multiple === true) {
            inputSearch = window.$("#" + id).parent().find('input.select2-search__field');

            inputSearch.bind("keypress", this.delay((e) => {
                console.log(inputSearch.val());
                if (onSearch) {
                    onSearch(inputSearch.val());
                }
            }, 500));
        } else {
            window.$("#" + id).on('select2:open', (e) => {
                let inputSearch = window.$(".select2-search.select2-search--dropdown").find('input.select2-search__field');
                inputSearch.bind("keypress", this.delay((e) => {
                    console.log(inputSearch.val());
                    if (onSearch) {
                        onSearch(inputSearch.val());
                    }
                }, 500));
            });
            window.$("#" + id).on('select2:closing', (e) => {
                let inputSearch = window.$(".select2-search.select2-search--dropdown").find('input.select2-search__field');
                inputSearch.unbind("keypress");
            });
        }
    }


    getValue = () => { // Nếu không dùng onChange, có thể gọi phương thức này qua đối tượng ref để lấy các giá trị đã chọn
        let value = [].filter.call(this.refs.select.options, o => o.selected).map(o => o.value);
        return value;
    }

    componentDidUpdate() {
        const { id, options = {} } = this.props;
        window.$("#" + id).select2(options);
    }

    static isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (!(items1[i].value instanceof Array) && items1[i].value !== items2[i].value) { // Kiểu bình thường
                return false;
            } else if (items1[i].value instanceof Array && JSON.stringify(items1[i].value) !== JSON.stringify(items2[i].value)) { // Kiểu group
                return false;
            }
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || !SelectBox.isEqual(nextProps.items, prevState.items) || nextProps.disabled !== prevState.disabled) {
            return {
                value: nextProps.value, // Lưu value ban đầu vào state
                id: nextProps.id,
                items: nextProps.items,
                disabled: nextProps.disabled !== undefined ? nextProps.disabled : false
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Chỉ render lại khi id thay đổi, hoặc khi tập items thay đổi, hoặc disabled thay đổi
        if (nextProps.id !== this.state.id || !SelectBox.isEqual(nextProps.items, this.state.items) || (nextProps.disabled !== undefined ? nextProps.disabled : false) !== this.state.disabled)
            return true;
        return false;
    }

    render() {
        const { id, items, className, style, multiple = false, options = {}, disabled = false } = this.props;
        return (
            <React.Fragment>
                <div className="select2">
                    <select className={className} style={style} ref="select" value={this.state.value} id={id} multiple={multiple} onChange={() => { }} disabled={disabled}>
                        {options.placeholder !== undefined && multiple === false && <option></option>} {/*Ở chế độ single selection, nếu muốn mặc định không chọn gì*/}
                        {items.map(item => {
                            if (!(item.value instanceof Array)) { // Dạng bình thường
                                return <option key={`key-${item.value}`} value={item.value}>{item.text}</option>
                            } else {
                                return ( // Dạng group
                                    <optgroup key={item.text} label={item.text}>
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
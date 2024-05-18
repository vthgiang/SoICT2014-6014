import React, { useEffect, useState, useRef } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import styles from "./index.module.css";

const SegmentedControl = ({ segments, callback, defaultIndex = 0, controlRef }) => {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);
    const componentReady = useRef(false);

    useEffect(() => {
        componentReady.current = true;
    }, [])

    useEffect(() => {
        const activeSegmentRef = segments[activeIndex].ref
        const { offsetWidth, offsetLeft } = activeSegmentRef.current
        const { style } = controlRef.current

        style.setProperty("--highlight-width", `${offsetWidth}px`);
        style.setProperty("--highlight-x-pos", `${offsetLeft}px`);
    }, [activeIndex, callback, controlRef, segments])

    const handleInputChange = (value, index) => {
        setActiveIndex(index)
        callback(value, index)
    }

    return (
        <div className={styles.controls_container} ref={controlRef}>
            <div className={`${styles.controls} ${componentReady.current ? styles.ready : styles.idle}`}>
                {segments?.map((item, i) => (
                    <div
                        key={item.value}
                        className={`${styles.segment} ${i === activeIndex ? styles.active : styles.inactive}`}
                        ref={item.ref}
                    >
                        <input
                            type="radio"
                            value={item.value}
                            id={item.label}
                            name={item.name}
                            onChange={() => handleInputChange(item.value, i)}
                            checked={i === activeIndex}
                        />
                        <label htmlFor={item.label}>{item.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

const DashboardHeader = (props) => {
    const { translate, onChangeView, onToggleSidebar,  editMode } = props

    return (
        <div className={styles.container}>
            <SegmentedControl
                callback={onChangeView}
                controlRef={useRef()}
                segments={[
                    {
                        label: translate("manufacturing.performance.date"),
                        value: 1,
                        ref: useRef()
                    },
                    {
                        label: translate("manufacturing.performance.month"),
                        value: 2,
                        ref: useRef()
                    },
                    {
                        label: translate("manufacturing.performance.quater"),
                        value: 3,
                        ref: useRef()
                    },
                    {
                        label: translate("manufacturing.performance.year"),
                        value: 4,
                        ref: useRef()
                    }
                ]}
            />
            {!editMode? (
                <button onClick={onToggleSidebar} className={styles.edit_button + " " + styles.btn}>
                    Chỉnh sửa
                </button>
            ): (
                <>
                    <button onClick={onToggleSidebar} className={styles.cancel_button + " " + styles.btn}>
                        Đóng
                    </button>
                    <button onClick={onToggleSidebar} className={styles.edit_button + " " + styles.btn}>
                        Lưu
                    </button>
                </>
            )}
        </div>
    );
};

export default connect(null, null)(withTranslate(DashboardHeader))

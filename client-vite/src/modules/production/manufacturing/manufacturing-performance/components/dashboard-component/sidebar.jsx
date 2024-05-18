import React, { useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import {SelectBox} from ".././../../../../../common-components";
import styles from "./index.module.css";
import ThemeSelector from "./themeSelector";

const chartIcons = [
    { id: 1, name: "bar", icon: "123" },
    { id: 2, name: "line", icon: "timeline" },
    { id: 3, name: "bar", icon: "bar_chart" },
    { id: 4, name: "bar", icon: "pie_chart" },
    { id: 5, name: "bar", icon: "area_chart" },
    { id: 6, name: "bar", icon: "123" },
    { id: 7, name: "bar", icon: "123" },
    { id: 8, name: "bar", icon: "123" },
]

const themes = [
    { id: 1, name: "blue", colors: ["#007BFF", "#ffc107", "#FF6BB3", "#FF917E"] },
    { id: 2, name: "yellow", colors: ["#ffc107", "#006B60", "#C3FCF2", "#649B92"] },
    { id: 3, name: "red", colors: ["#DC3545", "#61B5D9", "#C6F8FF", "#4C7D93"] },
    { id: 4, name: "orange", colors: ["#FF851B", "#005247", "#C4FCF1", "#4C8077"] },
    { id: 5, name: "green", colors: ["#28A745", "#254775", "#E1F1FF", "#677798"] },

]

const DashboardSidebar = (props) => {
    const { translate } = props

    const [selectedIcon, setSelectedIcon] = useState(1)
    const [selectedTheme, setSelectedTheme] = useState(1)

    const handleSelectIcon = (id) => {
        setSelectedIcon(id)
    }

    const handleSelectTheme = (id) => {
        setSelectedTheme(id)
    }

    return (
        <div className={styles.sidebar}>
            <SelectBox
                id="select-kpi"
                className="form-control select2"
                style={{ width: "100%" }}
                items={[
                    { value: "", text: `${translate("manufacturing.performance.choose_kpi")}` },
                ]}
            />
            <div className="form-group" style={{marginTop: "1rem"}}>
                <label className="form-control-static">{translate('manufacturing.performance.title')}</label>
                <input type="text" className="form-control" placeholder="CR202012212" autoComplete="off" />

            </div>
            <div className="form-group" style={{marginTop: "1rem"}}>
                <label className="form-control-static">{translate('manufacturing.performance.chart_type')}</label>
                <div className={styles["chart_icon-list"]}>
                    {chartIcons.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles["chart_icon-item"]} ${selectedIcon == item.id ? styles.selected : ""}`}
                            onClick={() => handleSelectIcon(item.id)}
                        >
                            <i className="material-icons">{item.icon}</i>
                        </div>
                    ))}
                </div>

            </div>
            <div className="form-group" style={{marginTop: "1rem"}}>
                <label className="form-control-static">{translate('manufacturing.performance.color')}</label>
                <ThemeSelector themes={themes} onSelect={handleSelectTheme} selectedTheme={selectedTheme} />
            </div>
        </div>
    );
};

export default connect(null, null)(withTranslate(DashboardSidebar))

import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { TimePicker, SelectBox, ErrorLabel } from '../../../../../common-components';
import { getStorage } from '../../../../../../src/config';

import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { EditTaskTemplate } from "./editTaskTemplate";

import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import customModule from '../../custom-process-template'
import BpmnModeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import './processDiagram.css'

//Xóa element khỏi pallette theo data-action
var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
PaletteProvider.prototype.getPaletteEntries = function (element) {
    var entries = _getPaletteEntries.apply(this);
    delete entries['create.subprocess-expanded'];
    delete entries['create.data-store'];
    delete entries['create.data-object'];
    delete entries['create.group'];
    // delete entries['create.participant-expanded'];
    return entries;
}

// custom element
ElementFactory.prototype._getDefaultSize = function (semantic) {

    if (is(semantic, 'bpmn:Task')) {
        return { width: 160, height: 130 };
    }

    if (is(semantic, 'bpmn:Gateway')) {
        return { width: 50, height: 50 };
    }

    if (is(semantic, 'bpmn:Event')) {
        return { width: 36, height: 36 };
    }

    if (is(semantic, 'bpmn:Participant')) {
        return { width: 350, height: 250 };
    }

    if (is(semantic, 'bpmn:TextAnnotation')) {
        return { width: 100, height: 30 };
    }
    return { width: 100, height: 80 };

};
var zlevel = 1;

const EditProcessUnitTab = (props) => {
    let { xmlDiagramTemplate } = props;
    const [state, setState] = useState({
        userId: getStorage("userId"),
        currentRole: getStorage('currentRole'),
        showInfo: false,
        info: xmlDiagramTemplate.tasks,
        xmlDiagram: xmlDiagramTemplate,
        selectedEdit: 'info',
        zlevel: 1,
    })
    const [modeler, setModeler] = useState(new BpmnModeler({
        additionalModules: [
            customModule,
            { zoomScroll: ['value', ''] }
        ],
    }))

    const generateId = 'editprocess';

    useEffect(() => {

        let info = {};
        let infoTask1 = xmlDiagramTemplate && xmlDiagramTemplate.tasks; // TODO TaskList

        for (let i in infoTask1) {
            if (!infoTask1[i].organizationalUnit) {
                infoTask1[i].organizationalUnit = props.listOrganizationalUnit[0]?._id;
            }
            info[`${infoTask1[i].code}`] = infoTask1[i];
        }
        let { infoTask } = props
        for (const x in infoTask) {
            if (x !== undefined) {
                const modeling = modeler.get('modeling');
                let element1 = modeler.get('elementRegistry').get(x);
                if (element1) {
                    modeling.updateProperties(element1, {
                        info: infoTask[x],
                    });
                }
            }
        }
        xmlDiagramTemplate && modeler.importXML(xmlDiagramTemplate.xmlDiagram, function (err) { });
        xmlDiagramTemplate && setState({
            ...state,
            idProcess: xmlDiagramTemplate._id,
            showInfo: false,
            info: info,
            processDescription: xmlDiagramTemplate.processDescription ? xmlDiagramTemplate.processDescription : '',
            processName: xmlDiagramTemplate.processName ? xmlDiagramTemplate.processName : '',
            xmlDiagram: xmlDiagramTemplate.xmlDiagram,
        })
        modeler.on('element.click', 1000, (e) => interactPopup(e));

        modeler.on('shape.remove', 1000, (e) => deleteElements(e));

        modeler.on('commandStack.shape.delete.revert', (e) => handleUndoDeleteElement(e));

        modeler.on('shape.changed', 1000, (e) => changeNameElement(e));
    }, [props.xmlDiagramTemplate])
    useEffect(() => {

        props.getDepartment();

        let { user } = props;
        let defaultUnit = user && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.find(item =>
            item.manager === state.currentRole
            || item.deputyManager === state.currentRole
            || item.employee === state.currentRole);
        if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) { // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
            defaultUnit = user.organizationalUnitsOfUser[0]
        }
        props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);


        modeler.attachTo('#' + generateId);


        var eventBus = modeler.get('eventBus');

        //Vo hieu hoa double click edit label
        eventBus.on('element.dblclick', 10000, function (event) {
            var element = event.element;

            if (isAny(element, ['bpmn:Task'])) {
                return false;
            }
        });

        //Vo hieu hoa chinh sua label khi tao moi 
        eventBus.on([
            'create.end',
            'autoPlace.end'
        ], 250, (e) => {
            modeler.get('directEditing').cancel()
        });
        modeler.on('element.click', 1000, (e) => interactPopup(e));

        modeler.on('shape.remove', 1000, (e) => deleteElements(e));

        modeler.on('commandStack.shape.delete.revert', (e) => handleUndoDeleteElement(e));

        modeler.on('shape.changed', 1000, (e) => changeNameElement(e));
    }, [])

    // Các hàm cho nút export, import, download BPMN
    const downloadAsSVG = () => {
        modeler.saveSVG({ format: true }, function (error, svg) {
            if (error) {
                return;
            }

            var svgBlob = new Blob([svg], {
                type: 'image/svg+xml'
            });

            var fileName = Math.random(36).toString().substring(7) + '.svg';

            var downloadLink = document.createElement('a');
            downloadLink.download = fileName;
            downloadLink.innerHTML = 'Get BPMN SVG';
            downloadLink.href = window.URL.createObjectURL(svgBlob);
            downloadLink.onclick = function (event) {
                document.body.removeChild(event.target);
            };
            downloadLink.style.visibility = 'hidden';
            document.body.appendChild(downloadLink);
            downloadLink.click();
        });
    }

    const interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');
        setState(state => {
            if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway') {

                if (!state.info[`${element.businessObject.id}`] ||
                    (state.info[`${element.businessObject.id}`] && !state.info[`${element.businessObject.id}`].organizationalUnit)) {
                    state.info[`${element.businessObject.id}`] = {
                        ...state.info[`${element.businessObject.id}`],
                        organizationalUnit: props.listOrganizationalUnit[0]?._id,
                    }
                }
                return {
                    ...state,
                    showInfo: true,
                    type: element.type,
                    name: nameStr[1],
                    taskName: element.businessObject.name,
                    id: `${element.businessObject.id}`,
                }
            }
            else {
                return { ...state, showInfo: false, type: element.type, name: '', id: element.businessObject.id, }
            }

        })
    }
    // }

    const deleteElements = (event) => {
        var element = event.element;
        setState(state => {
            delete state.info[`${state.id}`];
            return {
                ...state,
                showInfo: false,
            }
        })
    }

    const handleUndoDeleteElement = (event) => {
        var element = event.context.shape;
    }

    const changeNameElement = (event) => {
        var element = event.element;
    }

    const downloadAsBpmn = () => {
        modeler.saveXML({ format: true }, function (error, xml) {
            if (error) {
                return;
            }
        });
    }

    const downloadAsImage = () => {
        modeler.saveSVG({ format: true }, function (error, svg) {
            if (error) {
                return;
            }
            function triggerDownload(imgURI) {
                var evt = new MouseEvent('click', {
                    view: window,
                    bubbles: false,
                    cancelable: true
                });

                var a = document.createElement('a');
                a.setAttribute('download', 'MY_COOL_IMAGE.png');
                a.setAttribute('href', imgURI);
                a.setAttribute('target', '_blank');

                a.dispatchEvent(evt);
            }
            var canvas = document.createElement("CANVAS");
            var ctx = canvas.getContext('2d');
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            var DOMURL = window.URL || window.webkitURL || window;

            var img = new Image();
            var svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            var url = DOMURL.createObjectURL(svgBlob);

            img.onload = function () {

                DOMURL.revokeObjectURL(url);
                ctx.drawImage(img, 0, 0);
                var imgURI = canvas
                    .toDataURL('image/png')
                    .replace('image/png', 'image/octet-stream');

                triggerDownload(imgURI);
            };

            img.src = url;
        });
    }

    const exportDiagram = () => {
        let xmlStr;
        modeler.saveXML({ format: true }, function (err, xml) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(xml);
                xmlStr = xml;
            }
        });
        setState(state => {
            return {
                ...state,
                xmlDiagram: xmlStr,
            }
        })
    }

    // Hàm xử lý sự kiện zoomin, zoomout, zoomfit 
    const handleZoomOut = async () => {
        let zstep = 0.2;
        let canvas = modeler.get('canvas');
        let eventBus = modeler.get('eventBus');

        // set initial zoom level
        canvas.zoom(zlevel, 'auto');
        // zlevel = canvas?._cachedViewbox?.scale;

        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
        });
        zlevel = Math.max(zlevel - zstep, zstep);
        canvas.zoom(zlevel, 'auto');
    }

    const handleZoomReset = () => {
        console.log('click zoom reset');

        let canvas = modeler.get('canvas');
        canvas.zoom('fit-viewport');
    }

    const handleZoomIn = async () => {
        let zstep = 0.2;
        let canvas = modeler.get('canvas');
        let eventBus = modeler.get('eventBus');

        // set initial zoom level
        canvas.zoom(zlevel, 'auto');
        // zlevel = canvas?._cachedViewbox?.scale;
        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
        });

        zlevel = Math.min(zlevel + zstep, 7);
        canvas.zoom(zlevel, 'auto');
    }

    // hàm cập nhật thông tin task trong quy trình
    const handleChangeTaskActionEmployee = (task) => {
        const infos = state.info
        console.log("change infffo: ", task)
        infos[`${state.id}`].taskActions = task.taskActions;
        console.log("infooosss: ", infos)
        setState({
            ...state,
            info: infos
        })
        // props.onChangeProcessInfoDiagram(state.info)
    }

    const { translate } = props;
    const { name, idProcess, info, showInfo, processDescription, processName, viewer, manager, selectedEdit, id } = state;

    return (
        <React.Fragment>
            <div style={{ padding: 0 }}>
                <div className="row">
                    {/* Quy trình công việc */}
                    <div className={`contain-border ${showInfo ? 'col-md-6' : 'col-md-12'}`}>
                        {/* nút export, import, download diagram,... */}
                        <div className="tool-bar-xml" style={{ /*position: "absolute", right: 5, top: 5*/ }}>
                            <button onClick={exportDiagram}>Export XML</button>
                            <button onClick={downloadAsSVG}>Save SVG</button>
                            <button onClick={downloadAsImage}>Save Image</button>
                            <button onClick={downloadAsBpmn}>Download BPMN</button>
                        </div>

                        {/* vẽ Diagram */}
                        <div id={generateId}></div>

                        {/* nút Zoom in zoom out */}
                        <div className="row">
                            <div className="io-zoom-controls">
                                <ul className="io-zoom-reset io-control io-control-list">
                                    <li>
                                        <a style={{ cursor: "pointer" }} title="Reset zoom" onClick={handleZoomReset}>
                                            <i className="fa fa-crosshairs"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a style={{ cursor: "pointer" }} title="Zoom in" onClick={handleZoomIn}>
                                            <i className="fa fa-plus"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a style={{ cursor: "pointer" }} title="Zoom out" onClick={handleZoomOut}>
                                            <i className="fa fa-minus"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin công việc trong quy trình */}
                    <div className={`right-content ${showInfo ? 'col-md-6' : undefined}`}>
                        {
                            (showInfo) &&
                            <div>
                                <EditTaskTemplate
                                    isProcess={true}
                                    id={id}
                                    info={(info && info[`${id}`]) && info[`${id}`]}
                                    onChangeTaskActionEmployee={handleChangeTaskActionEmployee}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { user, auth, role } = state;
    return { user, auth, role };
}

const mapDispatchToProps = {
    getDepartment: UserActions.getDepartmentOfUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
}

const connectEditProcessUnitTab = connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditProcessUnitTab))
export { connectEditProcessUnitTab as EditProcessUnitTab }
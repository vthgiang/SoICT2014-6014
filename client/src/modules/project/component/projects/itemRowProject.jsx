import React, { useState, useEffect } from "react";
import { Button, Card, Col, Image } from "react-bootstrap";
import ProjectEditForm from "./editProject";

export default function ItemRowProject({ currentId, fullName, codeName, handleDelete, projectEdit }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleEdit = () => {
        window.$(`#modal-edit-project-${currentId}`).modal('show');
    }
    return (
        <div>
            <ProjectEditForm
                projectEdit={projectEdit}
            />
            <div
                role="button"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="project-row-cont"
                style={{ width: '100%', display: 'flex', flexDirection: 'row', padding: '10px', borderWidth: '1px', borderColor: 'black' }}
                onClick={() => {
                    window.location.href = `/project/project-details?id=${currentId}`
                }}
            >
                <Col>
                    <Image src="https://i.pinimg.com/originals/92/32/3b/92323bb410cc82cecf739c87c0d31187.jpg" thumbnail width={50} height={50} style={{ marginRight: '10px' }} />
                </Col>
                <Col sm={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 'bold', color: isHovered ? 'white' : 'black' }}>{fullName}</div>
                        {
                            isHovered ? <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                <Button className="project-row-list-buttons">Tạo giai đoạn</Button>
                                <Button className="project-row-list-buttons">Tạo công việc</Button>
                                <Button className="project-row-list-buttons">Kanban</Button>
                                <Button className="project-row-list-buttons">Gantt</Button>
                                <Button className="project-row-list-buttons">CPM</Button>
                            </div> : <div>{codeName}</div>
                        }
                    </div>
                </Col>
                {isHovered ?
                    <Col style={{ display: 'flex', flexDirection: 'row' }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit();
                            }}
                            style={{ height: '50%', aspectRatio: 1 }}
                        >
                            <i className="fa fa-pencil-square-o" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(currentId);
                            }}
                            style={{ height: '50%', aspectRatio: 1 }}
                        >
                            <i className="fa fa-trash-o" />
                        </button>
                    </Col> : null}

            </div>
        </div>
    )
}

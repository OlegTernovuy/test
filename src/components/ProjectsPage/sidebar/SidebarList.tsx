import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from '@hello-pangea/dnd';

import { SidebarListItem, EditButtonsBlock } from '../../index';
import { StyledListItem } from '../../../styled/ProjectsPage.styled';
import { List } from '@mui/material';

import {
    useDeleteProject,
    useEditProject,
} from '../../../services/Projects.service';
import { useAuth } from '../../../Providers/AuthProvider';
import { IProjects } from '../../../types';

interface ISidebarListProps {
    projects: IProjects[];
    onReorder: (reorderedProjects: IProjects[]) => void;
    updateProjectsOrder: (
        updatedProjects: IProjects[],
        onSuccess: () => void
    ) => Promise<void>;
    setSelectedProjectUpdate: React.Dispatch<
        React.SetStateAction<string | null>
    >;
    setNewProjectName: React.Dispatch<React.SetStateAction<string>>;
    newProjectName: string;
    selectedProjectUpdate: string | null;
    selectProject: string | null;
    fetchProjects: () => void;
    handleSelectProject: (id: string, name: string) => void;
    handleCancel: () => void;
}

const reorder = (list: any, startIndex: number, endIndex: number): any => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const SidebarList = ({
    projects,
    onReorder,
    updateProjectsOrder,
    setSelectedProjectUpdate,
    setNewProjectName,
    newProjectName,
    selectedProjectUpdate,
    fetchProjects,
    selectProject,
    handleSelectProject,
    handleCancel,
}: ISidebarListProps) => {
    const { isAdmin } = useAuth();

    const onDragEnd = async ({ destination, source }: DropResult) => {
        if (!destination) return;

        const newItems: IProjects[] = reorder(
            projects,
            source.index,
            destination.index
        );

        const reorderedProjects = newItems.map((project, index) => ({
            ...project,
            index: index + 1,
        }));

        onReorder(reorderedProjects);
        try {
            await updateProjectsOrder(reorderedProjects, fetchProjects);
        } catch (error) {
            console.log('error ', error);
        }
    };

    const {
        editProject,
        loading: editLoading,
        clearError: clearEditProjectError,
    } = useEditProject();
    const { deleteProject, loading: deleteLoading } = useDeleteProject();

    const handleEditProject = (id: string, name: string) => {
        setSelectedProjectUpdate(id);
        setNewProjectName(name);
    };

    const handleSaveEdit = async (id: string) => {
        if (newProjectName.trim() && selectedProjectUpdate !== null) {
            try {
                await editProject(id, newProjectName, fetchProjects);
                setNewProjectName('');
                setSelectedProjectUpdate(null);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleDeleteProject = async (project: IProjects) => {
        try {
            await deleteProject(project.id, fetchProjects);
            if (projects.length > 1)
                handleSelectProject(projects[0].id, projects[0].name);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelEdit = () => {
        handleCancel();
        clearEditProjectError();
    };

    return (
        <>
            {isAdmin ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable-list">
                        {(provided) => (
                            <List
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {projects.map((project, index) => (
                                    <Draggable
                                        key={project.id}
                                        draggableId={project.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <StyledListItem
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={() => {
                                                    handleSelectProject(
                                                        project.id,
                                                        project.name
                                                    );
                                                }}
                                                $isselected={
                                                    selectProject === project.id
                                                }
                                            >
                                                <SidebarListItem
                                                    selectedProject={
                                                        selectedProjectUpdate ===
                                                        project.id
                                                    }
                                                    projectName={project.name}
                                                    editLoading={editLoading}
                                                    newProjectName={
                                                        newProjectName
                                                    }
                                                    setNewProjectName={
                                                        setNewProjectName
                                                    }
                                                    handleSaveEdit={() =>
                                                        handleSaveEdit(
                                                            project.id
                                                        )
                                                    }
                                                    handleCancel={
                                                        handleCancelEdit
                                                    }
                                                />
                                                {selectedProjectUpdate !==
                                                    project.id && (
                                                    <EditButtonsBlock
                                                        handleEditProject={() =>
                                                            handleEditProject(
                                                                project.id,
                                                                project.name
                                                            )
                                                        }
                                                        handleDeleteProject={() =>
                                                            handleDeleteProject(
                                                                project
                                                            )
                                                        }
                                                        deleteLoading={
                                                            deleteLoading
                                                        }
                                                    />
                                                )}
                                            </StyledListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <List>
                    {projects.map((project) => (
                        <StyledListItem
                            onClick={() => {
                                handleSelectProject(project.id, project.name);
                            }}
                            $isselected={selectProject === project.id}
                        >
                            <SidebarListItem
                                selectedProject={
                                    selectedProjectUpdate === project.id
                                }
                                projectName={project.name}
                                editLoading={editLoading}
                                newProjectName={newProjectName}
                                setNewProjectName={setNewProjectName}
                                handleSaveEdit={() =>
                                    handleSaveEdit(project.id)
                                }
                                handleCancel={handleCancelEdit}
                            />
                        </StyledListItem>
                    ))}
                </List>
            )}
        </>
    );
};

export default SidebarList;

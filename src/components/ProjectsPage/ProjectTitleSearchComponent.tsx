import { Typography } from '@mui/material';
import { GridToolbarProps, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { ProjectTitleSearchStyled } from '../../styled/AudioRecordsTable.styled';

interface ProjectTitleSearchComponentProps extends GridToolbarProps {
    projectName?: string;
}

const ProjectTitleSearchComponent = ({
    projectName,
    ...toolbarProps
}: ProjectTitleSearchComponentProps) => {
    return (
        <ProjectTitleSearchStyled>
            <Typography variant="h6">{projectName}</Typography>
            <GridToolbarQuickFilter />
        </ProjectTitleSearchStyled>
    );
};

export default ProjectTitleSearchComponent;

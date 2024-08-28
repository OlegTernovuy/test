import { ProjectTitleSearchStyled } from '../../styled/AudioRecordsTable.styled';
import { TextField, Typography, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
interface ProjectTitleSearchComponentProps {
    projectName: string;
}

const ProjectTitleSearchComponent = ({
    projectName,
}: ProjectTitleSearchComponentProps) => {
    return (
        <ProjectTitleSearchStyled>
            <Typography variant="h6">{projectName}</Typography>
            <TextField
                type="text"
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
        </ProjectTitleSearchStyled>
    );
};

export default ProjectTitleSearchComponent;

import React from 'react';
import { IconButtonStyled } from '../../../styled/CustomMediaRecorder.styled';
import { Stop, PlayArrow, Pause, Replay, Mic, Done } from '@mui/icons-material';
import { CustomIconButtonProps } from "../../../types";

const objectIcons = {
    'done': Done,
    'stop': Stop,
    'playArrow': PlayArrow,
    'pause': Pause,
    'replay': Replay,
    'mic': Mic,
}

const CustomIconButton: React.FC<CustomIconButtonProps>  = (props) => {
    const { condition, color, iconName, onClick, ...rest } = props;
    const IconComponent = objectIcons[iconName];

    return condition ? (
            <IconButtonStyled onClick={onClick} {...rest}>
                <IconComponent style={{ color }} />
            </IconButtonStyled>
    ) : null;
};

export default CustomIconButton;

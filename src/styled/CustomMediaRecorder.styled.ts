import styled from 'styled-components';

import { Button, IconButton } from '@mui/material';

const MediaStyled = styled.div`
    display: flex;
    gap: 20px;
    flex-direction: column;
`;

const InputsSelectStyled = styled.div`
    display: flex;
    gap: 32px;
`;

const AvesurferStyled = styled.div`
    width: 200px;
    height: 75px;
`;

const AudioRecorderStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: start;
    gap: 20px;
`;

const ActionsStyled = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    width: 320px;
`;

const ActionsContentStyled = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 30px;
`;

const HeaderStyled = styled.div`
    text-align: right;
    margin-right: auto;
`;

const IconButtonStyled = styled(IconButton)`
    width: 20px;
    height: 20px;
`;

const ListenAudioStyled = styled.div<{ showmedia: boolean }>`
    display: ${({ showmedia }) => (showmedia ? 'flex' : 'none')};
    align-items: center;
    gap: 20px;
`;

const ActionsButtonStyled = styled(Button)`
    width: 100%;
`;

const CircularProgressStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

export {
    HeaderStyled,
    AvesurferStyled,
    AudioRecorderStyled,
    ActionsStyled,
    ActionsContentStyled,
    IconButtonStyled,
    CircularProgressStyled,
    MediaStyled,
    InputsSelectStyled,
    ActionsButtonStyled,
    ListenAudioStyled,
};

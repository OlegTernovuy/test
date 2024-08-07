import styled, { keyframes, css } from 'styled-components';

import { IconButton, DialogActions, DialogTitle, IconButtonProps } from '@mui/material';
import { Cancel } from '@mui/icons-material';

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px 0 rgba(173, 0, 0, .3);
  }
  65% {
    box-shadow: 0 0 5px 13px rgba(173, 0, 0, .3);
  }
  90% {
    box-shadow: 0 0 5px 13px rgba(173, 0, 0, 0);
  }  
`

const TitleMic = styled.h1`
  display: flex;
  margin: 30px 0;
`

const DivWrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
`

const AvesurferWrapper = styled.div`
  width: 400px;
`

const ActionsWrapper = styled.div`
  margin: auto;
`

const DialogActionsWrapper = styled(DialogActions)`
  margin: auto;
`

const DialogHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 24px;
`

const DialogTitleWrapper = styled(DialogTitle)`
    padding: 0 !important;

`

const CancelIconButtonWrapper = styled(Cancel)`
  cursor: pointer;
`
const CircularProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`



const IconButtonWrapper = styled(IconButton)<{ $square?: boolean }>`
  width: 50px;
  height: 50px;

  svg {
    width: 40px;
    height: 40px;

    animation-name: ${props => props.$square && pulseAnimation};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
`

interface CustomIconButtonProps extends IconButtonProps {
    $square?: boolean;
}

const TitleSelectWrapper = styled.div`
    padding: 30px 0;
`

export {
    TitleMic,
    DivWrapper,
    DialogHeaderWrapper,
    DialogTitleWrapper,
    CancelIconButtonWrapper,
    IconButtonWrapper,
    AvesurferWrapper,
    ActionsWrapper,
    DialogActionsWrapper,
    CircularProgressWrapper,
    TitleSelectWrapper
};

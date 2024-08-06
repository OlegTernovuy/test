import styled from 'styled-components';

import { IconButton, DialogActions, DialogTitle } from '@mui/material';
import { Cancel } from '@mui/icons-material';

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

const CancelIconButtonWrapp = styled(Cancel)`
  cursor: pointer;
`

const IconButtonWrapper = styled(IconButton)`
    width: 50px;
    height: 50px;
  svg {
    width: 40px;
    height: 40px;
  }
`

export {
    TitleMic,
    DivWrapper,
    DialogHeaderWrapper,
    DialogTitleWrapper,
    CancelIconButtonWrapp,
    IconButtonWrapper,
    AvesurferWrapper,
    ActionsWrapper,
    DialogActionsWrapper,
};

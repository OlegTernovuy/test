import styled, { css, keyframes } from 'styled-components';
import { IconButton } from "@mui/material";

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

const DivStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NameStyled = styled.div`
  margin-bottom: 10px;
`
const AudioStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  width: 504px;
  margin-bottom: 15px;
`

const MediaStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 460px
`
const AvesurferStyled = styled.div`
  width: 400px;
`
const ActionsStyled = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  width: 400px;
`

const ActionsContentStyled = styled.div`
  margin: auto auto 20px auto;
  display: flex;
  justify-content: center;
  gap: 30px;
`


const HeaderStyled = styled.div`
  margin-bottom: 30px;
  text-align: right;
  margin-right: auto;
`

const TitleSelectStyled = styled.div`
    padding: 10px 0;
`

const IconButtonStyled = styled(IconButton)<{ $square?: boolean }>`
  width: 20px;
  height: 20px;

  ${props => props.$square && css`
    width: 50px;
    height: 50px;
    
    svg {
      width: 40px;
      height: 40px;

      animation-name: ${pulseAnimation};
      animation-duration: 1.5s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
  `}
`

const CircularProgressStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export {
    DivStyled,
    HeaderStyled,
    AvesurferStyled,
    ActionsStyled,
    ActionsContentStyled,
    TitleSelectStyled,
    IconButtonStyled,
    CircularProgressStyled,
    AudioStyled,
    NameStyled,
    MediaStyled,
};

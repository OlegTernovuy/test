import styled, { keyframes, css } from "styled-components";
import { IconButton } from '@mui/material';

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

export {
    IconButtonStyled
}

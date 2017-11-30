import styled from 'styled-components';

import { colors, fonts } from '../elements/variables';

const Figure = styled.figure`
  background-color: ${colors.white};
  padding: 15px;
  background-color: ${colors.lightGrey};
  border-radius: 3px;
`;

const CardImg = styled.img`
  display: block;
  margin: 0 auto;
  max-width: 200px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  transition: box-shadow 1s ease;

  &:hover {
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  }
`;

const Figcaption = styled.figcaption`
  color: ${colors.black};
  text-align: center;
  font-family: ${fonts.body};
  font-weight: bold;
  color: ${colors.black};
  margin-top: 20px;
  max-width: 200px;
`;

export { Figure, CardImg, Figcaption };
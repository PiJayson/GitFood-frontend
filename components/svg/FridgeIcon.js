import React from "react";
import { Svg, Path } from "react-native-svg";

const FridgeIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 640 640" fill="none">
    <Path
      d="M376,16H136A48.054,48.054,0,0,0,88,64V464a32.036,32.036,0,0,0,32,32H392a32.036,32.036,0,0,0,32-32V64A48.054,48.054,0,0,0,376,16Zm16,448H120V240H392Zm0-256H120V64a16.019,16.019,0,0,1,16-16H376a16.019,16.019,0,0,1,16,16Z"
      fill={color}
    />
  </Svg>
);

export default FridgeIcon;

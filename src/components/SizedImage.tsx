import React from "react";
import { Image, ImageSourcePropType } from "react-native";

interface SizedImageProps {
  width?: number,
  height?: number,
  style?: any,
  source: ImageSourcePropType
}

class SizedImage extends React.Component<SizedImageProps> {
  render() {
    let { width, height } = Image.resolveAssetSource(this.props.source);
    let aspect = width / height;

    let finalWidth = this.props.width ?? (this.props.height ?? height) * aspect;
    let finalHeight = this.props.height ?? (this.props.width ?? width) / aspect;

    return (
      <Image
        source={this.props.source}
        resizeMode="contain"
        style={[{
          width: finalWidth,
          height: finalHeight
        }, this.props.style ?? {}]} />
    )
  }
}

export default SizedImage;
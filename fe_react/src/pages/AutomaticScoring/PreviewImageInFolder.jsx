import {
  DownloadOutlined,
  EyeOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Image, Space } from "antd";
import React from "react";
import "./PreviewImageInFolder.scss";
const PreviewImageInFolder = ({srcImage, imageName }) => {
  const onDownload = () => {
    fetch(srcImage)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `${imageName}`;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };
  return (
    <div>
        <Image
          style={{ maxHeight: 50, maxWidth: 50 }}
          className="preview-original-image-in-folder"
          src={srcImage}
          alt="Preview image in folder"
          preview={{
            scaleStep: 0.2,
            toolbarRender: (
              _,
              {
                transform: { scale },
                actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
              }
            ) => (
              <Space size={12} className="toolbar-wrapper">
                <span>{imageName}</span>
                <DownloadOutlined onClick={onDownload} />
                <SwapOutlined rotate={90} onClick={onFlipY} />
                <SwapOutlined onClick={onFlipX} />
                <RotateLeftOutlined onClick={onRotateLeft} />
                <RotateRightOutlined onClick={onRotateRight} />
                <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
              </Space>
            ),
            mask: <EyeOutlined />
          }}
        />
    </div>
  );
};
export default PreviewImageInFolder;
// import {
//   DownloadOutlined,
//   EyeOutlined,
//   RotateLeftOutlined,
//   RotateRightOutlined,
//   SwapOutlined,
//   ZoomInOutlined,
//   ZoomOutOutlined,
// } from "@ant-design/icons";
// import { Image, Space } from "antd";
// import React from "react";
// import "./PreviewImageInFolder.scss";
// const PreviewImageInFolder = ({arrayImage, indexImg, dataTable }) => {
//   const onDownload = () => {
//     fetch(arrayImage[indexImg])
//       .then((response) => response.blob())
//       .then((blob) => {
//         const url = URL.createObjectURL(new Blob([blob]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = `${dataTable[indexImg].fileName}`;
//         document.body.appendChild(link);
//         link.click();
//         URL.revokeObjectURL(url);
//         link.remove();
//       });
//   };
//   const handleClick = () => {
//     console.log(indexImg)
//   }
//   return (
//     <div>
//       <Image.PreviewGroup
//         items={arrayImage}
//         preview={{
//           toolbarRender: (
//             _,
//             {
//               transform: { scale },
//               actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
//             }
//           ) => (
//             <Space size={12} className="toolbar-wrapper">
//               <span>{`${dataTable[indexImg].fileName}`}</span>
//               <DownloadOutlined onClick={onDownload} />
//               <SwapOutlined rotate={90} onClick={onFlipY} />
//               <SwapOutlined onClick={onFlipX} />
//               <RotateLeftOutlined onClick={onRotateLeft} />
//               <RotateRightOutlined onClick={onRotateRight} />
//               <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
//               <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
//             </Space>
//           ),
//         }}
//       >
//         <Image
//           onClick={handleClick}
//           style={{ maxHeight: 50, maxWidth: 50 }}
//           className="preview-original-image-in-folder"
//           src={arrayImage[indexImg]}
//           alt="Preview image in folder"
//           preview={{
//             mask: <EyeOutlined />
//           }}
//         />
//       </Image.PreviewGroup>
//     </div>
//   );
// };
// export default PreviewImageInFolder;


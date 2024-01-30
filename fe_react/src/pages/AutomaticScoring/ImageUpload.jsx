import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../config/apiPath";
import useNotify from "../../hooks/useNotify";
import { setRefreshTableImage } from "../../redux/slices/refreshSlice";
import "./ImageUpload.scss";

const ImageUpload = ({ selectedImages, setSelectedImages }) => {
  const dispatch = useDispatch();
  const notify = useNotify();
  // const [selectedImages, setSelectedImages] = useState([]);
  const { examClassCode } = useSelector((state) => state.appReducer);
  const isImage = (file) => {
    return file.type.startsWith("image/");
  };

  const handleImageChange = (e) => {
    const files = e.target.files;

    if (files) {
      const imageFiles = Array.from(files).filter(isImage);
      setSelectedImages(imageFiles);
    } else {
      setSelectedImages([]);
    }
  };
  const handleImageUpload = async () => {
    if (selectedImages.length === 0) {
      console.error("No images selected");
      return;
    }
    try {
      const formData = new FormData();
      selectedImages.forEach((image, index) => {
        formData.append("files", image);
      });
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `${BASE_URL}/test-set/handled-answers/upload/${examClassCode}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      notify.success("Upload thành công!");
      dispatch(setRefreshTableImage(Date.now()));
    } catch (error) {
      notify.error("Upload thất bại!");
    }
  };
  return (
    <div className="image-upload-component">
      <div style={{ marginRight: 12 }}><strong>Upload file ảnh:</strong></div>
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        multiple
        className="input-upload-scoring"
      />
      {selectedImages.length > 0 && (
        <div>
          <button className="upload-btn" onClick={handleImageUpload}>
            Tải lên ảnh
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

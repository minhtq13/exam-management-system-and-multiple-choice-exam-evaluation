import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/apiPath';
import { setRefreshTableImage } from '../../redux/slices/refreshSlice';
import { useDispatch } from 'react-redux';
import "./ImageUpload.scss"
import useNotify from '../../hooks/useNotify';

const ImageUpload = () => {
  const dispatch = useDispatch();
  const notify = useNotify()
  const [selectedImages, setSelectedImages] = useState([]);
  const isImage = (file) => {
    return file.type.startsWith('image/');
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
      console.error('No images selected');
      return;
    }
    try {
      const formData = new FormData();
      selectedImages.forEach((image, index) => {
        formData.append("files", image);
      });
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(`${BASE_URL}/test-set/handled-answers/upload/128244`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      notify.success('Upload thành công!')
      dispatch(setRefreshTableImage(Date.now()))
    } catch (error) {
      notify.error('Upload thất bại!')
    }
  };
  const handleClear = () => {
    setSelectedImages([]);
  }
  return (
    <div className='image-upload-component'>
      <div style={{marginRight: 12}}>Upload file ảnh:</div>
      <input type="file" onChange={handleImageChange} accept="image/*" multiple className='input-upload'/>
      {selectedImages.length > 0 && (
        <div>
          <button className="upload-btn" onClick={handleImageUpload}>Tải lên ảnh</button>
        </div>
      )}
      {/* {selectedImages.length > 0 && (
        <div>
          <button className="clear-btn" onClick={handleClear}>Clear</button>
        </div>
      )} */}
    </div>
  );
};

export default ImageUpload;
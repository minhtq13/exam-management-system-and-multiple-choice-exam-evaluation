import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/apiPath';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      console.error('No image selected');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('files', selectedImage);
      const response = await axios.post(`${BASE_URL}/test-set/handled-answers/upload/128244`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload success:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {selectedImage && (
        <div>
          {/* <h2>Ảnh đã chọn:</h2> */}
          {/* <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: '100%', maxHeight: '200px' }} /> */}
          <button onClick={handleImageUpload}>Tải lên ảnh</button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
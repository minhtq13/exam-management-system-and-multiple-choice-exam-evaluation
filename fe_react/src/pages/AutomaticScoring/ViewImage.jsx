import { Button, Modal } from "antd";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "./ViewImage.scss";
import testImge from "./handle_j2.jpg";

const ViewImage = ({ dataArray, index }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef();
  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (slideIndex) => setCurrentSlide(slideIndex),
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setCurrentSlide(index - 1);
    setIsModalOpen(true);
  };
  const handleNext = () => {
    sliderRef.current.slickNext();
  };
  const handleBack = () => {
    sliderRef.current.slickPrev();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="view-image-component">
      <div className="view-image-button" onClick={showModal}>
        Xem ảnh chấm
      </div>
      <Modal
        className="modal-view-image"
        title="Xem chi tiết"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleBack}>
            Ảnh trước
          </Button>,
          <Button key="next" type="primary" onClick={handleNext}>
            Ảnh sau
          </Button>,
        ]}
      >
        <Slider ref={sliderRef} {...settings} currentSlide={currentSlide}>
          {dataArray.map((item, index) => {
            return (
              <div className="modal-content-view-image" key={index}>
                <div className="header">
                  <span>
                    TT: <strong>{currentSlide + 1}/60</strong>
                  </span>
                  <span>
                    Tên ảnh: <strong>a.jpg</strong>
                  </span>
                  <span>
                    MĐT: <strong>{item.testCode}</strong>
                  </span>
                  <span>
                    MSSV: <strong>{item.studentCode}</strong>
                  </span>
                  <span>
                    MLT: <strong>{item.examClassCode}</strong>
                  </span>
                  <span>
                    Tổng số câu hỏi: <strong>60</strong>
                  </span>
                  <span>
                    Số câu khoanh: <strong>{item.numMarkedAnswers}</strong>
                  </span>
                  <span>
                    Số câu trả lời đúng: <strong>{item.numCorrectAnswers}</strong>
                  </span>
                  <span>
                    Số câu trả lời sai: <strong>4</strong>
                  </span>
                  <span>
                    Điểm: <strong>{item.totalScore}</strong>
                  </span>
                </div>
                <div className="handle-img">
                  <img src={testImge} alt=""/>
                </div>
              </div>
            );
          })}
        </Slider>
      </Modal>
    </div>
  );
};

export default ViewImage;

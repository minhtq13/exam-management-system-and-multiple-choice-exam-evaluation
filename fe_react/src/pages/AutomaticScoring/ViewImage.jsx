import { Button, Modal } from "antd";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "./ViewImage.scss";

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
                  <div className="block1">
                    <div>
                      TT: <strong>{currentSlide + 1}/60</strong>
                    </div>
                    <div>
                      Tên ảnh: <strong>a.jpg</strong>
                    </div>
                    <div>
                      MĐT: <strong>{item.testCode}</strong>
                    </div>
                    <div>
                      MSSV: <strong>{item.studentCode}</strong>
                    </div>
                    <div>
                      MLT: <strong>{item.examClassCode}</strong>
                    </div>
                  </div>
                  <div className="block2">
                    <div>
                      Tổng số câu hỏi: <strong>60</strong>
                    </div>
                    <div>
                      Số câu khoanh: <strong>{item.numMarkedAnswers}</strong>
                    </div>
                    <div>
                      Số câu đúng: <strong>{item.numCorrectAnswers}</strong>
                    </div>
                    <div>
                      Số câu sai: <strong>4</strong>
                    </div>
                    <div>
                      Điểm: <strong>{item.totalScore}</strong>
                    </div>
                  </div>
                </div>
                <div className="handle-img">
                  <img src={item.handledScoredImg} alt="" />
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

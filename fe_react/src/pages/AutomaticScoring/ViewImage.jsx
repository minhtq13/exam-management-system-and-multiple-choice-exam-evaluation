import { Button, Modal } from "antd";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import PreviewImage from "./PreviewImage";
import PreviewOriginalImage from "./PreviewOriginalImage";
import "./ViewImage.scss";
import ActionButton from "../../components/ActionButton/ActionButton";

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
  const handleDownload = () => {
    fetch(dataArray[currentSlide].handledScoredImg)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `handle-${dataArray[currentSlide].originalImgFileName}`;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };
  return (
    <div className="view-image-component">
      <div className="view-image-button">
        <ActionButton icon="view-img-handle" handleClick={showModal} />
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
          <Button key="download" type="primary" onClick={handleDownload}>
            Download
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
                      TT: <strong className="value">{currentSlide + 1}/60</strong>
                    </div>
                    <div>
                      <PreviewOriginalImage
                        srcImage={item.originalImg}
                        imageName={item.originalImgFileName}
                      />
                    </div>
                    <div>
                      Mã đề thi: <strong className="value">{item.testCode}</strong>
                    </div>
                    <div>
                      Mã số sinh viên: <strong className="value">{item.studentCode}</strong>
                    </div>
                    <div>
                      Mã lớp thi: <strong className="value">{item.examClassCode}</strong>
                    </div>
                  </div>
                  <div className="block2">
                    <div>
                      Tổng số câu hỏi: <strong className="value">{item.numTestSetQuestions}</strong>
                    </div>
                    <div>
                      Số câu khoanh: <strong className="value">{item.numMarkedAnswers}</strong>
                    </div>
                    <div>
                      Số câu đúng:{" "}
                      <strong className="value" style={{ color: "#35bb35" }}>
                        {item.numCorrectAnswers}
                      </strong>
                    </div>
                    <div>
                      Số câu sai:{" "}
                      <strong className="value" style={{ color: "#cd4a4a" }}>
                        {item.numWrongAnswers}
                      </strong>
                    </div>
                    <div>
                      Điểm:{" "}
                      <strong className="value" style={{ color: "#e7e727" }}>
                        {item.totalScore}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="handle-img">
                  <PreviewImage
                    srcImage={item.handledScoredImg}
                    imageName={item.originalImgFileName}
                  />
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

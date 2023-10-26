import "./TestPreview.scss";
const TestPreview = ({questions, testDetail, testNo}) => {
  return (
    <div className="test-preview">
      <div className="test-top">
        <div className="test-bgd">
          <p>BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
          <p className="text-bold">ĐẠI HỌC BÁCH KHOA HÀ NỘI</p>
        </div>
        <div className="test-semester">
          <p className="text-bold">ĐỀ THI CUỐI KỲ</p>
          <p className="text-bold">{`HỌC KỲ:`} </p>
        </div>
      </div>
      <div className="test-header-content">
        <div className="test-header-content-left">
          <p>Hình thức tổ chức thi: Trắc nghiệm</p>
          <p>{`Mã học phần: ${testDetail.subjectCode}`}</p>
          <p>{`Tên học phần: ${testDetail.subjectTitle}`}</p>
          <p>{`Lớp thi: `}</p>
        </div>
        <div className="test-header-content-right">
          <p className="text-bold">{`Thời gian làm bài: ${testDetail.duration} phút`}</p>
          <p className="non-ref">(Không sử dụng tài liệu)</p>
          <p className="text-bold">{`Mã đề: ${testNo}`}</p>
        </div>
      </div>
      {questions.map((item, index) => {
        return (
          <div className="question-items" key={index}>
            <div className="question-topic">{`Câu ${index + 1}: ${
              item.topicText
            }`}</div>
            {item.answers &&
              item.answers.map((ans, ansNo) => {
                return (
                  <div className="answer-items" key={`answer${ansNo}`}>
                    {`${String.fromCharCode(65 + ansNo)}. ${ans.content}`}
                  </div>
                );
              })}
          </div>
        );
      })}
      <div className="test-footer">
        <div className="test-end">
          <p>(Cán bộ coi thi không giải thích gì thêm)</p>
          <p className="text-bold">HẾT</p>
        </div>
        <div className="test-sig">
          <div className="sig-left">
            <p className="text-bold">DUYỆT CỦA KHOA/BỘ MÔN</p>
            <p>(Ký tên, ghi rõ họ tên)</p>
          </div>
          <div className="sig-right">
            <p>Hà Nội, ngày...tháng...năm...</p>
            <p className="text-bold">GIẢNG VIÊN RA ĐỀ</p>
            <p>(Ký tên, ghi rõ họ tên)</p>
          </div>
        </div>
        <div className="test-note">
          <p className="text-bold text-note">Lưu ý:</p>
          <p>{`-	Sử dụng khổ giấy A4;`}</p>
          <p>{`-	Phiếu trả lời trắc nghiệm theo mẫu của TTKT;`}</p>
          <p>{`-	Phải thể hiện số thứ tự trang nếu số trang lớn hơn 1;`}</p>
          <p>{`-	Thí sinh không được sử dụng tài liệu, mọi thắc mắc về đề thi vui lòng hỏi giám thị coi thi.`}</p>
        </div>
      </div>
    </div>
  );
};
export default TestPreview;

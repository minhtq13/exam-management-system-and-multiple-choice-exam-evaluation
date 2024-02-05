import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appPath } from "../../../../config/appPath";
import useCombo from "../../../../hooks/useCombo";
import useNotify from "../../../../hooks/useNotify";
import { testRandomService } from "../../../../services/testServices";
import { disabledDate } from "../../../../utils/tools";
import "./AutoTest.scss";
import { setDetailTest } from "../../../../utils/storage";

const AutoTest = ({ chapterIds, formKey, subjectId, levelCal, sumQues, subjectOptions }) => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [testId, setTestId] = useState(null);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [easyNumber, setEasyNumber] = useState(0);
  const [mediumNumber, setMediumNumber] = useState(0);
  const [hardNumber, setHardNumber] = useState(0);
  const [disable, setDisable] = useState(true);
  const [formValue, setFormValue] = useState(null);
  const [form] = Form.useForm();
  const { allSemester, semesterLoading, getAllSemesters } = useCombo();
  const notify = useNotify();
  useEffect(() => {
    getAllSemesters({ search: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const options =
    allSemester && allSemester.length > 0
      ? allSemester.map((item) => {
        return { value: item.id, label: item.name };
      })
      : [];
  const navigate = useNavigate();
  const onFinish = (value) => {
    setFormValue(value);
    if (subjectId !== null && chapterIds.length > 0) {
      setLoading(true);
      testRandomService(
        {
          subjectId: subjectId,
          chapterIds: chapterIds,
          name: value.name,
          startTime: dayjs(value.startTime).format(
            "DD/MM/YYYY HH:mm"
          ),
          duration: Number(value.duration),
          questionQuantity: Number(value.questionQuantity),
          totalPoint: 10,
          semesterId: Number(value.semesterId),
          generateConfig: {
            numEasyQuestion: Number(
              value.generateConfig.numEasyQuestion
            ),
            numMediumQuestion: Number(
              value.generateConfig.numMediumQuestion
            ),
            numHardQuestion: Number(
              value.generateConfig.numHardQuestion
            ),
            numTotalQuestion: Number(totalQuestion),
          },
        },
        (res) => {
          setLoading(false);
          setOpenModal(true);
          setTestId(res.data);
        },
        (error) => {
          setLoading(false);
          notify.error("Lỗi tạo đề thi!");
        }
      );
    }
  };

  const checkSum = () => {
    if (totalQuestion && totalQuestion > sumQues) {
      return Promise.reject(
        "Không đủ số lượng câu hỏi trong ngân hàng!"
      )
    };
    return Promise.resolve();
  }
  const checkConfigTotal = () => {
    const total =
      Number(easyNumber) + Number(mediumNumber) + Number(hardNumber);
    if (easyNumber && mediumNumber && hardNumber) {
      return total !== Number(totalQuestion)
        ? Promise.reject(
          "Tổng số câu dễ, trung bình, khó phải bằng tổng số câu hỏi."
        )
        : Promise.resolve();
    }
    return;
  };

  const checkConfigLevel = (inputLevel, quesLevel) => {
    return inputLevel > quesLevel ? Promise.reject("Không đủ số lượng câu hỏi trong ngân hàng câu hỏi.") : Promise.resolve();
  };

  const questionNumOnchange = (e) => {
    setTotalQuestion(e.target.value);
    if (e.target.value.trim().length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  return (
    <div className="test-create-view">
      <div className="question-config-info">
        <span className="number-q">{`Dễ: ${levelCal[0]}`}</span>
        <span className="number-q">{`Trung bình: ${levelCal[1]}`}</span>
        <span className="number-q">{`Khó: ${levelCal[2]}`}</span>
        <span className="number-q">{`Tổng: ${sumQues}`}</span>
      </div>
      <Form
        onFinish={onFinish}
        name="test-create"
        key={formKey}
        form={form}
      >
        <Form.Item
          name="name"
          label="Tên kỳ thi:"
          rules={[
            {
              required: true,
              message: "Chưa điền tên kỳ thi",
            },
          ]}
        >
          <Input placeholder="Nhập tên kỳ thi" disabled={!chapterIds.length > 0} />
        </Form.Item>
        <Form.Item
          name="duration"
          label="Thời gian thi (phút):"
          rules={[
            {
              required: true,
              message: "Chưa điền thời gian thi",
            },
          ]}
        >
          <Input type="number" placeholder="Nhập thời gian thi" disabled={!chapterIds.length > 0} />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="Thời gian bắt đầu:"
          rules={[
            {
              required: true,
              message: "Chưa chọn ngày",
            },
          ]}
        >
          <DatePicker
            format={"YYYY-MM-DD HH:mm"}
            showTime={{ format: "HH:mm" }}
            disabledDate={disabledDate}
            disabled={!chapterIds.length > 0}
            placeholder="Chọn thời gian bắt đầu"
          ></DatePicker>
        </Form.Item>

        <Form.Item
          name="questionQuantity"
          label="Số câu hỏi:"
          rules={[
            {
              required: true,
              message: "Chưa điền số lượng câu hỏi",
            },
            {
              validator: checkSum
            }
          ]}
        >
          <Input
            type="number"
            placeholder="Nhập số lượng câu hỏi"
            onChange={questionNumOnchange}
            disabled={!chapterIds.length > 0}
          />
        </Form.Item>
        <Form.Item
          className="semester-test"
          name="semesterId"
          label="Học kỳ"
          rules={[
            {
              required: true,
              message: "Chưa chọn kỳ thi",
            },
          ]}
        >
          <Select
            loading={semesterLoading}
            placeholder="Chọn kỳ thi"
            options={options}
            disabled={!chapterIds.length > 0}
          />
        </Form.Item>
        <Form.Item
          label="Phân loại"
          name="config"
          rules={[
            {
              validator: checkConfigTotal,
            },
            {
              required: true,
              message: "Chưa điền số câu",
            },
          ]}
        >
          <Row gutter={5}>
            <Col >
              <Form.Item
                name={["generateConfig", "numEasyQuestion"]}
                rules={[{ validator: () => checkConfigLevel(easyNumber, levelCal[0]) }]}
              >
                <Input
                  style={{ minWidth: 150 }}
                  placeholder="Dễ"
                  type="number"
                  disabled={disable || !chapterIds.length < 0}
                  onChange={(e) =>
                    setEasyNumber(e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name={["generateConfig", "numMediumQuestion"]}
                rules={[
                  {
                    validator: () => checkConfigLevel(mediumNumber, levelCal[1]),
                  }
                ]}
              >
                <Input
                  style={{ minWidth: 150 }}
                  placeholder="Trung bình"
                  type="number"
                  onChange={(e) =>
                    setMediumNumber(e.target.value)
                  }
                  disabled={disable || !chapterIds.length < 0}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name={["generateConfig", "numHardQuestion"]}
                rules={[
                  {
                    validator: () => checkConfigLevel(hardNumber, levelCal[2]),
                  }
                ]}
              >
                <Input
                  style={{ minWidth: 150 }}
                  placeholder="Khó"
                  type="number"
                  onChange={(e) =>
                    setHardNumber(e.target.value)
                  }
                  disabled={disable || !chapterIds.length < 0}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item className="btn-create">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ width: 150, height: 50 }}
          >
            Tạo đề
          </Button>
        </Form.Item>
      </Form>
      <Modal
        className="test-set-create-modal"
        open={openModal}
        title="Tạo đề thi thành công!"
        onOk={() => {
          navigate(`${appPath.testSetCreate}/${testId}`)
          setDetailTest(
            {
              duration: formValue.duration,
              questionQuantity: formValue.questionQuantity,
              subjectName: subjectOptions && subjectOptions.length > 0 ? (subjectOptions.find(item => item.value === subjectId) || {}).label : null,
              semester: options.find(item => item.value === formValue.semesterId).label,
              generateConfig: formValue.generateConfig
            }
          )
        }
        }
        onCancel={() => setOpenModal(false)}
      >
        <p>Bạn có muốn tạo tập đề thi không?</p>
      </Modal>
    </div>
  );
};
export default AutoTest;

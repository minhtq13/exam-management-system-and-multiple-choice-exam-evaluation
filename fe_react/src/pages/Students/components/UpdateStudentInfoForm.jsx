import { Button, DatePicker, Form, Input, Select } from "antd";
import React from "react";
import "./UpdateStudentInfoForm.scss";
const UpdateStudentInfoForm = ({
  onFinish,
  initialValues,
  infoHeader,
  btnText,
  loading
}) => {
  const genderOption = [
    {
      value: "MALE",
      label: "Nam",
    },
    {
      value: "FEMALE",
      label: "Nữ",
    },
  ];
  const dateFormat = "DD/MM/YYYY";
  const errorMessange = "Chưa điền đầy đủ thông tin";
  return (
    <div className="student-info">
      <p className="info-header">{infoHeader}</p>
      <Form
        name="info-student-form"
        className="info-student-form"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <div className="info-student-header">Thông tin sinh viên</div>
        <Form.Item
          name="firstName"
          label="Họ và tên đệm"
          colon={true}
          rules={[{ required: true, message: errorMessange }]}
        >
          <Input placeholder="Nhập họ và tên đệm sinh viên" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Tên"
          colon={true}
          rules={[
            {
              required: true,
              message: errorMessange,
            },
          ]}
        >
          <Input placeholder="Nhập tên sinh viên" />
        </Form.Item>
        <Form.Item
          name="identificationNumber"
          label="Số CCCD"
          colon={true}
        >
          <Input placeholder="Nhập MSSV" />
        </Form.Item>
        <Form.Item
          name="code"
          label="MSSV"
          colon={true}
          rules={[
            {
              required: true,
              message: errorMessange,
            },
          ]}
        >
          <Input placeholder="Nhập MSSV" />
        </Form.Item>
        <Form.Item
          name="courseNum"
          label="Khóa"
          rules={[{ required: true, message: errorMessange }]}
        >
          <Input placeholder="Nhập khóa" />
        </Form.Item>
        <Form.Item
          name="genderType"
          colon={true}
          label="Giới tính"
          rules={[{ required: true, message: errorMessange }]}
        >
          <Select
            placeholder="Chọn giới tính"
            options={genderOption}
            style={{ height: 45 }}
          ></Select>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message:
                "Vui lòng nhập đúng định dạng email. Ví dụ: abc@gmail.com",
            },
            {
              required: true,
              message: errorMessange,
            },
          ]}
          label="Email"
          colon={true}
        >
          <Input placeholder="Nhập địa chỉ email" />
        </Form.Item>
        <Form.Item
          name="birthDate"
          label="Ngày sinh"
          colon={true}
        >
          <DatePicker
            format={dateFormat}
            placeholder="Chọn ngày sinh"
          ></DatePicker>
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          colon={true}
          rules={[
            {
              pattern: /^(0|\+84)[1-9]\d{8}$/,
              message: "Vui lòng nhập đúng định dạng. Ví dụ: 0369841000",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item className="btn-info">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ width: 150, height: 50 }}
          >
            {btnText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default UpdateStudentInfoForm;

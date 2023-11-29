import { DatePicker, Form, Input, Select, Button } from "antd";
import "./TeacherInfo.scss";
import React from "react";
const TeacherInfo = ({
  onFinish,
  initialValues,
  infoHeader,
  btnText,
  datePickerOnchange,
  genderOnchange,
  loading,
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
  const dateFormat = "YYYY-MM-DD";
  const errorMessange = "Chưa điền đầy đủ thông tin";
  return (
    <div className="teacher-info">
      <p className="info-header">{infoHeader}</p>
      <Form
        name="info-teacher-form"
        className="info-teacher-form"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <div className="info-teacher-header">Thông tin giảng viên</div>
        <Form.Item
          name="firstName"
          label="Họ và tên đệm"
          colon={true}
          rules={[
            {
              pattern: /^[\p{L}\s]*$/u,
              message: "Vui lòng điền đúng định dạng. Ví dụ: Nguyễn Văn",
            },
            {
              required: true,
              message: errorMessange,
            },
          ]}
        >
          <Input placeholder="Nhập họ và tên đệm giáo viên" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Tên"
          colon={true}
          rules={[
            {
              pattern: /^[\p{L}\s]*$/u,
              message: "Vui lòng điền đúng định dạng. Ví dụ: Dương",
            },
            {
              required: true,
              message: errorMessange,
            },
          ]}
        >
          <Input placeholder="Nhập tên giáo viên" />
        </Form.Item>
        <Form.Item
          name="identificationNumber"
          label="Số CCCD"
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
          name="code"
          label="Mã cán bộ"
          colon={true}
          rules={[
            {
              required: true,
              message: errorMessange,
            },
          ]}
        >
          <Input placeholder="Nhập mã cán bộ" />
        </Form.Item>
        <Form.Item
          name="genderType"
          colon={true}
          label="Giới tính"
          rules={[
            {
              required: true,
              message: "Chưa chọn giới tính",
            },
          ]}
        >
          <Select
            placeholder="Chọn giới tính"
            options={genderOption}
            onChange={genderOnchange}
            style={{ height: 45 }}
          ></Select>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message:
                "Vui lòng điền đúng định dạng email. Ví dụ: abc@gmail.com",
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
          rules={[
            {
              required: true,
              message: "Chưa chọn ngày sinh",
            },
          ]}
        >
          <DatePicker
            onChange={datePickerOnchange}
            format={dateFormat}
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
            {
              required: true,
              message: errorMessange,
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item className="btn-info">
          <Button
            type="primary"
            htmlType="submit"
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
export default TeacherInfo;

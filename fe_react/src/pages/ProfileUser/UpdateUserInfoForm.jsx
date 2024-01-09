import { Button, DatePicker, Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import "./UpdateUserInfoForm.scss";
import { ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER } from "../../utils/constant";
const UpdateUserInfoForm = ({
  onFinish,
  initialValues,
  infoHeader,
  btnText,
  datePickerOnchange,
  genderOnchange,
  isPasswordDisplay,
  isUserNameDisplay,
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
  const roleOption = [
    {
      value: ROLE_ADMIN,
      label: "Admin",
    },
    {
      value: ROLE_TEACHER,
      label: "Giảng viên",
    },
    {
      value: ROLE_STUDENT,
      label: "Sinh viên",
    },
  ];
  const dateFormat = "DD/MM/YYYY";
  const messageRequired = "Trường này là bắt buộc!"
  // Patch value to form
  const form = Form.useForm()[0];
  useEffect(() => {
    if (initialValues !== undefined) {
      form.setFieldsValue(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);
  return (
    <div className="update-user-info-form-component">
      <p className="info-header">{infoHeader}</p>
      <Form
        form={form}
        name="info-user-form"
        className="info-user-form"
        onFinish={onFinish}
      >
        <div className="info-user-header">Cập nhật thông tin người dùng</div>
        <Form.Item
          name="firstName"
          label="Họ và tên đệm"
          colon={true}
          rules={[{ required: true, message: messageRequired }]}
        >
          <Input placeholder="Họ và tên đệm" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Tên"
          colon={true}
          rules={[{ required: true, message: messageRequired }]}
        >
          <Input placeholder="Tên" />
        </Form.Item>
        <Form.Item
          name="userType"
          colon={true}
          label="Vai trò"
          rules={[{ required: true, message: messageRequired }]}
        >
          <Select
            disabled={true}
            placeholder="Chọn vai trò"
            options={roleOption}
            style={{ height: 45 }}
          ></Select>
        </Form.Item>
        <Form.Item
          name="code"
          label="Mã số SV/GV"
          colon={true}
          rules={[{ required: true, message: messageRequired }]}
        >
          <Input placeholder="Nhập mã số SV/GV" />
        </Form.Item>
        {isUserNameDisplay && (
          <Form.Item
            name="username"
            label="Tên người dùng"
            colon={true}
            rules={[{ required: true, message: messageRequired },
            {
              min: 6,
              message: "Tên người dùng phải có ít nhất 6 ký tự"
            }
            ]}
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>
        )}
        <Form.Item
          name="genderType"
          colon={true}
          label="Giới tính"
          rules={[{ required: true, message: messageRequired }]}
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
              message: messageRequired,
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
          rules={[{ required: true, message: messageRequired }]}
        >
          <DatePicker
            onChange={datePickerOnchange}
            format={dateFormat}
            placeholder="Chọn ngày sinh"
          ></DatePicker>
        </Form.Item>
        {isPasswordDisplay && (
          <Form.Item
            name="password"
            rules={[{ required: true, message: messageRequired }]}
            label="Mật khẩu"
            colon={true}
          >
            <Input.Password placeholder="Nhập mật khẩu" autoComplete="on" />
          </Form.Item>
        )}
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          colon={true}
          rules={[
            {
              pattern: /^(0|\+84)[1-9]\d{8}$/,
              message:
                "Vui lòng nhập đúng định dạng. Ví dụ: 0369841000",
            },
            {
              required: true,
              message: messageRequired,
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item className="btn-info">
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: 150, height: 50 }}
          >
            {btnText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default UpdateUserInfoForm;

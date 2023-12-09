import "./Login.scss";

import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import SignFragment from "../../components/SignFragment/SignFragment";
import { appPath } from "../../config/appPath";
import useNotify from "../../hooks/useNotify";
import { loginAuthenticService } from "../../services/accountServices";
import { saveInfoToLocalStorage } from "../../utils/storage";

const Login = () => {
	const [loading, setLoading] = useState(false);
	const [authenticResult, setAuthenticResult] = useState(false);

	const notify = useNotify();
	const navigate = useNavigate();
	const onFinish = (values) => {
		setLoading(true);
		loginAuthenticService(
			values,
			(res) => {
				const { roles, accessToken, refreshToken } = res.data;
				setLoading(false);
				setAuthenticResult(true);
				notify.success(`Đăng nhập thành công!`);
				navigate(appPath.home);
				saveInfoToLocalStorage(accessToken, refreshToken, roles);
			},
			(error) => {
				setLoading(false);
				setAuthenticResult(false);
			}
		);
	};
	const loginForm = (
		<>
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{ remember: false }}
				onFinish={onFinish}
			>
				{/* <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not a valid email address",
            },
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item> */}
				<Form.Item
					name="username"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tên đăng nhập!",
						},
					]}
				>
					<Input placeholder="Tên đăng nhập" />
				</Form.Item>
				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập mật khẩu!",
						},
					]}
				>
					<Input.Password placeholder="Mật khẩu" />
				</Form.Item>
				{authenticResult === "error" && (
					<div className="error-authentic">
						Tài khoản đăng nhập hoặc mật khẩu không đúng!
					</div>
				)}
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading}>
						Login
					</Button>
				</Form.Item>
			</Form>
			<div className="forgot-password">Quên mật khẩu?</div>
		</>
	);
	return (
		<SignFragment header={"Đăng nhập"} socialText={"Đăng nhập với"}>
			{loginForm}
		</SignFragment>
	);
};
export default Login;

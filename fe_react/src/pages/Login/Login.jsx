import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../api/apiCaller";
import SignFragment from "../../components/SignFragment/SignFragment";
import { appPath } from "../../config/appPath";
import useNotify from "../../hooks/useNotify";
import { loginAuthenticService } from "../../services/accountServices";
import { saveInfoToLocalStorage } from "../../utils/storage";
import "./Login.scss";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [authenticResult, setAuthenticResult] = useState("");
  const notify = useNotify();
  const navigate = useNavigate();
  const onFinish = (values) => {
    setLoading(true);
    loginAuthenticService(
      values,
      (res) => {
        const { username, email, roles, accessToken, refreshToken, message } = res.data;
        setLoading(false);
        setAuthenticResult(message);
        notify.success(`Đăng nhập thành công!`);
        navigate(appPath.home);
        saveInfoToLocalStorage(username, email, roles, message, accessToken, refreshToken);
        const timeRecallAPI = 32000000;
        setInterval(() => {
          // loginAuthenticService(
          //   values,
          //   (res) => {
          //     const { username, email, roles, accessToken, refreshToken, message } = res.data;
          //     setAuthenticResult(message);
          //     navigate(appPath.home);
          //     saveInfoToLocalStorage(username, email, roles, message, accessToken, refreshToken);
          //   },
          //   (error) => {
          //     console.log(error);
          //     setAuthenticResult("error");
          //   }
          // );
          logOut();
        }, timeRecallAPI);
      },
      (error) => {
        console.log(error);
        setLoading(false);
        setAuthenticResult("error");
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
              message: "Please input your user name!",
            },
          ]}
        >
          <Input placeholder="User name" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        {authenticResult === "error" && (
          <div className="error-authentic">Tài khoản đăng nhập hoặc mật khẩu không đúng!</div>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
      <div className="forgot-password">Forgot Password?</div>
    </>
  );
  return (
    <SignFragment
      header={"Login"}
      socialText={"Login with"}
      endText={"Don't have an account?"}
      signText={"Register"}
      href={"/register"}
    >
      {loginForm}
    </SignFragment>
  );
};
export default Login;

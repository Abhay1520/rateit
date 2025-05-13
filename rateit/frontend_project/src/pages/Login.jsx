import { useState, useContext } from 'react';
import { Button, Input, Form, message } from 'antd';
import { loginUser } from '../services/auth';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await loginUser(values);
      login(res.data);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      message.error('Login failed');
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item name="username" label="Email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Button htmlType="submit" type="primary" block>
        Login
      </Button>
    </Form>
  );
}

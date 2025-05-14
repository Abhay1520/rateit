import { useContext } from 'react';
import { Button, Input, Form, message, Card, Typography } from 'antd';
import { loginUser } from '../services/auth';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

export default function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await loginUser(values);
      login(res.data, () => {
        message.success('Login successful!');
        navigate('/dashboard');
      });
    } catch (err) {
      message.error('Login failed');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md shadow-lg" bordered={false}>
        <div className="text-center mb-6">
          <Title level={3}>Welcome Back</Title>
          <Text type="secondary">Please login to continue</Text>
        </div>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            label="Email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-4">
          <Text>New user?</Text>{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
}

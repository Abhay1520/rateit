import { Form, Input, Select, Button, message, Typography, Card } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { Title, Text } = Typography;

export default function Register() {
  const navigate = useNavigate();
  const [RoleOptions, setRoleOptions] = useState([]);

  const registerUser = async (values) => {
    const { name, email, password, address, role } = values;
    const response = await axios.post('http://localhost:8000/api/register/', {
      name,
      email,
      password,
      address,
      role,
    });
    return response.data;
  };

  useEffect(() => {
    const fetchRoleOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/roles/');
        setRoleOptions(response.data);
      } catch (error) {
        console.error('Error fetching role options:', error);
      }
    };

    fetchRoleOptions();
  }, []);

  const onFinish = async (values) => {
    try {
      await registerUser(values);
      message.success('Registered successfully!');
      navigate('/login');
    } catch (err) {
      message.error('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full h-3/6 max-w-md shadow-lg" bordered={false}>
        <div className="text-center mb-6">
          <Title level={3}>Create an Account</Title>
          <Text type="secondary">Please fill the form to register</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Enter your email address" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password placeholder="Create a password" />
          </Form.Item>

          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Enter your address" autoSize={{ minRows: 2 }} />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select your role">
              {RoleOptions.map((role) => (
                <Select.Option key={role.id} value={role.name}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary" className="w-full">
              Register
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <Text>Already have an account?</Text>{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

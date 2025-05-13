import { Form, Input, Select, Button, message } from 'antd';
import { registerUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';




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
  }
  useEffect(() => {
    const fetchRoleOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/roles/');
        const data = response.data;
        setRoleOptions(data);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input className="h-10" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input className="h-10" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password className="h-10" />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input.TextArea className="min-h-[80px]" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select className="h-10">
              {RoleOptions.map((role) => (
                <Select.Option key={role.id} value={role.name}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" className="w-full h-10 text-md">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

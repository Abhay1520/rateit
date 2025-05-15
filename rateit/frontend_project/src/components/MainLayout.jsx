import {
    Layout,
    Menu,
    Switch,
    Dropdown,
    Avatar,
    ConfigProvider,
    theme as antdTheme,
} from 'antd';
import {
    DashboardOutlined,
    LogoutOutlined,
    UserOutlined,
    DownOutlined,
    CaretUpFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
    const { logout, authUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const handleMenuClick = ({ key }) => {
        navigate(`/${key}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const profileMenu = (
        <Menu
            items={[
                {
                    key: 'name',
                    label: <strong>{authUser?.name}</strong>,
                    disabled: true,
                },
                {
                    key: 'email',
                    label: authUser?.email,
                    disabled: true,
                },
                { type: 'divider' },
                {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    onClick: handleLogout,
                },
            ]}
        />
    );

    return (
        <ConfigProvider
            theme={{
                algorithm: darkMode
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,
            }}
        >
            <Layout className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
                <Sider theme={darkMode ? 'dark' : 'light'}>
                    <div className="text-white text-center py-4 font-bold text-xl">
                        RATE-IT
                    </div>
                    <Menu
                        theme={darkMode ? 'dark' : 'light'}
                        mode="inline"
                        defaultSelectedKeys={['dashboard']}
                        onClick={handleMenuClick}
                        items={[
                            {
                                key: 'dashboard',
                                icon: <DashboardOutlined />,
                                label: 'Dashboard',
                            },
                        ]}
                    />
                    <Menu
                        theme={darkMode ? 'dark' : 'light'}
                        mode="inline"
                        defaultSelectedKeys={['store']}
                        onClick={handleMenuClick}
                        items={[
                            {
                                key: 'store',
                                icon: <CaretUpFilled />,
                                label: 'Store',
                            },
                        ]}
                    />
                </Sider>

                <Layout>
                    <Header 
                        theme={darkMode ? 'dark' : 'light'}
                    className="flex justify-end gap-10 items-center px-6 bg-white dark:bg-gray-900">
                        {/* <Switch
                            checkedChildren="🌙"
                            unCheckedChildren="☀️"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        /> */}

                        <Dropdown overlay={profileMenu} placement="bottomRight">
                            <div className="cursor-pointer flex items-center gap-2">
                                <Avatar icon={<UserOutlined />} />
                                <span>{authUser?.name}</span>
                                <DownOutlined />
                            </div>
                        </Dropdown>
                    </Header>

                    <Content className="p-6 bg-gray-100 dark:bg-gray-800">
                        {children}
                    </Content>

                    <Footer className="text-center bg-white dark:bg-gray-800">
                        © {new Date().getFullYear()} RATE-IT — All rights reserved.
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default MainLayout;

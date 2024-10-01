import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeUserInfo } from '../../redux/slice/userSlice';
import { FaCheckCircle, FaTrash } from 'react-icons/fa';
import { MdAddCircle, MdOutlineEditCalendar, MdOutlineInventory, MdVerified } from 'react-icons/md';
import { LuLogOut } from "react-icons/lu";
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import io from 'socket.io-client';
import Api from '../../api/axiosConfig';

interface Task {
    _id: string;
    taskName: string;
    status: 'Pending' | 'In Progress' | 'Completed';
}


const Starfield: React.FC = () => {
    useEffect(() => {
        const canvas = document.getElementById('starfield') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const stars: { x: number; y: number; size: number; speed: number }[] = [];
        const numStars = 400;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1,
                speed: Math.random() * 0.5 + 0.2,
            });
        }

        const animate = () => {
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#FFA500';

                stars.forEach((star) => {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    ctx.fill();

                    star.y += star.speed;

                    if (star.y > canvas.height) {
                        star.y = 0;
                        star.x = Math.random() * canvas.width;
                    }
                });

                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas id="starfield" className="fixed top-0 left-0 w-full h-full" />;
};

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('taskDetails');
    const [task, setTask] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state: any) => state.userInfo);

    const addTask = useCallback((newTask: Task) => {
        setTasks(prevTasks => {
            if (!prevTasks.some(task => task._id === newTask._id)) {
                return [...prevTasks, newTask];
            }
            return prevTasks;
        });
    }, []);

    useEffect(() => {
        const socket = io('https://taskmaster-dkd8.onrender.com');
        socket.emit('user_login', userInfo._id);

        socket.on('task_added', addTask);

        socket.on('task_updated', (updatedTask: Task) => {
            setTasks(prevTasks => prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
        });

        socket.on('task_deleted', (deletedTaskId: string) => {
            setTasks(prevTasks => prevTasks.filter(task => task._id !== deletedTaskId));
        });

        socket.on('task_completed', (completedTask: Task) => {
            setTasks(prevTasks => prevTasks.filter(task => task._id !== completedTask._id));
            setCompletedTasks(prevCompletedTasks => [...prevCompletedTasks, completedTask]);
        });

        fetchTasks();
        fetchCompletedTasks();

        return () => {
            socket.off('task_added', addTask);
            socket.disconnect();
        };
    }, [userInfo._id, addTask]);

    const fetchTasks = async () => {
        try {
            const response = await Api.get('/list');
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    const fetchCompletedTasks = async () => {
        try {
            const response = await Api.get('/completed');
            setCompletedTasks(response.data.tasks);
        } catch (error) {
            console.error('Failed to fetch completed tasks:', error);
        }
    };

    const handleAddTask = async () => {
        if (task) {
            try {
                const response = await Api.post('/create', { taskName: task });
                addTask(response.data.task);
                setTask('');
                setIsModalOpen(false);
            } catch (error) {
                console.error('Failed to add task:', error);
            }
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (taskId && confirm('Are you sure you want to delete this task?')) {
            try {
                await Api.delete(`/delete/${taskId}`);
                setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            } catch (error) {
                console.error('Failed to delete task:', error);
            }
        }
    };

    const handleCompleteTask = async (taskId: string) => {
        try {
            const response = await Api.put(`/status/${taskId}`, { status: 'Completed' });
            const completedTask = response.data.task;
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            setCompletedTasks(prevCompletedTasks => [...prevCompletedTasks, completedTask]);
        } catch (error) {
            console.error('Failed to complete task:', error);
        }
    };

    const handleEditTask = (taskToEdit: Task) => {
        setEditingTask(taskToEdit);
        setTask(taskToEdit.taskName);
        setIsEditModalOpen(true);
    };

    const handleUpdateTask = async () => {
        if (editingTask && task) {
            try {
                const response = await Api.put(`/update/${editingTask._id}`, { taskName: task });
                if (response.data.success) {
                    setTasks(prevTasks => prevTasks.map(t => t._id === editingTask._id ? response.data.task : t));
                    setIsEditModalOpen(false);
                    setEditingTask(null);
                    setTask('');
                } else {
                    console.error('Failed to update task:', response.data.message);
                }
            } catch (error) {
                console.error('Failed to update task:', error);
            }
        }
    };

    const handleLogout = () => {
        dispatch(removeUserInfo());
        navigate('/');
    };

    const pendingTasksCount = tasks.length;
    const completedTasksCount = completedTasks.length;

    const data = [
        { name: 'Pending', value: pendingTasksCount },
        { name: 'Completed', value: completedTasksCount },
    ];

    const COLORS = ['#0088FE', '#00C49F'];

    return (
        <div className="bg-black min-h-screen text-white font-outfit">
            <Starfield />
            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="flex flex-col md:flex-row">
                    {/* Left column */}
                    <div className="w-full md:w-1/4 mb-8 md:mb-0">
                        {/* Task Master section */}
                        <div className="bg-[#373A40] bg-opacity-80 p-6 shadow-lg">
                            <h1 className="text-2xl font-bold mb-4 flex items-center">
                                <MdOutlineInventory className="mr-2" /> Task Master
                            </h1>
                            <p className="text-sm mb-6">Document your task and bring them to completion.</p>
                            <div className="space-y-2">
                                <button
                                    className={`w-full p-2 rounded transition-colors ${activeTab === 'taskDetails' ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    onClick={() => setActiveTab('taskDetails')}
                                >
                                    Tasks Control
                                </button>
                                <button
                                    className={`w-full p-2 rounded transition-colors ${activeTab === 'completedTasks' ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    onClick={() => setActiveTab('completedTasks')}
                                >
                                    Completed Tasks
                                </button>
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded transition-colors"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <MdAddCircle className="inline mr-2" /> New Task
                                </button>
                            </div>
                            <div className="mt-8">
                                <h2 className="flex items-center text-lg mb-2">
                                    {userInfo.name} <MdVerified className="mr-2 ml-1" />
                                </h2>
                                <p className="text-sm mb-4">Successfully verified by the Task Master</p>
                                <button
                                    className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                                    onClick={handleLogout}
                                >
                                    <LuLogOut className="mr-2" /> Log out
                                </button>
                            </div>
                        </div>
                        {/* Task Statistics section */}
                        <div className="bg-[#373A40] bg-opacity-80 p-6 shadow-lg mt-6">
                            <h2 className="text-xl font-bold mb-4">Task Statistics</h2>
                            <div className="flex justify-between mb-4">
                                <div>
                                    <p className="text-sm">Pending Tasks</p>
                                    <p className="text-2xl font-bold text-orange-500">{pendingTasksCount}</p>
                                </div>
                                <div>
                                    <p className="text-sm">Completed Tasks</p>
                                    <p className="text-2xl font-bold text-green-500">{completedTasksCount}</p>
                                </div>
                            </div>
                            <p className="text-sm mb-4">
                                Keep up the great work! You've completed {completedTasksCount} tasks so far.
                                Stay focused and tackle those {pendingTasksCount} pending tasks.
                            </p>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="w-full md:w-3/4 md:pl-8">
                        <div className="bg-[#373A40] bg-opacity-80 p-6 shadow-lg">
                            {activeTab === 'taskDetails' && (
                                <div>
                                    <h2 className="text-xl mb-4">Active Tasks</h2>
                                    {tasks.length > 0 ? (
                                        <div className="space-y-4">
                                            {tasks.map((taskItem) => (
                                                <div key={taskItem._id} className="bg-[#423F3E] p-4 shadow">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                                        <h3 className="text-lg mb-2 md:mb-0 break-words w-full md:w-1/3 lg:w-1/2">
                                                            {taskItem.taskName}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2 md:w-2/3 lg:w-1/2 justify-start md:justify-end">
                                                            <button
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors flex items-center justify-center text-sm whitespace-nowrap"
                                                                onClick={() => handleEditTask(taskItem)}
                                                            >
                                                                <MdOutlineEditCalendar className="mr-1" />
                                                                <span className="hidden sm:inline">Edit Task</span>
                                                            </button>
                                                            <button
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors flex items-center justify-center text-sm whitespace-nowrap"
                                                                onClick={() => handleDeleteTask(taskItem._id)}
                                                            >
                                                                <FaTrash className="mr-1" />
                                                                <span className="hidden sm:inline">Delete Task</span>
                                                            </button>
                                                            <button
                                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors flex items-center justify-center text-sm whitespace-nowrap"
                                                                onClick={() => handleCompleteTask(taskItem._id)}
                                                            >
                                                                <IoCheckmarkDoneSharp className="mr-1" />
                                                                <span className="hidden sm:inline">Complete Task</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='mt-2'>No active tasks. Time to explore the task!</p>
                                    )}
                                </div>
                            )}
                            {activeTab === 'completedTasks' && (
                                <div>
                                    <h2 className="font-bold mb-1 text-2xl">Completed Missions</h2>
                                    <p className='mb-3 text-sm'>Great job so far! Check out the completed task below and keep up the good work!</p>
                                    {completedTasks.length > 0 ? (
                                        <div className="space-y-4">
                                            {completedTasks.map((completedTask) => (
                                                <div key={completedTask._id} className="bg-[#423F3E] p-4">
                                                    <h3 className="flex items-center break-words">
                                                        <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                                                        <span>{completedTask.taskName}</span>
                                                    </h3>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No completed missions yet. Keep exploring!</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>



                </div>
            </div>

            {/* Add Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="mb-4">Add New Task</h3>
                        <input
                            type="text"
                            className="w-full p-2 mb-4 bg-gray-800 rounded text-white focus:bg-none"
                            placeholder="Enter new objective"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                                onClick={handleAddTask}
                            >
                                Launch Task
                            </button>
                            <button
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Abort Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[#373A40] p-8 rounded-xl shadow-lg w-full max-w-md">
                        <h3 className="mb-4">Edit Task</h3>
                        <input
                            type="text"
                            className="w-full p-2 mb-4 bg-gray-600 border border-gray-700 rounded text-white"
                            placeholder="Edit task description"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-[#DC5F00] hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                                onClick={handleUpdateTask}
                            >
                                Update Task
                            </button>
                            <button
                                className="bg-[#EEEEEE] hover:bg-gray-600 text-black px-4 py-2 rounded transition-colors"
                                onClick={() => {
                                    setIsEditModalOpen(false);
                                    setEditingTask(null);
                                    setTask('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '../../api/api';
import { setUserInfo } from '../../redux/slice/userSlice';
import { MdOutlineInventory } from 'react-icons/md';

// Starfield background effect
const Starfield = () => {
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
        ctx.fillStyle = 'ORANGE';

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

// Zod schema for validation
const schema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

// Define the form data structure for TypeScript
type FormData = z.infer<typeof schema>;

// Login form component
const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    // Pre-fill email and password fields if available in localStorage
    const lastEmail = localStorage.getItem("lastRegisteredEmail");
    const lastPassword = localStorage.getItem("lastRegisteredPassword");
    if (lastEmail) setValue("email", lastEmail);
    if (lastPassword) setValue("password", lastPassword);
    
    // Clear the stored credentials after pre-filling
    localStorage.removeItem("lastRegisteredEmail");
    localStorage.removeItem("lastRegisteredPassword");
  }, [setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await login(data);

      if (response.success) {
        dispatch(setUserInfo(response.data));
        navigate('/dashboard');
      } else {
        setLoginError(response.error ?? "Unknown error occurred");
      }

      reset();
    } catch (error) {
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-black font-outfit">
      <Starfield />
      <form
        className="bg-[#EEEEEE] bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-md w-full max-w-md z-10 mx-4 md:mx-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="flex items-center justify-center text-[#DC5F00] font-semibold">
          Task Master Login Form <MdOutlineInventory className="ml-2" />
        </h2>
        <p className='mb-6 text-center text-gray-600'>Your complete task organizer</p>

        {/* Display error messages */}
        {loginError && (
          <div className="bg-red-500 text-white text-sm p-3 mb-4 rounded-lg">
            {loginError}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-[#DC5F00] text-sm mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="w-full px-4 py-2 bg-gray text-black rounded focus:outline-none focus:ring-2 focus:bg-none"
            type="email"
            id="email"
            placeholder="Enter your email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-[#DC5F00] text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-[#DC5F00] mb-2 text-sm" htmlFor="password">
            Password
          </label>
          <input
            className="w-full px-4 py-2 bg-gray text-black rounded focus:outline-none focus:ring-2 focus:bg-none"
            type="password"
            id="password"
            placeholder="Enter your password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-[#DC5F00] text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#DC5F00] text-white py-2 rounded hover:bg-[#dc5f0060] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-600">New to Task Master?</p>
          <a href="/register" className="text-[#DC5F00] font-medium">
            Create an account
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

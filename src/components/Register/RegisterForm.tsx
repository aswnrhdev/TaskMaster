// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { signup } from "../../api/api";
// import { MdOutlineInventory } from "react-icons/md";

// const schema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
//   confirmPassword: z.string().min(6, { message: "Confirm password is required" }),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// const Starfield = () => {
//   // The starfield effect code from the login form
//   useEffect(() => {
//     const canvas = document.getElementById('starfield') as HTMLCanvasElement;
//     const ctx = canvas.getContext('2d');
//     let animationFrameId: number;

//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     window.addEventListener('resize', resizeCanvas);
//     resizeCanvas();

//     const stars: { x: number; y: number; size: number; speed: number }[] = [];
//     const numStars = 400;

//     for (let i = 0; i < numStars; i++) {
//       stars.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         size: Math.random() * 1,
//         speed: Math.random() * 0.5 + 0.2,
//       });
//     }

//     const animate = () => {
//       if (ctx) {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.fillStyle = 'ORANGE';

//         stars.forEach((star) => {
//           ctx.beginPath();
//           ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
//           ctx.fill();

//           star.y += star.speed;

//           if (star.y > canvas.height) {
//             star.y = 0;
//             star.x = Math.random() * canvas.width;
//           }
//         });

//         animationFrameId = requestAnimationFrame(animate);
//       }
//     };

//     animate();

//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return <canvas id="starfield" className="fixed top-0 left-0 w-full h-full" />;
// };



// const RegisterForm = () => {
//   const [registerError, setRegisterError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: zodResolver(schema),
//   });

//   const onSubmit = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
//     try {
//       const response = await signup({ name: data.name, email: data.email, password: data.password });
//       if (response.success) {
//         // Redirect or handle success
//         reset();
//       } else {
//         setRegisterError(response.error);
//       }
//     } catch (error) {
//       setRegisterError("Registration failed. Please try again.");
//     }
//   };

//   return (
//     <div className="relative flex justify-center items-center min-h-screen bg-black font-outfit">
//       <Starfield />
//       <form
//         className="bg-[#EEEEEE] bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-md w-full max-w-md z-10 mx-4 md:mx-0"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <h2 className="flex items-center justify-center text-[#DC5F00] font-semibold">
//           Task Master Register Form <MdOutlineInventory className="ml-2" />
//         </h2>
//         <p className='mb-6 text-center text-gray-600'>Join Task Master today!</p>

//         {registerError && (
//           <div className="bg-red-500 text-white text-sm p-3 mb-4 rounded-lg">
//             {registerError}
//           </div>
//         )}

//         <div className="mb-4">
//           <label className="block text-[#DC5F00] text-sm mb-2" htmlFor="name">
//             Name
//           </label>
//           <input
//             className="w-full px-4 py-2 bg-gray text-black rounded focus:outline-none focus:ring-2 focus:bg-none"
//             type="text"
//             id="name"
//             placeholder="Enter your name"
//             {...register("name")}
//           />
//           {errors.name && (
//             <p className="text-[#DC5F00] text-sm mt-1">{errors.name.message as string}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block text-[#DC5F00] text-sm mb-2" htmlFor="email">
//             Email
//           </label>
//           <input
//             className="w-full px-4 py-2 bg-gray text-black rounded focus:outline-none focus:ring-2 focus:bg-none"
//             type="email"
//             id="email"
//             placeholder="Enter your email"
//             {...register("email")}
//           />
//           {errors.email && (
//             <p className="text-[#DC5F00] text-sm mt-1">{errors.email.message as string}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block text-[#DC5F00] text-sm mb-2" htmlFor="password">
//             Password
//           </label>
//           <input
//             className="w-full px-4 py-2 bg-gray text-black rounded focus:outline-none focus:ring-2 focus:bg-none"
//             type="password"
//             id="password"
//             placeholder="Enter your password"
//             {...register("password")}
//           />
//           {errors.password && (
//             <p className="text-[#DC5F00] text-sm mt-1">{errors.password.message as string}</p>
//           )}
//         </div>

//         <div className="mb-6">
//           <label className="block text-[#DC5F00] text-sm mb-2" htmlFor="confirmPassword">
//             Confirm Password
//           </label>
//           <input
//             className="w-full px-4 py-2 bg-gray text-black rounded focus:outline-none focus:ring-2 focus:bg-none"
//             type="password"
//             id="confirmPassword"
//             placeholder="Confirm your password"
//             {...register("confirmPassword")}
//           />
//           {errors.confirmPassword && (
//             <p className="text-[#DC5F00] text-sm mt-1">{errors.confirmPassword.message as string}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-[#DC5F00] text-white py-2 rounded hover:bg-[#dc5f0060] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
//         >
//           Register
//         </button>

//         <div className="text-center mt-4">
//           <p className="text-gray-600">Already have an account?</p>
//           <a href="/" className="text-[#DC5F00] font-medium">
//             Log in here
//           </a>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;



import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signup } from "../../api/api";
import { MdOutlineInventory } from "react-icons/md";

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string().min(6, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

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

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm = () => {
  const [registerError, setRegisterError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await signup({ name: data.name, email: data.email, password: data.password });
      if (response.success) {
        reset();
      } else {
        setRegisterError(response.error ?? "Unknown error occurred");
      }
    } catch (error) {
      setRegisterError("Registration failed. Please try again.");
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
          Task Master Register Form <MdOutlineInventory className="ml-2" />
        </h2>
        <p className='mb-6 text-center text-gray-600'>Join Task Master today!</p>

        {registerError && (
          <div className="bg-red-500 text-white text-sm p-3 mb-4 rounded-lg">
            {registerError}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-[#DC5F00] text-sm mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="w-full px-4 py-2 bg-gray text-black rounded focus:outline-none focus:ring-2 focus:bg-none"
            type="text"
            id="name"
            placeholder="Enter your name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-[#DC5F00] text-sm mt-1">{errors.name.message as string}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-[#DC5F00] text-sm mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="w-full px-4 py-2 bg-gray text-black rounded focus:outline-none focus:ring-2 focus:bg-none"
            type="email"
            id="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-[#DC5F00] text-sm mt-1">{errors.email.message as string}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-[#DC5F00] text-sm mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="w-full px-4 py-2 bg-gray text-black rounded focus:outline-none focus:ring-2 focus:bg-none"
            type="password"
            id="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-[#DC5F00] text-sm mt-1">{errors.password.message as string}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-[#DC5F00] text-sm mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="w-full px-4 py-2 bg-gray text-black rounded focus:outline-none focus:ring-2 focus:bg-none"
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-[#DC5F00] text-sm mt-1">{errors.confirmPassword.message as string}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#DC5F00] text-white py-2 rounded hover:bg-[#dc5f0060] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          Register
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-600">Already have an account?</p>
          <a href="/" className="text-[#DC5F00] font-medium">
            Log in here
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

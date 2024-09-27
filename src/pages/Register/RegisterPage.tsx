import { useSelector } from "react-redux";
import RegisterForm from "../../components/Register/RegisterForm"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RegisterPage = () => {
    const { userInfo } = useSelector((state: any) => state.userInfo);
    const navigate = useNavigate()
    useEffect(() => {
        if (userInfo) {
            navigate('/dashboard');
        }
    }, [userInfo, navigate]); 
    
    return (
        <>
            <RegisterForm />
        </>
    )
}

export default RegisterPage
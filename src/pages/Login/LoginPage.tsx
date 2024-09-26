import { useSelector } from "react-redux"
import LoginForm from "../../components/Login/LoginForm"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {

    const { userInfo } = useSelector((state: any) => state.userInfo);
    const navigate = useNavigate()
    useEffect(() => {
        if (userInfo) {
            navigate('/dashboard')
        }
    }, [])

    return (
        <>
            <LoginForm />
        </>
    )
}

export default LoginPage
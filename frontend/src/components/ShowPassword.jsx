import { FaEye } from "react-icons/fa";
export const ShowPassword = ({ setShowPassword }) => {
    return (
        <>
            <FaEye
                onClick={() =>
                    setShowPassword((prev) => (prev === "text" ? "password" : "text"))
                }
                className="text-xl"
            />
        </>
    )
}



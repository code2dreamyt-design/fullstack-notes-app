import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
const ForgetPass = () => {
  const navigate = useNavigate();
  const {
    register: registerFind,
    handleSubmit: handleSubmitFind,
    formState: { errors: errorsFind, isSubmitting: isSubmittingFind }
  } = useForm();

  const submit = async (data) => {
    console.log("FORM 1:", data);
    try {
      const response = await api.post("/reset/sendOTP",data);
      console.log(response.data.msg);
      navigate("/verifyotp");
    } catch (error) {
      console.log(error.response.status);
      console.log(error.response.data.msg);
      if(error.response.status===429){
        navigate("/verifyotp");
      }
      if(error.response.status===409){
        navigate("/verifyotp");
      }
    }
    
  };

  return (
    <div className="w-full min-h-[70vh] flex justify-center items-center px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-center p-4">

        {/* TITLE */}
        <div className="mb-6 font-bold text-xl sm:text-2xl text-amber-100 text-center">
          Find Your Account
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmitFind(submit)}
          className="w-full flex flex-col gap-4"
        >
          {/* ERROR */}
          {errorsFind.email && (
            <span className="text-red-600 text-sm text-center">
              {errorsFind.email.message}
            </span>
          )}

          {/* EMAIL INPUT */}
          <div className="w-full h-12 flex items-center gap-2 border border-[#ffffff74] rounded-2xl px-3 bg-[#01201668]">
            <i className="fa-solid fa-envelope text-[#ffffff9b]"></i>
            <input
              type="email"
              className="flex-1 outline-none bg-transparent text-white placeholder:text-[#ffffff9b]"
              placeholder="Enter your email"
              {...registerFind("email", {
                required: { value: true, message: "Email required" },
                maxLength: { value: 50, message: "Max length is 50" },
                minLength: { value: 8, message: "Min length is 50" }
              })}
            />
          </div>

          {/* SUBMIT */}
          <div className="flex justify-center mt-2">
            <input
              type="submit"
              disabled={isSubmittingFind}
              value="Find"
              className="text-black h-12 w-full sm:w-[70%] md:w-[60%]
                bg-[linear-gradient(159deg,rgba(14,105,29,1)_20%,rgba(69,212,47,1)_45%,rgba(26,71,5,1)_72%)]
                rounded-4xl shadow-[0px_4px_30px_black] cursor-pointer font-semibold"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPass;

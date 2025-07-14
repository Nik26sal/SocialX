import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function OTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [popup, setPopup] = useState({ show: false, message: "", status: "success" });
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value) || value.length > 1) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);

      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`)?.focus();
      }
    }
  };

  const handleKeyDownforsubmit = (e) => {
    if (e.key === "Enter" && otp.every((n) => n !== "")) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const code = otp.join("");
      const response = await axios.post("http://localhost:5555/user/verifyEmail", {
        code,
      });

      showPopup(response?.data?.message || "Email verified successfully.", "success");
      setTimeout(() => {
        navigate("/sign_in_up", { state: { isLogin: true, loading: false } });
      }, 2000);
    } catch (err) {
      showPopup("Invalid or expired code. Try again.", "error");
    }
  };

  const showPopup = (message, status) => {
    setPopup({ show: true, message, status });
    setTimeout(() => setPopup({ ...popup, show: false }), 2500);
  };

  useEffect(() => {
    document.getElementById("otp-input-0")?.focus();
  }, []);

  return (
    <div
      onKeyDown={handleKeyDownforsubmit}
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-800 to-indigo-900"
    >
      {/* OTP Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 border border-white/20 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[90%] max-w-md text-center text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Verify Email</h1>
        <p className="text-sm text-gray-200 mb-6">Enter the 6-digit OTP sent to your email.</p>

        {/* OTP Inputs */}
        <div className="flex justify-center space-x-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              maxLength="1"
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 rounded-lg text-2xl text-white text-center border border-white/30 bg-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          ))}
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow-lg transition"
        >
          Submit
        </motion.button>
      </motion.div>

      {/* Modal Popup */}
      <AnimatePresence>
        {popup.show && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg text-white text-center z-50 ${
              popup.status === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OTP;

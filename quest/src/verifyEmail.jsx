import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`/api/auth/verify-email?token=${token}`);
        toast.success(res.data.message);
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        toast.error(err.response?.data?.error || "Invalid/expired token");
        setStatus("error");
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === "pending" && <p className="text-lg">Verifying...</p>}
        {status === "success" && (
          <p className="text-green-600 text-lg">Email Verified âœ…</p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-lg">Invalid or Expired Token âŒ</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;


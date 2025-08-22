import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCommentDots } from "react-icons/fa";

const AcceptRequest = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFBFC]">
      <div className="bg-green-50 border border-green-400 rounded-xl px-8 py-10 max-w-lg w-full flex flex-col items-center">
        <div className="bg-green-500 rounded-full p-5 mb-4">
          <FaRegCommentDots className="text-white text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-green-700 mb-2 text-center">
          Müraciətiniz Qəbul Edildi!
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Müraciətiniz üçün təşəkkür edirik. 24 saat ərzində sizinlə əlaqə saxlayacağıq.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-200 hover:bg-yellow-300 transition rounded px-5 py-2 font-semibold text-black"
          >
            Ana Səhifəyə Qayıt
          </button>
          <button
            onClick={() => navigate("/connection")}
            className="bg-white border border-gray-200 hover:bg-gray-100 transition rounded px-5 py-2 font-semibold text-black"
          >
            Yeni Müraciət
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptRequest;
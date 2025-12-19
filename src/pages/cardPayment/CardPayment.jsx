import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const CardPayment = () => {
  const location = useLocation();
  const state = location.state || {};
  const status = state.status;
  const cardAmount = state.card_amount;
  const balanceUsed = state.balance_used;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-6 max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Kart ilə ödəniş (demo)</h1>
        {status && (
          <p className="mb-2 text-sm text-gray-700">
            Status: <span className="font-semibold">{status}</span>
          </p>
        )}
        {balanceUsed && (
          <p className="mb-1 text-sm text-gray-700">
            Balansdan istifadə olunan məbləğ: <span className="font-semibold">{balanceUsed} ₼</span>
          </p>
        )}
        {cardAmount && (
          <p className="mb-4 text-sm text-gray-700">
            Kart ilə ödəniləcək məbləğ: <span className="font-semibold">{cardAmount} ₼</span>
          </p>
        )}
        <p className="text-xs text-gray-500 mb-4">
          Kart inteqrasiyası hələ implement olunmayıb. Burada gələcəkdə ödəniş provayderinin forması olacaq.
        </p>
        <div className="flex gap-2 justify-end">
          <Link to="/" className="text-xs px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">
            Ana səhifə
          </Link>
          <Link to="/my-cart" className="text-xs px-3 py-2 rounded bg-yellow-300 hover:bg-yellow-400 text-black font-semibold">
            Səbətə qayıt
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardPayment;

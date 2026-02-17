import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../redux/axios";
import { notifyError, notifySuccess, extractErrorMessage } from "../../utils/notify";

export default function SellerApply() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [regions, setRegions] = useState([]);
  const [myShop, setMyShop] = useState(null);

  const [shopForm, setShopForm] = useState({
    name: "",
    description: "",
    phone: "",
    region: "",
    address: "",
    google_map_url: "",
  });

  useEffect(() => {
    const boot = async () => {
      setIsLoading(true);
      try {
        await axios.get("/users/me/");
      } catch (e) {
        navigate("/auth");
        return;
      }

      try {
        const [regionsRes, myShopRes] = await Promise.all([
          axios.get("/regions/"),
          axios.get("/shops/mine/"),
        ]);
        setRegions(regionsRes.data?.results || regionsRes.data || []);
        setMyShop(myShopRes.data);
      } catch (e) {
        // If shop doesn't exist yet, /shops/mine/ returns 404.
        try {
          const regionsRes = await axios.get("/regions/");
          setRegions(regionsRes.data?.results || regionsRes.data || []);
        } catch (err) {
          notifyError("Satıcı ol", extractErrorMessage(err, "Regionlar yüklənmədi"));
        }
        setMyShop(null);
      } finally {
        setIsLoading(false);
      }
    };

    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shopForm.phone?.trim()) {
      notifyError("Satıcı ol", "Telefon məcburidir.");
      return;
    }
    if (!shopForm.region) {
      notifyError("Satıcı ol", "Region məcburidir.");
      return;
    }
    if (!shopForm.address?.trim()) {
      notifyError("Satıcı ol", "Ünvan məcburidir.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/shops/", {
        ...shopForm,
        phone: shopForm.phone.trim(),
        address: shopForm.address.trim(),
        region: shopForm.region,
      });
      notifySuccess("Satıcı ol", "Müraciət göndərildi. Admin təsdiqindən sonra mağaza aktiv olacaq.");
      const res = await axios.get("/shops/mine/");
      setMyShop(res.data);
    } catch (err) {
      notifyError("Satıcı ol", extractErrorMessage(err, "Müraciət göndərilmədi"));
    } finally {
      setIsLoading(false);
    }
  };

  if (myShop?.is_active) {
    return (
      <div className="xl:px-24 sm:px-10 px-6 py-8">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Mağazanız aktivdir</div>
          <button
            className="bg-[#FAD800] hover:bg-yellow-300 transition rounded-lg px-4 py-2 font-semibold"
            onClick={() => navigate("/seller")}
          >
            Satıcı panelinə keç
          </button>
        </div>
      </div>
    );
  }

  if (myShop && !myShop.is_active) {
    return (
      <div className="xl:px-24 sm:px-10 px-6 py-8">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Müraciət göndərilib</div>
          <div className="text-sm text-gray-600">
            Mağazanız admin təsdiqindən sonra aktiv olacaq.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:px-24 sm:px-10 px-6 py-8">
      <div className="bg-white rounded-xl shadow p-4 max-w-xl">
        <h1 className="text-lg font-bold mb-4">Satıcı ol</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Mağaza adı"
            value={shopForm.name}
            onChange={(e) => setShopForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Telefon (WhatsApp)"
            value={shopForm.phone}
            onChange={(e) => setShopForm((p) => ({ ...p, phone: e.target.value }))}
            required
          />
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={shopForm.region}
            onChange={(e) => setShopForm((p) => ({ ...p, region: e.target.value }))}
            required
          >
            <option value="">Region (seçim)</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Ünvan"
            value={shopForm.address}
            onChange={(e) => setShopForm((p) => ({ ...p, address: e.target.value }))}
            required
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Google Map link"
            value={shopForm.google_map_url}
            onChange={(e) => setShopForm((p) => ({ ...p, google_map_url: e.target.value }))}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Təsvir"
            value={shopForm.description}
            onChange={(e) => setShopForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
          />
          <button
            className="w-full bg-[#FAD800] hover:bg-yellow-300 transition rounded-lg py-2 font-semibold disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? "Göndərilir..." : "Müraciət göndər"}
          </button>
        </form>
      </div>
    </div>
  );
}

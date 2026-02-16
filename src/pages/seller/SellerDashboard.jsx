import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../redux/axios';
import { notifyError, notifySuccess, extractErrorMessage } from '../../utils/notify';

const SellerDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');

  const [products, setProducts] = useState([]);

  const [shopForm, setShopForm] = useState({
    name: '',
    description: '',
    phone: '',
    region: '',
    address: '',
    google_map_url: '',
  });

  const [productForm, setProductForm] = useState({
    shop: '',
    category: '',
    name: '',
    slug: '',
    description: '',
    price: '',
    discount: '',
    stock: '0',
  });

  const [imageUpload, setImageUpload] = useState({
    productId: '',
    files: null,
  });

  const selectedShop = useMemo(
    () => shops.find((s) => String(s.id) === String(selectedShopId)) || null,
    [shops, selectedShopId],
  );

  const fetchRegions = async () => {
    const res = await axios.get('/regions/');
    setRegions(res.data?.results || res.data || []);
  };

  const fetchCategories = async () => {
    const res = await axios.get('/products/categories/');
    setCategories(res.data?.results || res.data || []);
  };

  const fetchMyShops = async () => {
    const meRes = await axios.get('/users/me/');
    const me = meRes.data;
    const res = await axios.get(`/shops/?owner=${me?.id}`);
    const list = res.data?.results || res.data || [];
    setShops(list);

    if (!selectedShopId && list.length) {
      setSelectedShopId(String(list[0].id));
    }
  };

  const fetchProductsForShop = async (shopId) => {
    if (!shopId) {
      setProducts([]);
      return;
    }
    const res = await axios.get(`/products/?shop=${shopId}`);
    setProducts(res.data?.results || res.data || []);
  };

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchRegions(), fetchCategories()]);
      await fetchMyShops();
    } catch (e) {
      const msg = extractErrorMessage(e, 'Məlumatlar yüklənərkən xəta baş verdi!');
      notifyError('Satıcı paneli', msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedShopId) {
      fetchProductsForShop(selectedShopId);
      setProductForm((p) => ({ ...p, shop: selectedShopId }));
    }
  }, [selectedShopId]);

  const handleCreateShop = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/shops/', {
        ...shopForm,
        region: shopForm.region || null,
      });
      notifySuccess('Mağaza', 'Mağaza yaradıldı.');
      setShopForm({ name: '', description: '', phone: '', region: '', address: '', google_map_url: '' });
      await fetchMyShops();
    } catch (err) {
      notifyError('Mağaza xətası', extractErrorMessage(err, 'Mağaza yaradılmadı!'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.shop) {
      notifyError('Məhsul', 'Əvvəl mağaza seçin.');
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + 365);

      const original = Number(productForm.price || 0);
      const final = productForm.discount ? Number(productForm.discount) : original;

      await axios.post('/products/', {
        shop: Number(productForm.shop),
        category: productForm.category ? Number(productForm.category) : null,
        service: null,
        name: productForm.name,
        slug: productForm.slug || undefined,
        description: productForm.description,
        price: original,
        discount: final,
        start_date: now.toISOString(),
        end_date: end.toISOString(),
        stock: Number(productForm.stock || 0),
      });

      notifySuccess('Məhsul', 'Məhsul yaradıldı.');
      setProductForm((p) => ({
        ...p,
        category: '',
        name: '',
        slug: '',
        description: '',
        price: '',
        discount: '',
        stock: '0',
      }));
      await fetchProductsForShop(productForm.shop);
    } catch (err) {
      notifyError('Məhsul xətası', extractErrorMessage(err, 'Məhsul yaradılmadı!'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImages = async (e) => {
    e.preventDefault();

    const productId = imageUpload.productId;
    const files = imageUpload.files;

    if (!productId) {
      notifyError('Şəkil', 'Məhsul seçin.');
      return;
    }
    if (!files || !files.length) {
      notifyError('Şəkil', 'Şəkil seçin.');
      return;
    }

    setIsLoading(true);
    try {
      // Ensure auth cookies are fresh before doing multiple unsafe requests.
      // If access is expired, the backend will refresh it server-side.
      await axios.get('/users/me/');

      // Upload sequentially to avoid refresh-token rotation races that can
      // happen with Promise.all when access token is expired.
      const fileList = Array.from(files);
      for (let idx = 0; idx < fileList.length; idx += 1) {
        const file = fileList[idx];
        const form = new FormData();
        form.append('product', productId);
        form.append('image', file);
        form.append('alt_text', file.name || `image-${idx + 1}`);
        form.append('order', String(idx));

        await axios.post('/products/images/', form, {
          withCredentials: true,
        });
      }
      notifySuccess('Şəkillər', 'Şəkillər yükləndi.');
      setImageUpload({ productId: '', files: null });
      await fetchProductsForShop(selectedShopId);
    } catch (err) {
      notifyError('Şəkil xətası', extractErrorMessage(err, 'Şəkil yüklənmədi!'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 xl:px-24 sm:px-10 px-6 py-6 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Satıcı Paneli</h1>
        <button
          className="border bg-white px-3 py-2 rounded-lg text-sm hover:bg-slate-50"
          onClick={refreshAll}
          disabled={isLoading}
        >
          {isLoading ? 'Yüklənir...' : 'Yenilə'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="text-sm text-gray-600">
          Əgər satıcı hesabınızla daxil olmamısınızsa, <Link className="text-blue-600 hover:underline" to="/auth">daxil olun</Link>.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">Mağaza yarat</h2>
          <form onSubmit={handleCreateShop} className="space-y-3">
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Mağaza adı" value={shopForm.name} onChange={(e) => setShopForm((p) => ({ ...p, name: e.target.value }))} required />
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Telefon (WhatsApp)" value={shopForm.phone} onChange={(e) => setShopForm((p) => ({ ...p, phone: e.target.value }))} />
            <select className="w-full border rounded-lg px-3 py-2" value={shopForm.region} onChange={(e) => setShopForm((p) => ({ ...p, region: e.target.value }))}>
              <option value="">Region (seçim)</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Ünvan" value={shopForm.address} onChange={(e) => setShopForm((p) => ({ ...p, address: e.target.value }))} />
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Google Map link" value={shopForm.google_map_url} onChange={(e) => setShopForm((p) => ({ ...p, google_map_url: e.target.value }))} />
            <textarea className="w-full border rounded-lg px-3 py-2" placeholder="Təsvir" value={shopForm.description} onChange={(e) => setShopForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
            <button className="w-full bg-[#FAD800] hover:bg-yellow-300 transition rounded-lg py-2 font-semibold" disabled={isLoading}>Mağaza yarat</button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">Mağazalarım</h2>
          {shops.length === 0 ? (
            <div className="text-sm text-gray-500">Hələ mağazanız yoxdur.</div>
          ) : (
            <>
              <select className="w-full border rounded-lg px-3 py-2" value={selectedShopId} onChange={(e) => setSelectedShopId(e.target.value)}>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {selectedShop && (
                <div className="mt-3 text-sm text-gray-600">
                  <div><span className="font-medium">Telefon:</span> {selectedShop.phone || '-'}</div>
                  <div><span className="font-medium">Ünvan:</span> {selectedShop.address || '-'}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">Məhsul əlavə et</h2>
          <form onSubmit={handleCreateProduct} className="space-y-3">
            <select className="w-full border rounded-lg px-3 py-2" value={productForm.shop} onChange={(e) => setProductForm((p) => ({ ...p, shop: e.target.value }))}>
              <option value="">Mağaza seç</option>
              {shops.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select className="w-full border rounded-lg px-3 py-2" value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}>
              <option value="">Kateqoriya (seçim)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Məhsul adı" value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} required />
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Slug (boş buraxıla bilər)" value={productForm.slug} onChange={(e) => setProductForm((p) => ({ ...p, slug: e.target.value }))} />
            <textarea className="w-full border rounded-lg px-3 py-2" placeholder="Təsvir" value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Orijinal qiymət" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} required />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Endirimli qiymət (seçim)" value={productForm.discount} onChange={(e) => setProductForm((p) => ({ ...p, discount: e.target.value }))} />
            </div>
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Stok" value={productForm.stock} onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} />
            <button className="w-full bg-[#FAD800] hover:bg-yellow-300 transition rounded-lg py-2 font-semibold" disabled={isLoading}>Məhsul yarat</button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">Məhsul şəkilləri yüklə</h2>
          <form onSubmit={handleUploadImages} className="space-y-3">
            <select className="w-full border rounded-lg px-3 py-2" value={imageUpload.productId} onChange={(e) => setImageUpload((p) => ({ ...p, productId: e.target.value }))}>
              <option value="">Məhsul seç</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input className="w-full" type="file" multiple accept="image/*" onChange={(e) => setImageUpload((p) => ({ ...p, files: e.target.files }))} />
            <button className="w-full bg-[#25D366] hover:bg-green-500 transition rounded-lg py-2 font-semibold text-white" disabled={isLoading}>Şəkilləri yüklə</button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Məhsullar</h2>
          <button className="text-sm text-blue-600 hover:underline" onClick={() => fetchProductsForShop(selectedShopId)} disabled={isLoading}>
            Yenilə
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-sm text-gray-500">Bu mağazada məhsul yoxdur.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((p) => (
              <div key={p.id} className="border rounded-lg p-3">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-xs text-gray-500 truncate">/{p.slug}</div>
                <div className="mt-2 text-sm">
                  <div>Qiymət: {Number(p.discount || p.price || 0).toFixed(2)} ₼</div>
                  {Number(p.discount || 0) > 0 && Number(p.price || 0) > Number(p.discount || 0) && (
                    <div className="text-xs text-gray-500 line-through">{Number(p.price || 0).toFixed(2)} ₼</div>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Şəkil sayı: {Array.isArray(p.images) ? p.images.length : 0}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;

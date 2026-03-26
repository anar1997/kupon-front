import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../redux/axios';
import { notifyError, notifySuccess, extractErrorMessage } from '../../utils/notify';

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/ə/g, 'e').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const EMPTY_PRODUCT_FORM = {
  mainCategory: '',
  subCategory: '',
  service: '',
  name: '',
  slug: '',
  slugManuallyEdited: false,
  description: '',
  price: '',
  discount: '',
  stock: '0',
};

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [authRequired, setAuthRequired] = useState(false);
  const [shopMissing, setShopMissing] = useState(false);

  const [categories, setCategories] = useState([]);

  const [myShop, setMyShop] = useState(null);

  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [productPage, setProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 9;

  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  // Attributes for the new product creation form
  const [newProductAttrs, setNewProductAttrs] = useState([]);

  // Stock editing state: { [productSlug]: newStockValue }
  const [stockEdits, setStockEdits] = useState({});
  const [stockSaving, setStockSaving] = useState({});

  // Edit request: slug of product whose request form is open, and form state
  const [editReqOpen, setEditReqOpen] = useState(null);
  const [editReqForm, setEditReqForm] = useState({});
  const [editReqSaving, setEditReqSaving] = useState(false);
  const [pendingEditSlugs, setPendingEditSlugs] = useState(new Set());

  // WhatsApp orders
  const [whatsappOrders, setWhatsappOrders] = useState([]);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [confirmingOrder, setConfirmingOrder] = useState(null);

  const [imageUpload, setImageUpload] = useState({
    productId: '',
    files: null,
  });

  const isApprovedSeller = useMemo(() => Boolean(myShop?.is_active), [myShop]);

  const stats = useMemo(() => {
    const totalSold     = products.reduce((s, p) => s + (p.sold_count  || 0), 0);
    const totalRevenue  = products.reduce((s, p) => s + (p.sold_count  || 0) * Number(p.discount || p.price || 0), 0);
    const totalStock    = products.reduce((s, p) => s + (p.stock       || 0), 0);
    const activeCount   = products.filter((p) => p.is_active).length;
    const pendingCount  = products.filter((p) => !p.is_active).length;
    return { totalSold, totalRevenue, totalStock, activeCount, pendingCount, total: products.length };
  }, [products]);

  // Derived category dropdowns
  const mainCategories = useMemo(
    () => categories.filter((c) => !c.parent),
    [categories]
  );
  const subCategories = useMemo(() => {
    if (!productForm.mainCategory) return [];
    const main = categories.find((c) => String(c.id) === String(productForm.mainCategory));
    return main?.subcategories || [];
  }, [categories, productForm.mainCategory]);
  const services = useMemo(() => {
    if (!productForm.subCategory) return [];
    const sub = subCategories.find((s) => String(s.id) === String(productForm.subCategory));
    return sub?.services || [];
  }, [subCategories, productForm.subCategory]);

  const fetchCategories = async () => {
    const res = await axios.get('/products/categories/');
    setCategories(res.data?.results || res.data || []);
  };

  const fetchMyShop = async () => {
    try {
      const res = await axios.get('/shops/mine/');
      setMyShop(res.data);
      setShopMissing(false);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) {
        setMyShop(null);
        setShopMissing(true);
        return;
      }
      throw e;
    }
  };

  const fetchMyProducts = async (shopId, page = 1) => {
    if (!shopId) {
      setProducts([]);
      setProductCount(0);
      return;
    }
    const offset = (page - 1) * PRODUCTS_PER_PAGE;
    const res = await axios.get(`/products/mine/?shop=${shopId}&limit=${PRODUCTS_PER_PAGE}&offset=${offset}`);
    setProducts(res.data?.results || res.data || []);
    setProductCount(res.data?.count ?? 0);
  };

  const fetchWhatsappOrders = async () => {
    setWhatsappLoading(true);
    try {
      const res = await axios.get('/orders/seller-whatsapp-orders/');
      setWhatsappOrders(res.data?.results || res.data || []);
    } catch (e) {
      notifyError('WhatsApp sifarişlər', extractErrorMessage(e, 'Sifarişlər yüklənmədi'));
    } finally {
      setWhatsappLoading(false);
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      setAuthRequired(false);
      setShopMissing(false);

      try {
        await axios.get('/users/me/');
      } catch (e) {
        if (e?.response?.status === 401) {
          setAuthRequired(true);
          return;
        }
        throw e;
      }

      await Promise.all([fetchCategories(), fetchMyShop()]);
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
    if (!authRequired && (shopMissing || (myShop && !myShop.is_active))) {
      navigate('/seller-apply', { replace: true });
    }
  }, [authRequired, shopMissing, myShop, navigate]);

  useEffect(() => {
    if (myShop?.id && myShop?.is_active) {
      fetchMyProducts(myShop.id, productPage);
      fetchWhatsappOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myShop?.id, myShop?.is_active]);

  useEffect(() => {
    if (myShop?.id && myShop?.is_active) {
      fetchMyProducts(myShop.id, productPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productPage]);


  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!myShop?.id) {
      notifyError('Məhsul', 'Mağaza tapılmadı.');
      return;
    }
    if (!isApprovedSeller) {
      notifyError('Məhsul', 'Məhsul əlavə etmək üçün mağazanız admin tərəfindən təsdiqlənməlidir.');
      return;
    }

    // Resolve effective category: service → subCategory → mainCategory
    const effectiveCategory =
      productForm.subCategory || productForm.mainCategory || null;

    setIsLoading(true);
    try {
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + 365);

      const original = Number(productForm.price || 0);
      const final = productForm.discount ? Number(productForm.discount) : original;

      const validAttrs = newProductAttrs.filter((a) => a.name.trim() && a.value.trim());

      await axios.post('/products/', {
        shop: Number(myShop.id),
        category: effectiveCategory ? Number(effectiveCategory) : null,
        service: productForm.service ? Number(productForm.service) : null,
        name: productForm.name,
        slug: productForm.slug || undefined,
        description: productForm.description,
        price: original,
        discount: final,
        start_date: now.toISOString(),
        end_date: end.toISOString(),
        stock: Number(productForm.stock || 0),
        ...(validAttrs.length > 0 && { attributes: validAttrs }),
      });

      notifySuccess('Məhsul', 'Məhsul yaradıldı.');
      setProductForm(EMPTY_PRODUCT_FORM);
      setNewProductAttrs([]);
      setProductPage(1);
      await fetchMyProducts(myShop.id, 1);
    } catch (err) {
      notifyError('Məhsul xətası', extractErrorMessage(err, 'Məhsul yaradılmadı!'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = async (product) => {
    const newStock = stockEdits[product.slug];
    if (newStock === undefined || newStock === '') return;
    setStockSaving((s) => ({ ...s, [product.slug]: true }));
    try {
      await axios.patch(`/products/${product.slug}/`, { stock: Number(newStock) });
      notifySuccess('Stok', 'Stok yeniləndi.');
      setStockEdits((s) => { const copy = { ...s }; delete copy[product.slug]; return copy; });
      await fetchMyProducts(myShop?.id, productPage);
    } catch (err) {
      notifyError('Stok xətası', extractErrorMessage(err, 'Stok yenilənmədi!'));
    } finally {
      setStockSaving((s) => ({ ...s, [product.slug]: false }));
    }
  };

  const openEditReqForm = (product) => {
    setEditReqOpen(product.slug);
    setEditReqForm({
      name:        product.name        || '',
      description: product.description || '',
      price:       product.price       || '',
      discount:    product.discount    || '',
      // Pre-fill with current attributes so seller can see and modify
      attributes:  (product.attributes || []).map((a) => ({ name: a.name, value: a.value })),
    });
  };

  const closeEditReqForm = () => {
    setEditReqOpen(null);
    setEditReqForm({});
  };

  const handleEditReqSubmit = async (product) => {
    setEditReqSaving(true);
    try {
      const body = {};
      if (editReqForm.name        !== product.name)        body.name        = editReqForm.name;
      if (editReqForm.description !== product.description) body.description = editReqForm.description;
      if (String(editReqForm.price)    !== String(product.price))    body.price    = editReqForm.price;
      if (String(editReqForm.discount) !== String(product.discount)) body.discount = editReqForm.discount;

      // Include attributes if they differ from current
      const currentAttrs = JSON.stringify((product.attributes || []).map((a) => ({ name: a.name, value: a.value })));
      const newAttrs = JSON.stringify((editReqForm.attributes || []).filter((a) => a.name.trim() && a.value.trim()));
      if (currentAttrs !== newAttrs) {
        body.attributes = (editReqForm.attributes || []).filter((a) => a.name.trim() && a.value.trim());
      }

      if (!Object.keys(body).length) {
        notifyError('Redaktə müraciəti', 'Heç bir dəyişiklik edilmədi.');
        return;
      }

      await axios.post(`/products/${product.slug}/request-edit/`, body);
      notifySuccess('Redaktə müraciəti', 'Müraciətiniz adminə göndərildi.');
      setPendingEditSlugs((prev) => new Set([...prev, product.slug]));
      closeEditReqForm();
    } catch (err) {
      notifyError('Redaktə xətası', extractErrorMessage(err, 'Müraciət göndərilmədi!'));
    } finally {
      setEditReqSaving(false);
    }
  };

  const handleConfirmWhatsApp = async (orderId) => {
    setConfirmingOrder(orderId);
    try {
      await axios.post(`/orders/${orderId}/confirm-whatsapp/`);
      notifySuccess('Sifariş', 'Sifariş təsdiqləndi.');
      await Promise.all([fetchWhatsappOrders(), fetchMyProducts(myShop?.id, productPage)]);
    } catch (err) {
      notifyError('Sifariş xətası', extractErrorMessage(err, 'Sifariş təsdiqlənmədi!'));
    } finally {
      setConfirmingOrder(null);
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
      await axios.get('/users/me/');

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
      await fetchMyProducts(myShop?.id, productPage);
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

      {authRequired && (
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600">
            Satıcı panelinə baxmaq üçün <Link className="text-blue-600 hover:underline" to="/auth">daxil olun</Link>.
          </div>
        </div>
      )}

      {!authRequired && !isApprovedSeller && (
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600">
            Satıcı paneli yalnız admin təsdiqindən sonra aktiv olur. <Link className="text-blue-600 hover:underline" to="/seller-apply">Satıcı ol</Link> səhifəsinə yönləndirilirsiniz.
          </div>
        </div>
      )}

      {!authRequired && isApprovedSeller && myShop && (
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="font-semibold">Mağazam</div>
          <div className="mt-2 text-sm text-gray-600">
            <div><span className="font-medium">Ad:</span> {myShop.name}</div>
            <div><span className="font-medium">Telefon:</span> {myShop.phone || '-'}</div>
            <div><span className="font-medium">Ünvan:</span> {myShop.address || '-'}</div>
          </div>
        </div>
      )}

      {/* ── Statistics ── */}
      {!authRequired && isApprovedSeller && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Ümumi məhsul',   value: stats.total,                          color: 'text-gray-700' },
            { label: 'Aktiv',          value: stats.activeCount,                    color: 'text-green-600' },
            { label: 'Gözləmədə',      value: stats.pendingCount,                   color: 'text-yellow-600' },
            { label: 'Satılan',        value: stats.totalSold,                      color: 'text-blue-600' },
            { label: 'Gəlir',          value: `${stats.totalRevenue.toFixed(2)} ₼`, color: 'text-emerald-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-400">{s.label}</span>
              <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── WhatsApp Pending Orders ── */}
      {!authRequired && isApprovedSeller && (
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Gözləyən WhatsApp Sifarişləri</h2>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={fetchWhatsappOrders}
              disabled={whatsappLoading}
            >
              {whatsappLoading ? 'Yüklənir...' : 'Yenilə'}
            </button>
          </div>
          {whatsappLoading ? (
            <div className="text-sm text-gray-500">Yüklənir...</div>
          ) : whatsappOrders.length === 0 ? (
            <div className="text-sm text-gray-500">Gözləyən WhatsApp sifarişi yoxdur.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {whatsappOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">#{order.order_number}</div>
                      <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString('az-AZ')}</div>
                    </div>
                    <button
                      className="bg-[#25D366] hover:bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-60"
                      onClick={() => handleConfirmWhatsApp(order.id)}
                      disabled={confirmingOrder === order.id}
                    >
                      {confirmingOrder === order.id ? 'Yüklənir...' : '✓ Təsdiqlə'}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {(order.items || []).map((item) => (
                      <div key={item.id} className="text-xs text-gray-700 flex justify-between">
                        <span>{item.product_name} × {item.quantity}</span>
                        <span>{Number(item.subtotal).toFixed(2)} ₼</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-right">Cəmi: {Number(order.total_amount).toFixed(2)} ₼</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!authRequired && isApprovedSeller && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* ── Add Product Form ── */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-3">Məhsul əlavə et</h2>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              {/* Main category */}
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={productForm.mainCategory}
                onChange={(e) => setProductForm((p) => ({ ...p, mainCategory: e.target.value, subCategory: '', service: '' }))}
              >
                <option value="">Əsas kateqoriya (seçim)</option>
                {mainCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Sub-category */}
              {subCategories.length > 0 && (
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={productForm.subCategory}
                  onChange={(e) => setProductForm((p) => ({ ...p, subCategory: e.target.value, service: '' }))}
                >
                  <option value="">Alt kateqoriya (seçim)</option>
                  {subCategories.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}

              {/* Service */}
              {services.length > 0 && (
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={productForm.service}
                  onChange={(e) => setProductForm((p) => ({ ...p, service: e.target.value }))}
                >
                  <option value="">Xidmət (seçim)</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}

              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Məhsul adı"
                value={productForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setProductForm((p) => ({
                    ...p,
                    name,
                    slug: p.slugManuallyEdited ? p.slug : toSlug(name),
                  }));
                }}
                required
              />

              {/* Slug — auto-filled, user can override */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Slug (URL adresi)</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
                  placeholder="auto-slug"
                  value={productForm.slug}
                  onChange={(e) =>
                    setProductForm((p) => ({ ...p, slug: e.target.value, slugManuallyEdited: true }))
                  }
                />
              </div>

              <textarea
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Təsvir"
                value={productForm.description}
                onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Orijinal qiymət"
                  value={productForm.price}
                  onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                  required
                />
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Endirimli qiymət (seçim)"
                  value={productForm.discount}
                  onChange={(e) => setProductForm((p) => ({ ...p, discount: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Stok miqdarı</label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={productForm.stock}
                  onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))}
                />
              </div>

              {/* Attributes */}
              <div className="border rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-700 mb-2">Xüsusiyyətlər (Rəng, Ölçü və s.)</div>
                {newProductAttrs.map((attr, idx) => (
                  <div key={idx} className="flex gap-1 mb-1">
                    <input
                      className="border rounded px-2 py-1 text-xs flex-1"
                      placeholder="Ad (məs. Rəng)"
                      value={attr.name}
                      onChange={(e) => setNewProductAttrs((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], name: e.target.value };
                        return next;
                      })}
                    />
                    <input
                      className="border rounded px-2 py-1 text-xs flex-1"
                      placeholder="Dəyər (məs. Qırmızı)"
                      value={attr.value}
                      onChange={(e) => setNewProductAttrs((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], value: e.target.value };
                        return next;
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setNewProductAttrs((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-red-400 hover:text-red-600 px-1 text-sm"
                    >×</button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewProductAttrs((prev) => [...prev, { name: '', value: '' }])}
                  className="text-xs text-blue-600 hover:underline mt-1"
                >+ Xüsusiyyət əlavə et</button>
              </div>

              <button
                className="w-full bg-[#FAD800] hover:bg-yellow-300 transition rounded-lg py-2 font-semibold"
                disabled={isLoading}
              >
                Məhsul yarat
              </button>
            </form>
          </div>

          {/* ── Upload Images ── */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-3">Məhsul şəkilləri yüklə</h2>
            <form onSubmit={handleUploadImages} className="space-y-3">
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={imageUpload.productId}
                onChange={(e) => setImageUpload((p) => ({ ...p, productId: e.target.value }))}
              >
                <option value="">Məhsul seç</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input
                className="w-full"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageUpload((p) => ({ ...p, files: e.target.files }))}
              />
              <button
                className="w-full bg-[#25D366] hover:bg-green-500 transition rounded-lg py-2 font-semibold text-white"
                disabled={isLoading}
              >
                Şəkilləri yüklə
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── My Products ── */}
      {!authRequired && isApprovedSeller && (
        <div className="bg-white rounded-xl shadow p-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">
              Məhsullar
              {productCount > 0 && <span className="ml-2 text-xs text-gray-400 font-normal">({productCount} ədəd)</span>}
            </h2>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => fetchMyProducts(myShop?.id, productPage)}
              disabled={isLoading}
            >
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
                  <div className="mt-2 text-xs">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.is_active ? 'Təsdiqlənib' : 'Gözləmədə'}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <div>Qiymət: {Number(p.discount || p.price || 0).toFixed(2)} ₼</div>
                    {Number(p.discount || 0) > 0 && Number(p.price || 0) > Number(p.discount || 0) && (
                      <div className="text-xs text-gray-500 line-through">{Number(p.price || 0).toFixed(2)} ₼</div>
                    )}
                  </div>
                  {/* Stock management */}
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-xs text-gray-600 whitespace-nowrap">Stok:</label>
                    <input
                      type="number"
                      min="0"
                      className="border rounded px-2 py-1 text-xs w-16"
                      value={stockEdits[p.slug] !== undefined ? stockEdits[p.slug] : p.stock}
                      onChange={(e) => setStockEdits((s) => ({ ...s, [p.slug]: e.target.value }))}
                    />
                    {stockEdits[p.slug] !== undefined && (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition disabled:opacity-60"
                        onClick={() => handleUpdateStock(p)}
                        disabled={stockSaving[p.slug]}
                      >
                        {stockSaving[p.slug] ? '...' : 'Yadda saxla'}
                      </button>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Şəkil sayı: {Array.isArray(p.images) ? p.images.length : 0}
                  </div>

                  {/* Pending edit request badge */}
                  {pendingEditSlugs.has(p.slug) && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs px-2 py-1 rounded-full">
                      <span>⏳</span> Redaktə gözləmədə
                    </div>
                  )}

                  {/* Current attributes (read-only display) */}
                  {(p.attributes || []).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.attributes.map((a) => (
                        <span key={a.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          {a.name}: {a.value}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Edit request button */}
                  <div className="mt-3 border-t pt-2">
                    {!pendingEditSlugs.has(p.slug) && (
                      <button
                        onClick={() => openEditReqForm(p)}
                        className="text-xs text-blue-600 hover:underline"
                      >Redaktə müraciəti göndər</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {productCount > PRODUCTS_PER_PAGE && (
            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                disabled={productPage === 1}
                className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
              >← Əvvəlki</button>
              <span className="text-sm text-gray-600">
                {productPage} / {Math.ceil(productCount / PRODUCTS_PER_PAGE)}
              </span>
              <button
                onClick={() => setProductPage((p) => Math.min(Math.ceil(productCount / PRODUCTS_PER_PAGE), p + 1))}
                disabled={productPage >= Math.ceil(productCount / PRODUCTS_PER_PAGE)}
                className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
              >Növbəti →</button>
            </div>
          )}
        </div>
      )}

      {/* ── Edit Request Modal ── */}
      {editReqOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={closeEditReqForm} />

          {/* Panel */}
          <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base">Redaktə müraciəti</h3>
              <button onClick={closeEditReqForm} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Ad</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={editReqForm.name || ''}
                  onChange={(e) => setEditReqForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Təsvir</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  rows={3}
                  value={editReqForm.description || ''}
                  onChange={(e) => setEditReqForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Orijinal qiymət</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="0.00"
                    value={editReqForm.price || ''}
                    onChange={(e) => setEditReqForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Endirimli qiymət</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="0.00"
                    value={editReqForm.discount || ''}
                    onChange={(e) => setEditReqForm((f) => ({ ...f, discount: e.target.value }))}
                  />
                </div>
              </div>

              {/* Attributes */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Xüsusiyyətlər</label>
                <div className="border rounded-lg p-3 space-y-2">
                  {(editReqForm.attributes || []).map((attr, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex gap-2">
                        <input
                          className="flex-1 border rounded-lg px-2 py-1.5 text-sm min-w-0"
                          placeholder="Ad (məs. Rəng)"
                          value={attr.name}
                          onChange={(e) => setEditReqForm((f) => {
                            const attrs = [...(f.attributes || [])];
                            attrs[idx] = { ...attrs[idx], name: e.target.value };
                            return { ...f, attributes: attrs };
                          })}
                        />
                        <input
                          className="flex-1 border rounded-lg px-2 py-1.5 text-sm min-w-0"
                          placeholder="Dəyər (məs. Qırmızı)"
                          value={attr.value}
                          onChange={(e) => setEditReqForm((f) => {
                            const attrs = [...(f.attributes || [])];
                            attrs[idx] = { ...attrs[idx], value: e.target.value };
                            return { ...f, attributes: attrs };
                          })}
                        />
                        <button
                          onClick={() => setEditReqForm((f) => ({
                            ...f,
                            attributes: (f.attributes || []).filter((_, i) => i !== idx),
                          }))}
                          className="text-red-400 hover:text-red-600 text-lg leading-none px-1 flex-shrink-0"
                        >×</button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditReqForm((f) => ({
                      ...f,
                      attributes: [...(f.attributes || []), { name: '', value: '' }],
                    }))}
                    className="text-sm text-blue-600 hover:underline"
                  >+ Xüsusiyyət əlavə et</button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={closeEditReqForm}
                className="flex-1 border rounded-lg py-2.5 text-sm text-gray-600 hover:bg-gray-50"
              >Bağla</button>
              <button
                onClick={() => {
                  const product = products.find((p) => p.slug === editReqOpen);
                  if (product) handleEditReqSubmit(product);
                }}
                disabled={editReqSaving}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60"
              >{editReqSaving ? 'Göndərilir...' : 'Göndər'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiHeart, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync } from '../../redux/slices/authSlice';
import axios from '../../redux/axios';

const SUGGESTION_DEBOUNCE = 300;
const SUGGESTION_LIMIT = 6;

function Header() {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const me         = useSelector(state => state.auth.me);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const cartItemsCount = useSelector(state => state.cart.itemsCount);

  const [myShop, setMyShop]             = useState(null);
  const [myShopLoading, setMyShopLoading] = useState(false);

  // ── Instant search ───────────────────────────────────────────────────────
  const [query, setQuery]               = useState('');
  const [suggestions, setSuggestions]   = useState([]);
  const [sugLoading, setSugLoading]     = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownRect, setDropdownRect] = useState(null); // position for portal

  const debounceTimer = useRef(null);
  const inputWrapRef  = useRef(null); // the search bar wrapper — used to measure position

  // Recalculate dropdown position when shown
  const updateRect = () => {
    if (inputWrapRef.current) {
      setDropdownRect(inputWrapRef.current.getBoundingClientRect());
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (inputWrapRef.current && !inputWrapRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reposition on scroll / resize
  useEffect(() => {
    if (!showDropdown) return;
    const reposition = () => updateRect();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [showDropdown]);

  // Debounced suggestions fetch
  const handleQueryChange = (val) => {
    setQuery(val);
    clearTimeout(debounceTimer.current);
    if (!val.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    updateRect();
    setSugLoading(true);
    setShowDropdown(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ search: val, limit: SUGGESTION_LIMIT });
        const res = await axios.get(`/products/?${params.toString()}`);
        setSuggestions(res.data?.results || []);
      } catch (_) {
        setSuggestions([]);
      } finally {
        setSugLoading(false);
      }
    }, SUGGESTION_DEBOUNCE);
  };

  const commitSearch = (q = query) => {
    setShowDropdown(false);
    const trimmed = q.trim();
    navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
  };

  const handleSuggestionClick = (slug) => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/service/${slug}`);
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  // ── Auth ─────────────────────────────────────────────────────────────────
  const user = { name: `${me?.first_name || ''} ${me?.last_name || ''}`.trim() };

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate('/auth');
  };

  useEffect(() => {
    const loadMyShop = async () => {
      if (!isLoggedIn) { setMyShop(null); return; }
      setMyShopLoading(true);
      try {
        const res = await axios.get('/shops/mine/');
        setMyShop(res.data);
      } catch (_) {
        setMyShop(null);
      } finally {
        setMyShopLoading(false);
      }
    };
    loadMyShop();
  }, [isLoggedIn]);

  // ── Portal dropdown ──────────────────────────────────────────────────────
  const dropdown = showDropdown && dropdownRect
    ? createPortal(
        <div
          style={{
            position: 'fixed',
            top:   dropdownRect.bottom + 4,
            left:  dropdownRect.left,
            width: dropdownRect.width,
            zIndex: 9999,
          }}
          className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        >
          {sugLoading ? (
            <div className="px-4 py-3 text-xs text-gray-400 text-center">Axtarılır...</div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-400 text-center">Nəticə tapılmadı</div>
          ) : (
            <>
              {suggestions.map((s) => {
                const img = s.images?.[0]?.image || s.shop?.images?.[0]?.image;
                const price    = Number(s.discount || s.price || 0);
                const original = Number(s.price || 0);
                const hasDiscount = original > 0 && price > 0 && price < original;
                return (
                  <button
                    key={s.id}
                    onMouseDown={() => handleSuggestionClick(s.slug)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-yellow-50 transition text-left"
                  >
                    {img ? (
                      <img src={img} alt="" className="w-9 h-9 rounded object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded bg-gray-100 shrink-0 flex items-center justify-center">
                        <FiSearch size={14} className="text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">{s.name}</div>
                      <div className="text-xs text-gray-400 truncate">{s.shop?.name}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-gray-800">{price.toFixed(2)} ₼</div>
                      {hasDiscount && (
                        <div className="text-xs text-gray-400 line-through">{original.toFixed(2)} ₼</div>
                      )}
                    </div>
                  </button>
                );
              })}
              <button
                onMouseDown={() => commitSearch()}
                className="w-full px-4 py-2.5 text-xs text-[#b89b00] font-semibold hover:bg-yellow-50 border-t border-gray-100 text-center"
              >
                Bütün nəticələri gör →
              </button>
            </>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="xl:mx-24 sm:mx-10 mx-6 border-t border-gray-200 flex flex-col sm:flex-row md:items-center justify-between gap-2 py-2">
        {/* Logo */}
        <div className="flex items-center gap-2 py-2 justify-center md:justify-start">
          <Link to="/" className="text-lg md:text-xl font-bold text-[#FAD800]">
            kuponum.az
          </Link>
        </div>

        {/* Search */}
        <div className="flex-grow max-w-lg hidden md:block" ref={inputWrapRef}>
          <div className="flex items-center border border-[#FFF281] rounded-lg bg-[#FFFDED] px-1.5 py-1.5">
            <FiSearch className="text-gray-400 ml-2 shrink-0" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commitSearch()}
              onFocus={() => { if (query.trim()) { updateRect(); setShowDropdown(true); } }}
              placeholder="Məhsul, mağaza və ya kateqoriya axtarın..."
              className="flex-1 text-xs bg-transparent outline-none px-3 py-1 text-gray-700"
            />
            {query && (
              <button onClick={clearQuery} className="text-gray-400 hover:text-gray-600 mr-1">
                <FiX size={14} />
              </button>
            )}
            <button
              onClick={() => commitSearch()}
              className="bg-[#FAD800] text-xs font-medium text-black rounded-md px-3 py-1.5 shrink-0"
              style={{ height: '28px' }}
            >
              Axtar
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 md:justify-end flex-wrap">
          {isLoggedIn ? (
            <div className="flex justify-between w-full gap-2">
              <div className="flex items-center gap-2">
                <div className="relative"><FiBell size={16} /></div>
                <FiHeart size={16} />
                <div className="relative cursor-pointer" onClick={() => navigate('/my-cart')}>
                  <FiShoppingCart size={16} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <FiUser size={16} className="cursor-pointer" onClick={() => navigate('/profile')} />
              </div>
              <div className="flex gap-2 items-center">
                {user.name && (
                  <span className="font-medium text-xs text-gray-800">{user.name}</span>
                )}
                {myShop?.is_active ? (
                  <button onClick={() => navigate('/seller')} className="border text-xs border-gray-300 rounded-md px-2 py-1 bg-white hover:bg-gray-100 font-semibold">
                    Satıcı paneli
                  </button>
                ) : (
                  <button onClick={() => navigate('/seller-apply')} disabled={myShopLoading} className="border text-xs border-gray-300 rounded-md px-2 py-1 bg-white hover:bg-gray-100 font-semibold disabled:opacity-60">
                    Satıcı ol
                  </button>
                )}
                <button onClick={handleLogout} className="border text-xs border-gray-300 rounded-md px-2 py-1 bg-white hover:bg-gray-100 font-semibold">
                  Çıxış
                </button>
              </div>
            </div>
          ) : (
            <>
              <FiHeart size={16} />
              <div className="relative cursor-pointer" onClick={() => navigate('/my-cart')}>
                <FiShoppingCart size={16} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <Link to="/auth" className="bg-[#FFEB70] hover:bg-[#FFCC00] text-black text-xs px-2 py-1 rounded-md font-semibold transition">
                Daxil ol
              </Link>
            </>
          )}
        </div>
      </div>

      {dropdown}
    </header>
  );
}

export default Header;

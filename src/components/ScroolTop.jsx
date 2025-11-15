import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Sayfa her değiştiğinde yukarı kay
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // Bu bileşen görsel olarak hiçbir şey render etmez
};

export default ScrollToTop;
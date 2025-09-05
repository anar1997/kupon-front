import React, { useRef, useEffect, useState } from "react";
import { FaTooth, FaCar, FaHeartbeat, FaWrench, FaSpa } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";

const partnerServices = [
    { name: "Stomatoloq", icon: <FaTooth size={32} className="text-blue-600" /> },
    { name: "Ortodont", icon: <FaTooth size={32} className="text-green-600" /> },
    { name: "Lazer", icon: <FaSpa size={32} className="text-pink-500" /> },
    { name: "Yağ dəyişikliyi", icon: <FaWrench size={32} className="text-yellow-600" /> },
    { name: "Motor təmiri", icon: <FaCar size={32} className="text-red-600" /> },
    { name: "Üz baxımı", icon: <FaHeartbeat size={32} className="text-purple-600" /> },
    { name: "Implantasiya", icon: <FaTooth size={32} className="text-blue-600" /> },
];

const doubledServices = [...partnerServices, ...partnerServices];

const PartnerIconsBanner = () => {
    const containerRef = useRef(null);
    const controls = useAnimation();
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.scrollWidth / 2); // İçeriğin yarısı kadar genişlik
        }
    }, []);

    useEffect(() => {
        if (width === 0) return;

        // Sonsuz kayan animasyon
        controls.start({
            x: [-0, -width],
            transition: {
                x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" },
            },
        });
    }, [width, controls]);

    return (
        <div className="overflow-hidden"> {/* justify-center kaldırıldı */}
            <div className="xl:mx-24 sm:mx-10 mx-6 bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden">
                <motion.div
                    className="flex gap-10 py-3 px-4 whitespace-nowrap"
                    ref={containerRef}
                    animate={controls}
                    style={{ cursor: "grab" }}
                    drag="x"
                    dragConstraints={{ left: -width, right: 0 }}
                    dragElastic={0.1}
                >
                    {doubledServices.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center text-center min-w-[100px]"
                        >
                            <div className="bg-white rounded-full shadow">{item.icon}</div>
                            <span className="text-sm mt-2 font-medium">{item.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>

    );
};

export default PartnerIconsBanner;

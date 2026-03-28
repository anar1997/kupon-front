import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SEOMeta from "../../components/SEOMeta";

const AboutPage = () => {
    const { about_text } = useSelector(state => state.siteSettings);

    return (
        <div className="bg-[#FAFBFC] xl:px-24 sm:px-10 px-6 min-h-screen py-8">
            <SEOMeta
                title="Haqqımızda"
                description="Kuponum haqqında — Bakı şəhərinin ən yaxşı kupon platformu."
                url="https://kuponum.az/about"
            />
            <div className="max-w-3xl mx-auto text-sm text-gray-600 mb-6">
                <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                <span className="font-semibold text-black">Haqqımızda</span>
            </div>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow border p-8">
                <h1 className="text-2xl font-bold mb-6">Haqqımızda</h1>
                {about_text ? (
                    <div
                        className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: about_text }}
                    />
                ) : (
                    <p className="text-gray-500">Məzmun hazırlanır...</p>
                )}
            </div>
        </div>
    );
};

export default AboutPage;

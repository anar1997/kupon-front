import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SEOMeta from "../../components/SEOMeta";

const TermsPage = () => {
    const { terms_content } = useSelector(state => state.siteSettings);

    return (
        <div className="bg-[#FAFBFC] xl:px-24 sm:px-10 px-6 min-h-screen py-8">
            <SEOMeta
                title="İstifadə Şərtləri"
                description="Kuponum xidmətindən istifadə şərtləri və qaydaları."
                url="https://kuponum.az/terms"
            />
            <div className="max-w-3xl mx-auto text-sm text-gray-600 mb-6">
                <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                <span className="font-semibold text-black">Şərtlər</span>
            </div>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow border p-8">
                <h1 className="text-2xl font-bold mb-6">İstifadə Şərtləri</h1>
                {terms_content ? (
                    <div
                        className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: terms_content }}
                    />
                ) : (
                    <p className="text-gray-500">Məzmun hazırlanır...</p>
                )}
            </div>
        </div>
    );
};

export default TermsPage;

import { Helmet } from 'react-helmet-async';

/**
 * SEOMeta — hər səhifəyə əlavə edilən <head> teqləri
 *
 * title       — brauzer tabında görünən başlıq
 * description — Google axtarışında səhifənin altında görünən mətn (max ~160 simvol)
 * image       — WhatsApp/Telegram/Facebook-da link paylaşanda çıxan şəkil (Open Graph)
 * url         — bu səhifənin tam URL-i (canonical + og:url üçün)
 * type        — "website" (default) və ya "article" və ya "product"
 */
const SEOMeta = ({
    title,
    description = 'Bakı şəhərinin ən yaxşı kupon və endirimlərini bir araya gətirən platform.',
    image = 'https://kuponum.az/og-image.jpg',
    url,
    type = 'website',
}) => {
    const fullTitle = title ? `${title} | Kuponum` : 'Kuponum — Bakının ən yaxşı kuponları';
    const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    return (
        <Helmet>
            {/* Əsas */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph — sosial media preview üçün */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="Kuponum" />
            <meta property="og:locale" content="az_AZ" />

            {/* Twitter Card — Twitter-də paylaşanda görünür */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEOMeta;

import { Helmet } from 'react-helmet-async';

/**
 * ProductJsonLd — Google axtarışında "rich snippet" üçün strukturlu data
 *
 * Bu komponent heç nə render etmir — yalnız <head>-ə <script> teqi əlavə edir.
 * Google bu JSON-u oxuyur və axtarış nəticəsini zənginləşdirir.
 *
 * Schema.org/Product standartı istifadə olunur:
 * https://schema.org/Product
 */
const ProductJsonLd = ({ product, slug }) => {
    const price = parseFloat(product.discount || product.price || 0);
    const originalPrice = parseFloat(product.price || 0);
    const hasDiscount = price > 0 && originalPrice > 0 && price < originalPrice;
    const image = product.images?.[0]?.image || product.shop?.images?.[0]?.image;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description || product.name,
        "image": image ? [image] : [],
        "url": `https://kuponum.az/service/${slug}`,
        "brand": {
            "@type": "Brand",
            "name": product.shop?.name || "Kuponum"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://kuponum.az/service/${slug}`,
            "priceCurrency": "AZN",
            "price": price.toFixed(2),
            // Endirim varsa orijinal qiyməti də göstəririk
            ...(hasDiscount && { "highPrice": originalPrice.toFixed(2) }),
            // Stok vəziyyəti
            "availability": product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": product.shop?.name || "Kuponum"
            }
        }
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

export default ProductJsonLd;

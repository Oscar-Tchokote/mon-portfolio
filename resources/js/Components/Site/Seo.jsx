import { Head, usePage } from '@inertiajs/react';
import { useLang } from '@/lib/i18n';

export default function Seo({ title, description, image }) {
    const { site } = usePage().props;
    const { lang, pick } = useLang();

    const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${pick(site, 'title')}`;
    const metaDescription = description || pick(site, 'meta_description');
    const metaImage = image || site.photo_url;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta head-key="description" name="description" content={metaDescription} />
            <meta head-key="og:title" property="og:title" content={fullTitle} />
            <meta head-key="og:description" property="og:description" content={metaDescription} />
            <meta head-key="og:type" property="og:type" content="website" />
            <meta head-key="og:locale" property="og:locale" content={lang === 'en' ? 'en_GB' : 'fr_FR'} />
            {metaImage && <meta head-key="og:image" property="og:image" content={metaImage} />}
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
        </Head>
    );
}

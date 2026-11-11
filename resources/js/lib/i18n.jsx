import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const dictionary = {
    fr: {
        'nav.home': 'Accueil',
        'nav.about': 'À propos',
        'nav.projects': 'Projets',
        'nav.services': 'Services',
        'nav.blog': 'Blog',
        'nav.contact': 'Contact',
        'nav.cv': 'CV',
        'nav.hire': 'Me contacter',
        'hero.available': 'Disponible pour de nouveaux projets',
        'hero.unavailable': 'Agenda complet pour le moment',
        'hero.cta_projects': 'Voir mes projets',
        'hero.cta_contact': 'Discutons de votre projet',
        'home.featured': 'Projets sélectionnés',
        'home.featured_sub': 'Quelques réalisations récentes.',
        'home.all_projects': 'Tous les projets',
        'home.services': 'Ce que je fais',
        'home.all_services': 'Services & tarifs',
        'home.stack': 'Technologies',
        'home.blog': 'Derniers articles',
        'home.all_posts': 'Tous les articles',
        'home.cta_title': 'Un projet en tête ?',
        'home.cta_text': 'Parlons-en. Je réponds généralement sous 24 heures.',
        'about.title': 'À propos',
        'about.journey': 'Parcours',
        'about.skills': 'Compétences',
        'about.work': 'Expérience',
        'about.education': 'Formation',
        'about.certification': 'Certification',
        'projects.title': 'Projets',
        'projects.subtitle': 'Une sélection de travaux, du site vitrine à l\'application métier.',
        'projects.all': 'Tous',
        'projects.empty': 'Aucun projet dans cette catégorie.',
        'projects.code': 'Code source',
        'projects.demo': 'Voir le projet',
        'projects.client': 'Client',
        'projects.year': 'Année',
        'projects.stack': 'Technologies',
        'projects.gallery': 'Galerie',
        'projects.others': 'Autres projets',
        'projects.back': 'Retour aux projets',
        'cat.web': 'Web',
        'cat.mobile': 'Mobile',
        'cat.api': 'API / Backend',
        'cat.design': 'UI / Design',
        'cat.other': 'Autre',
        'skills.frontend': 'Frontend',
        'skills.backend': 'Backend',
        'skills.mobile': 'Mobile',
        'skills.devops': 'DevOps & Cloud',
        'skills.data': 'Données & IA',
        'skills.tools': 'Outils',
        'skills.soft': 'Gestion & soft skills',
        'services.title': 'Services',
        'services.subtitle': 'Des solutions concrètes, adaptées à votre activité et à votre budget.',
        'services.packs': 'Packs',
        'services.packs_sub': 'Des formules claires pour démarrer rapidement.',
        'services.on_quote': 'Sur devis',
        'services.recommended': 'Recommandé',
        'services.choose': 'Choisir ce pack',
        'estimator.title': 'Estimez votre projet',
        'estimator.subtitle': 'Une première fourchette indicative en quelques clics. Le devis final dépend de votre cahier des charges.',
        'estimator.type': 'Type de projet',
        'estimator.feature': 'Fonctionnalités',
        'estimator.support': 'Accompagnement',
        'estimator.total': 'Estimation indicative',
        'estimator.from': 'à partir de',
        'estimator.send': 'Envoyer cette estimation',
        'estimator.pick_type': 'Choisissez un type de projet pour commencer.',
        'blog.title': 'Blog',
        'blog.subtitle': 'Notes, retours d\'expérience et tutoriels.',
        'blog.search': 'Rechercher un article…',
        'blog.empty': 'Aucun article trouvé.',
        'blog.min': 'min de lecture',
        'blog.views': 'vues',
        'blog.like': 'J\'aime',
        'blog.comments': 'Commentaires',
        'blog.no_comments': 'Aucun commentaire pour l\'instant. Soyez le premier !',
        'blog.leave_comment': 'Laisser un commentaire',
        'blog.comment_pending': 'Merci ! Votre commentaire sera visible après validation.',
        'blog.related': 'À lire aussi',
        'blog.back': 'Retour au blog',
        'blog.share': 'Partager',
        'contact.title': 'Contact',
        'contact.subtitle': 'Décrivez votre besoin, je vous réponds rapidement avec une proposition.',
        'contact.name': 'Nom complet',
        'contact.email': 'Email',
        'contact.phone': 'Téléphone / WhatsApp',
        'contact.subject': 'Sujet',
        'contact.budget': 'Budget estimé',
        'contact.budget_none': 'Je ne sais pas encore',
        'contact.message': 'Votre message',
        'contact.attachment': 'Cahier des charges (optionnel, 2 Mo max)',
        'contact.too_large': 'Fichier trop lourd ({size}). La taille maximale est de 2 Mo : compressez-le ou envoyez-le via WhatsApp.',
        'contact.send': 'Envoyer le message',
        'contact.sending': 'Envoi…',
        'contact.sent': 'Message envoyé. Merci, je reviens vers vous très vite.',
        'contact.direct': 'Ou directement',
        'contact.whatsapp': 'Écrire sur WhatsApp',
        'cv.title': 'Curriculum vitae',
        'cv.download': 'Télécharger',
        'cv.share': 'Partager',
        'cv.copied': 'Lien copié',
        'cv.open': 'Ouvrir dans un onglet',
        'cv.unavailable': 'Le CV n\'est pas encore disponible.',
        'footer.rights': 'Tous droits réservés.',
        'footer.built': 'Conçu et développé avec Laravel & React.',
        'footer.say_hello': 'Dites bonjour',
        'hero.scroll': 'Défiler',
        'hero.based': 'Basé à',
        'projects.drag': 'Voir',
        'projects.more': 'Tout le code sur GitHub',
        'projects.more_sub': 'Projets perso, expérimentations et contributions.',
        'about.statement': 'Du code propre, des interfaces claires et des applications qui restent rapides, même sur une petite connexion.',
        'contact.big': 'Construisons quelque chose',
        'contact.big_accent': 'ensemble.',
        'common.read_more': 'Lire la suite',
        'common.see': 'Voir',
        'common.close': 'Fermer',
    },
    en: {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.projects': 'Projects',
        'nav.services': 'Services',
        'nav.blog': 'Blog',
        'nav.contact': 'Contact',
        'nav.cv': 'Resume',
        'nav.hire': 'Get in touch',
        'hero.available': 'Available for new projects',
        'hero.unavailable': 'Fully booked at the moment',
        'hero.cta_projects': 'See my work',
        'hero.cta_contact': 'Let\'s talk about your project',
        'home.featured': 'Selected work',
        'home.featured_sub': 'A few recent projects.',
        'home.all_projects': 'All projects',
        'home.services': 'What I do',
        'home.all_services': 'Services & pricing',
        'home.stack': 'Technologies',
        'home.blog': 'Latest posts',
        'home.all_posts': 'All posts',
        'home.cta_title': 'Have a project in mind?',
        'home.cta_text': 'Let\'s talk. I usually reply within 24 hours.',
        'about.title': 'About',
        'about.journey': 'Journey',
        'about.skills': 'Skills',
        'about.work': 'Experience',
        'about.education': 'Education',
        'about.certification': 'Certification',
        'projects.title': 'Projects',
        'projects.subtitle': 'A selection of work, from showcase sites to business applications.',
        'projects.all': 'All',
        'projects.empty': 'No project in this category.',
        'projects.code': 'Source code',
        'projects.demo': 'Visit project',
        'projects.client': 'Client',
        'projects.year': 'Year',
        'projects.stack': 'Stack',
        'projects.gallery': 'Gallery',
        'projects.others': 'More projects',
        'projects.back': 'Back to projects',
        'cat.web': 'Web',
        'cat.mobile': 'Mobile',
        'cat.api': 'API / Backend',
        'cat.design': 'UI / Design',
        'cat.other': 'Other',
        'skills.frontend': 'Frontend',
        'skills.backend': 'Backend',
        'skills.mobile': 'Mobile',
        'skills.devops': 'DevOps & Cloud',
        'skills.data': 'Data & AI',
        'skills.tools': 'Tools',
        'skills.soft': 'Management & soft skills',
        'services.title': 'Services',
        'services.subtitle': 'Practical solutions tailored to your business and budget.',
        'services.packs': 'Packages',
        'services.packs_sub': 'Clear packages to get started fast.',
        'services.on_quote': 'On quote',
        'services.recommended': 'Recommended',
        'services.choose': 'Choose this package',
        'estimator.title': 'Estimate your project',
        'estimator.subtitle': 'A first indicative range in a few clicks. The final quote depends on your requirements.',
        'estimator.type': 'Project type',
        'estimator.feature': 'Features',
        'estimator.support': 'Support',
        'estimator.total': 'Indicative estimate',
        'estimator.from': 'from',
        'estimator.send': 'Send this estimate',
        'estimator.pick_type': 'Pick a project type to start.',
        'blog.title': 'Blog',
        'blog.subtitle': 'Notes, lessons learned and tutorials.',
        'blog.search': 'Search posts…',
        'blog.empty': 'No post found.',
        'blog.min': 'min read',
        'blog.views': 'views',
        'blog.like': 'Like',
        'blog.comments': 'Comments',
        'blog.no_comments': 'No comments yet. Be the first!',
        'blog.leave_comment': 'Leave a comment',
        'blog.comment_pending': 'Thanks! Your comment will appear once approved.',
        'blog.related': 'Read next',
        'blog.back': 'Back to blog',
        'blog.share': 'Share',
        'contact.title': 'Contact',
        'contact.subtitle': 'Describe what you need and I\'ll get back to you quickly with a proposal.',
        'contact.name': 'Full name',
        'contact.email': 'Email',
        'contact.phone': 'Phone / WhatsApp',
        'contact.subject': 'Subject',
        'contact.budget': 'Estimated budget',
        'contact.budget_none': 'Not sure yet',
        'contact.message': 'Your message',
        'contact.attachment': 'Project brief (optional, 2 MB max)',
        'contact.too_large': 'File too large ({size}). The maximum size is 2 MB: compress it or send it via WhatsApp.',
        'contact.send': 'Send message',
        'contact.sending': 'Sending…',
        'contact.sent': 'Message sent. Thank you, I\'ll get back to you shortly.',
        'contact.direct': 'Or directly',
        'contact.whatsapp': 'Message on WhatsApp',
        'cv.title': 'Resume',
        'cv.download': 'Download',
        'cv.share': 'Share',
        'cv.copied': 'Link copied',
        'cv.open': 'Open in a new tab',
        'cv.unavailable': 'The resume is not available yet.',
        'footer.rights': 'All rights reserved.',
        'footer.built': 'Designed and built with Laravel & React.',
        'footer.say_hello': 'Say hello',
        'hero.scroll': 'Scroll',
        'hero.based': 'Based in',
        'projects.drag': 'View',
        'projects.more': 'All the code on GitHub',
        'projects.more_sub': 'Side projects, experiments and contributions.',
        'about.statement': 'Clean code, clear interfaces and apps that stay fast, even on a slow connection.',
        'contact.big': 'Let\'s build something',
        'contact.big_accent': 'together.',
        'common.read_more': 'Read more',
        'common.see': 'View',
        'common.close': 'Close',
    },
};

const LanguageContext = createContext(null);

function readInitialLang() {
    try {
        const stored = localStorage.getItem('lang');
        if (stored === 'fr' || stored === 'en') {
            return stored;
        }
    } catch (e) {
        // Storage unavailable: fall back to French.
    }

    return 'fr';
}

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(readInitialLang);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const setLang = useCallback((next) => {
        setLangState(next);
        try {
            localStorage.setItem('lang', next);
        } catch (e) {
            // Ignore storage errors.
        }
    }, []);

    const value = useMemo(() => {
        const t = (key) => dictionary[lang][key] ?? dictionary.fr[key] ?? key;

        /** Pick the localized value of a bilingual field (`title_fr` / `title_en`), falling back to French. */
        const pick = (object, field) => {
            if (!object) {
                return '';
            }

            return object[`${field}_${lang}`] || object[`${field}_fr`] || object[field] || '';
        };

        return { lang, setLang, t, pick };
    }, [lang, setLang]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
    return useContext(LanguageContext);
}

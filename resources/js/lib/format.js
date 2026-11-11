export function formatFcfa(amount) {
    if (amount === null || amount === undefined || amount === '') {
        return '';
    }

    return `${new Intl.NumberFormat('fr-FR').format(Number(amount)).replace(/ | /g, ' ')} FCFA`;
}

export function formatDate(value, lang = 'fr', options = { day: 'numeric', month: 'long', year: 'numeric' }) {
    if (!value) {
        return '';
    }

    return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-FR', options).format(new Date(value));
}

export function whatsappLink(number, text = '') {
    if (!number) {
        return null;
    }

    const query = text ? `?text=${encodeURIComponent(text)}` : '';

    return `https://wa.me/${number}${query}`;
}

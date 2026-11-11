import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, Clock, Eye, Heart, Share2 } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useState } from 'react';
import Markdown from '@/Components/Site/Markdown';
import MaskText from '@/Components/Site/MaskText';
import ParallaxImage from '@/Components/Site/ParallaxImage';
import PostCard from '@/Components/Site/PostCard';
import Seo from '@/Components/Site/Seo';
import SiteLayout from '@/Layouts/SiteLayout';
import { formatDate } from '@/lib/format';
import { useLang } from '@/lib/i18n';

function ReadingProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

    return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-accent" style={{ scaleX }} />;
}

function Comments({ post, comments }) {
    const { flash } = usePage().props;
    const { lang, t } = useLang();
    const { data, setData, post: submit, processing, errors, reset } = useForm({ name: '', email: '', content: '', website: '' });

    const send = (event) => {
        event.preventDefault();
        submit(route('blog.comment', post.slug), { preserveScroll: true, onSuccess: () => reset() });
    };

    return (
        <section className="mt-16 border-t border-line pt-12" id="commentaires">
            <h2 className="display text-4xl sm:text-5xl">
                {t('blog.comments')} <span className="text-muted">({comments.length})</span>
            </h2>

            <div className="mt-8 space-y-6">
                {comments.length === 0 && <p className="text-muted">{t('blog.no_comments')}</p>}
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                            {comment.name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                            <p className="font-semibold">
                                {comment.name}{' '}
                                <span className="font-mono text-xs font-normal text-muted">{formatDate(comment.created_at, lang)}</span>
                            </p>
                            <p className="mt-1 whitespace-pre-line text-fg/85">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={send} className="card mt-10 grid gap-4 p-6 sm:grid-cols-2">
                <p className="font-semibold sm:col-span-2">{t('blog.leave_comment')}</p>
                {flash.success === 'comment_pending' && (
                    <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 sm:col-span-2">
                        <Check className="h-4 w-4" /> {t('blog.comment_pending')}
                    </p>
                )}
                <input type="text" value={data.website} onChange={(e) => setData('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <div>
                    <label className="label">{t('contact.name')}</label>
                    <input className="field" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                    <label className="label">{t('contact.email')} <span className="font-normal text-muted">(privé)</span></label>
                    <input type="email" className="field" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                    <textarea rows={4} className="field" value={data.content} onChange={(e) => setData('content', e.target.value)} required />
                    {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                </div>
                <div className="sm:col-span-2">
                    <button type="submit" disabled={processing} className="btn-primary">{t('contact.send').split(' ')[0]}</button>
                </div>
            </form>
        </section>
    );
}

export default function BlogShow({ post, comments, liked, related }) {
    const { lang, t } = useLang();
    const [copied, setCopied] = useState(false);

    const like = () => {
        if (!liked) {
            router.post(route('blog.like', post.slug), {}, { preserveScroll: true, only: ['post', 'liked'] });
        }
    };

    const share = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: post.title, url });
                return;
            } catch (e) {
                // Cancelled: fall back to copy.
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            // Clipboard unavailable.
        }
    };

    return (
        <SiteLayout>
            <Seo title={post.title} description={post.excerpt} image={post.cover_url} />
            <ReadingProgress />

            <article className="container-site pb-20 pt-10 sm:pt-16">
                <div className="mx-auto max-w-3xl">
                <Link href={route('blog.index')} className="link-underline inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-muted hover:text-fg">
                    <ArrowLeft className="h-4 w-4" /> {t('blog.back')}
                </Link>

                <header className="mt-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted">
                        <span>{formatDate(post.published_at, lang)}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.reading_minutes} {t('blog.min')}</span>
                        <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views} {t('blog.views')}</span>
                    </div>
                    <h1 className="display mt-6 text-5xl leading-[0.98] sm:text-7xl">
                        <MaskText immediate lines={[post.title]} />
                    </h1>
                    {post.excerpt && <p className="mt-5 text-xl leading-relaxed text-muted">{post.excerpt}</p>}
                    {post.tags?.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Link key={tag} href={route('blog.index', { tag })} className="chip hover:text-fg">#{tag}</Link>
                            ))}
                        </div>
                    )}
                </header>

                </div>

                {post.cover_url && <ParallaxImage src={post.cover_url} className="mx-auto mt-14 aspect-[21/9] w-full max-w-6xl" />}

                <div className="mx-auto max-w-3xl">
                <Markdown className="prose-lg mt-10">{post.content}</Markdown>

                <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-8">
                    <button type="button" onClick={like} disabled={liked} className={`btn-ghost ${liked ? 'border-accent text-accent' : ''}`}>
                        <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} /> {post.likes} · {t('blog.like')}
                    </button>
                    <button type="button" onClick={share} className="btn-ghost">
                        {copied ? <Check className="h-4 w-4 text-accent" /> : <Share2 className="h-4 w-4" />}
                        {copied ? t('cv.copied') : t('blog.share')}
                    </button>
                </div>

                <Comments post={post} comments={comments} />
                </div>
            </article>

            {related.length > 0 && (
                <section className="border-t border-line py-20">
                    <div className="container-site">
                        <h2 className="display mb-12 text-5xl sm:text-6xl">{t('blog.related')}</h2>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((item) => <PostCard key={item.id} post={item} />)}
                        </div>
                    </div>
                </section>
            )}
        </SiteLayout>
    );
}

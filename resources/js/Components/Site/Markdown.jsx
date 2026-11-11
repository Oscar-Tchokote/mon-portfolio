import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Markdown({ children, className = '' }) {
    if (!children) {
        return null;
    }

    return (
        <div className={`prose-site ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ node, ...props }) => {
                        const external = props.href?.startsWith('http');
                        return <a {...props} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} />;
                    },
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-muted shadow-sm transition duration-150 ease-in-out hover:bg-line/40 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-25 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

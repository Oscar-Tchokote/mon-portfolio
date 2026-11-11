export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-full border border-transparent bg-fg px-5 py-2.5 text-sm font-semibold text-bg transition duration-150 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2  ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

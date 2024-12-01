export const KeyboardButton = ({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) => (
    <div className="absolute flex items-center justify-center gap-2" style={style}>
        {children}
    </div>
);

const TransitionEffect = () => {
    return (
        <div className="fixed inset-0 z-30 flex items-end justify-center pointer-events-none">
            <div
                className="h-screen w-full pointer-events-none hl-fade-pulse"
                style={{
                    background: "linear-gradient(to top, rgba(255, 170, 0, 0.3) 0%, rgba(255, 85, 0, 0.0) 100%)"
                }}
            />
        </div>
    );
};

export default TransitionEffect;

const TransitionEffect = () => {
    return (
        <div className="fixed inset-0 z-30 flex items-end justify-center pointer-events-none">
            <div className="h-screen w-full bg-orange-600/5 pointer-events-none hl-fade-in"
                 style={{
                     background: "linear-gradient(to top, rgba(255, 100, 0, 0.1) 0%, transparent 100%)"
                 }} />
        </div>
    );
};

export default TransitionEffect;
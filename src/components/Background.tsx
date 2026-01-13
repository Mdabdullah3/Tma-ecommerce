import React from 'react';

const Background = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Deep Blue Glow (Left) */}
            <div className="absolute top-0 left-[-20%] w-[80%] h-full bg-blue-900/40 blur-[120px] rounded-full" />
            {/* Amber/Gold Glow (Right) */}
            <div className="absolute top-0 right-[-20%] w-[80%] h-full bg-amber-900/40 blur-[120px] rounded-full" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default Background;
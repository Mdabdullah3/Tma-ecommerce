import React from 'react';
import { motion } from 'framer-motion';

const Background = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#020205]">
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120vw] h-[50vh] bg-gradient-radial from-green-500/80 via-[#050505] to-transparent blur-xl" />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                    x: [0, 50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[1%] left-[-20%] w-[80vw] h-full bg-green-500/30 blur-[100px] rounded-full mix-blend-screen"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, -30, 0],
                    opacity: [0.2, 0.5, 0.2] // Increased opacity
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[10%] right-[-20%] w-[80vw] h-[80vh] bg-rose-500/30 blur-[120px] rounded-full mix-blend-screen"
            />

            {/* 3. GOLDEN ACCENT (Matches your NFT Cards) */}
            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-t from-amber-900/20 to-transparent blur-3xl"
            />

            {/* 4. THE GRID (More visible now) */}
            {/* <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" /> */}

            {/* 5. NOISE (Texture) */}
            {/* <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" /> */}
        </div>
    );
};

export default Background;
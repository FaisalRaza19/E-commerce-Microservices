"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";

const AccessDeniedPage = () => {
    const { signOut } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        try {
            setLoading(true);
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-black">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-700/30 via-transparent to-transparent animate-pulse" />

            {/* Floating background blobs */}
            <div className="absolute -top-10 left-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl animate-float-slower" />

            {/* Main content card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-gray-700 dark:bg-gray-800/40 shadow-2xl rounded-3xl p-10 text-center max-w-md w-full"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-6"
                >
                    <ShieldAlert className="w-16 h-16 text-red-400 drop-shadow-lg animate-pulse" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-white dark:text-gray-100 mb-3"
                >
                    Access Denied
                </motion.h1>

                <p className="text-white/80 dark:text-gray-300 text-lg mb-8">
                    You don’t have permission to view this page. Please sign out or go
                    back to the login page.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* Sign Out Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSignOut}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-white text-purple-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-purple-100 transition duration-200 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" />
                                Signing out...
                            </>
                        ) : (
                            <>
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>

            {/* Floating animation keyframes */}
            <style jsx global>{`
        @keyframes float-slow {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes float-slower {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(30px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 12s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default AccessDeniedPage;

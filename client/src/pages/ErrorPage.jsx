import { useRouteError, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, RefreshCcw, AlertCircle } from "lucide-react";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center"
            >
                <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    {error?.statusText || error?.message || "An unexpected error occurred. Don't worry, even AI has bad days."}
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try Again
                    </button>

                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 italic text-slate-400 text-sm">
                    "The best way to predict the future is to fix the current error." — Learnify AI
                </div>
            </motion.div>
        </div>
    );
}

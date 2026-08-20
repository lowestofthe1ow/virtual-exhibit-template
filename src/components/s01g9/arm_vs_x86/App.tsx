import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./LandingPage.tsx";
import CategoryPage from "./CategoryPage.tsx";
import "../../../styles/s01g9/arm_vs_x86/index.css";

type View = { type: "landing" } | { type: "categories"; arch: "arm" | "x86" };

function App() {
    const [view, setView] = useState<View>({ type: "landing" });

    return (
        <AnimatePresence mode="wait">
            {view.type === "landing" && (
                <LandingPage
                    key="landing"
                    onSelect={(arch) => setView({ type: "categories", arch })}
                />
            )}
            {view.type === "categories" && (
                <CategoryPage
                    key={`cat-${view.arch}`}
                    arch={view.arch}
                    onBack={() => setView({ type: "landing" })}
                />
            )}
        </AnimatePresence>
    );
}

export default App;

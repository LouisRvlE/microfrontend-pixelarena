import React, { Suspense } from "react";
import "./App.css";
import safeLazy from "./safeLazy";
import loadRemoteEntry from "./loadRemote";

const Header = safeLazy(
    () =>
        loadRemoteEntry(
            "http://localhost:8056/remoteEntry.js",
            "mfeHeader",
            "./Navbar",
        ),
    { name: "Header" },
);
const Lobby = safeLazy(
    () =>
        loadRemoteEntry(
            "http://localhost:8057/remoteEntry.js",
            "mfeLobby",
            "./Lobby",
        ),
    { name: "Lobby" },
);
const Catalog = safeLazy(
    () =>
        loadRemoteEntry(
            "http://localhost:8058/remoteEntry.js",
            "mfeCatalog",
            "./Catalog",
        ),
    { name: "Catalog" },
);
const Cart = safeLazy(
    () =>
        loadRemoteEntry(
            "http://localhost:8059/remoteEntry.js",
            "mfeCart",
            "./Cart",
        ),
    { name: "Cart" },
);

function LoadingFallback({ name }) {
    return <div className="loading-fallback">Chargement {name}...</div>;
}

function App() {
    return (
        <div className="shell">
            <Suspense fallback={<LoadingFallback name="Header" />}>
                <Header />
            </Suspense>

            <main className="shell-content">
                <div className="content-grid-3">
                    <section className="section">
                        <Suspense fallback={<LoadingFallback name="Lobby" />}>
                            <Lobby />
                        </Suspense>
                    </section>

                    <section className="section">
                        <Suspense fallback={<LoadingFallback name="Catalog" />}>
                            <Catalog />
                        </Suspense>
                    </section>

                    <section className="section">
                        <Suspense fallback={<LoadingFallback name="Cart" />}>
                            <Cart />
                        </Suspense>
                    </section>
                </div>
            </main>

            <footer className="shell-footer">
                <p>
                    Shell (8055) | Header (8056) | Lobby (8057) | Catalog (8058)
                    | Cart (8059)
                </p>
            </footer>
        </div>
    );
}

export default App;

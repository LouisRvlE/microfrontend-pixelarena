import React from "react";

// Wrap dynamic imports so that a rejected import resolves to a
// fallback component instead of letting the lazy promise reject.
export default function safeLazy(factory, options = {}) {
    const {
        name = "remote",
        timeout = 5000,
        Fallback = ({ name }) => (
            <div className="loading-fallback">{`Impossible de charger ${name}`}</div>
        ),
    } = options;

    const LazyComp = React.lazy(() => {
        let timeoutId;

        const wrapped = new Promise((resolve, reject) => {
            factory()
                .then((mod) => {
                    clearTimeout(timeoutId);
                    resolve(mod);
                })
                .catch((err) => {
                    clearTimeout(timeoutId);
                    reject(err);
                });

            timeoutId = setTimeout(() => {
                reject(new Error(`Import timeout for ${name}`));
            }, timeout);
        });

        return wrapped.catch((err) => {
            // log to console to help debugging
            // eslint-disable-next-line no-console
            console.error(`safeLazy: failed to load ${name}:`, err);
            return {
                default: () => <Fallback name={name} error={err} />,
            };
        });
    });

    return LazyComp;
}

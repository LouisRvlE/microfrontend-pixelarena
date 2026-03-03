// Dynamic Module Federation loader with script injection and timeout
export function loadRemoteEntry(remoteUrl, scope, module) {
    return new Promise((resolve, reject) => {
        let timedOut = false;
        const timeout = setTimeout(() => {
            timedOut = true;
            reject(new Error(`Loading remoteEntry timed out: ${remoteUrl}`));
        }, 5000);

        // If remote already initialized, skip adding script
        if (window[scope]) {
            clearTimeout(timeout);
            initAndGet().then(resolve, reject);
            return;
        }

        const script = document.createElement("script");
        script.src = remoteUrl;
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => {
            if (timedOut) return;
            clearTimeout(timeout);
            initAndGet().then(resolve, reject);
        };
        script.onerror = (err) => {
            clearTimeout(timeout);
            reject(new Error(`Failed to load script ${remoteUrl}`));
        };

        document.head.appendChild(script);

        async function initAndGet() {
            try {
                // Initialize shared scope. This is required for MF and provided by webpack.
                // eslint-disable-next-line no-undef
                await __webpack_init_sharing__("default");
                const container = window[scope];
                if (!container)
                    throw new Error(`Container ${scope} not found on window`);
                // Initialize the container with the shared scope
                // eslint-disable-next-line no-undef
                await container.init(__webpack_share_scopes__.default);
                const factory = await container.get(module);
                const Module = factory();
                return Module;
            } catch (err) {
                throw err;
            }
        }
    });
}

export default loadRemoteEntry;

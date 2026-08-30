const storage = {
    getItem(key) {
        return Promise.resolve(
            window.localStorage.getItem(key)
        );
    },

    setItem(key, value) {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
    },

    removeItem(key) {
        window.localStorage.removeItem(key);
        return Promise.resolve();
    },
};

export default storage;
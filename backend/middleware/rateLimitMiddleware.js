const createRateLimiter = ({ windowMs, max, message }) => {
    const clients = new Map();

    return (req, res, next) => {
        const key = req.ip || req.socket?.remoteAddress || "unknown";
        const now = Date.now();
        const current = clients.get(key);

        if (!current || now - current.startedAt >= windowMs) {
            clients.set(key, { startedAt: now, count: 1 });
            return next();
        }

        if (current.count >= max) {
            return res.status(429).json({ message });
        }

        current.count += 1;
        return next();
    };
};

module.exports = createRateLimiter;

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.jwt) {
            console.warn("⚠️ No token found in cookies.");
            return res.status(401).json({ error: "You are not authenticated!" });
        }

        const token = req.cookies.jwt; // ✅ Ensure cookies are parsed correctly
        console.log("✅ Token received:", token);

        jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
            if (err) {
                console.error("❌ Token verification failed:", err.message);
                return res.status(403).json({ error: "Token is invalid or expired." });
            }

            console.log("✅ Token verified successfully:", payload);
            req.userId = payload.userId;
            next();
        });

    } catch (error) {
        console.error("❌ Error in verifyToken middleware:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

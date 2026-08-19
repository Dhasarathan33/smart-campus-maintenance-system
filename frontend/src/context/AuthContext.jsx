import { useState } from "react";
import { AuthContext } from "./authContextValue";

// Create Authentication Context
// Provider Component
function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

import {useMicVADWrapper} from "./hooks/useMicVADWrapper";
import {useState} from "react";

const App = () => {
    const [loading, setLoading] = useState(true);

    useMicVADWrapper(setLoading);

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
            }}>
                <h1>MIC ON</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>MIC OFF</h1>
        </div>
    );
}

export default App;


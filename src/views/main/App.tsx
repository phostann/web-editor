import React, {useEffect} from 'react';
import './App.css';

function App() {
    useEffect(() => {
        window.location.replace("/app.html");
    }, []);
    return <div>main</div>;
}

export default App;

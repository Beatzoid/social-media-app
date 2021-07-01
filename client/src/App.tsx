import { BrowserRouter as Router, Route } from "react-router-dom";

import PageRenderer from "./PageRenderer";

function App() {
    return (
        <Router>
            <input type="checkbox" id="theme" />
            <div className="App">
                <div className="main">
                    <Route path="/:page" component={PageRenderer} />
                    <Route path="/:page/:id" component={PageRenderer} />
                </div>
            </div>
        </Router>
    );
}

export default App;

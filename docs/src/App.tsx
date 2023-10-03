import "@statflo/ui/index.css";

import { ConversationProvider } from "./providers/ConversationProvider";
import { WidgetProvider } from "./providers/WidgetProvider";
import Conversations from "./pages/Conversations";
import Navigation from "./containers/Navigation";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import WidgetManager from "./pages/WidgetManager";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <ConversationProvider>
      <WidgetProvider>
        <Router basename="/widget-sdk">
          <div className="w-screen h-screen overflow-hidden flex">
            <Navigation />
            <div className="flex-1 block h-screen">
              <Routes>
                <Route path="/" element={<Navigate to="/conversations" />} />
                <Route path="/conversations" element={<Conversations />} />
                <Route path="/widget-manager" element={<WidgetManager />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </Router>
      </WidgetProvider>
    </ConversationProvider>
  );
};

export default App;

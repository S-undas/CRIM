import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";

const App = () => {
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              summary={summary}
              setSummary={setSummary}
              customers={customers}
              setCustomers={setCustomers}
            />
          }
        />
        <Route
          path="/customers"
          element={<Customers customers={customers} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
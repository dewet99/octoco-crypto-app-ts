import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './Dashboard.tsx';
import { CoinDetail } from './CoinDetail';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
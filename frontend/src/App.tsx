import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PaletteCreate from './pages/PaletteCreate';
import PaletteAnswer from './pages/PaletteAnswer';
import PrismCreate from './pages/PrismCreate';
import PrismAnswer from './pages/PrismAnswer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-lumi-beige text-lumi-dark font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/palette-of-me" element={<PaletteCreate />} />
          <Route path="/tools/palette-of-me/:id" element={<PaletteAnswer />} />
          <Route path="/tools/prism-of-me" element={<PrismCreate />} />
          <Route path="/tools/prism-of-me/:id" element={<PrismAnswer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

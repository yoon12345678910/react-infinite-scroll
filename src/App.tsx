import { IntersectionObserver, Windowing } from './components/infinite-scroll/index';

function App() {
  return (
    <div className="grid grid-flow-col auto-cols-max gap-6 px-6 h-screen w-full text-sm">
      <IntersectionObserver />
      <Windowing />
    </div>
  );
}

export default App;

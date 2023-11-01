import { InfiniteScrollByIntersectionObserver } from './components/infinite-scroll/index';

function App() {
  return (
    <div className="grid grid-flow-col auto-cols-max gap-6 h-screen w-full text-sm">
      <InfiniteScrollByIntersectionObserver />
    </div>
  );
}

export default App;

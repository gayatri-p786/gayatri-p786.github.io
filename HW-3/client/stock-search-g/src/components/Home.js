import SearchBar from './SearchBar';
import './styles.css';

function Home() {
    return (
      <div className="text-center heading">
        <h1>Stock Search</h1>
        <SearchBar />
        {/* Other content */}
      </div>
    );
}

export default Home;
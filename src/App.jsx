import WeatherFetch from "./components/weatherfetch"
import './style.scss'
import { MdSunny } from "react-icons/md";
import CloudVideo from "./video/bgvideo.mp4";
function App() {

  return (
    <>
      <div className="video-background">
        <video autoPlay muted loop>
          <source src={CloudVideo} type="video/mp4" />
        </video>
      </div>
      <div className="weather-app">
        <header className="weather-header">
          <MdSunny className="logo" />
          <h1>Vejrudsigt</h1>
          <p>Tjek vejret i din by</p>
        </header>
        <main className="weather-content">
          <div className="weather-display">
            <WeatherFetch />
          </div>
        </main>
      </div>
    </>
  )
}

export default App
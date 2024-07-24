import WeatherPage from "./page/WeatherPage"
import Index from "./page/Index"
import { ABOUTME_ROUTE, KEYBOARDTRAINER_ROUTE, LETTER_ROUTE, MAIN_ROUTE, MUSIC_ROUTE, PYATNASHKU_ROUTE, STARMAP_ROUTE, WEATHER_ROUTE } from "./utils/const"
import LetterPage from "./page/LetterPage"
import Pyatnashki from "./page/Pyatnashki"
import KeyboardTrainer from "./page/KeyboardTrainer"
import MusicPlayer from "./page/MusicPlayer"
import track1 from './components/MusicPlayer/sound/track1.mp3';
import track2 from './components/MusicPlayer/sound/track2.mp3';
import track3 from './components/MusicPlayer/sound/track3.mp3';
import track4 from './components/MusicPlayer/sound/track4.mp3';
import track5 from './components/MusicPlayer/sound/track5.mp3';
import track6 from './components/MusicPlayer/sound/track6.mp3';
import AboutMe from "./page/AboutMe"
import StarMap from "./page/StarMap"

  const initialTracks = [
    { id: 1, title: 'Track 1', artist: 'Artist 1', src: track1 },
    { id: 2, title: 'Track 2', artist: 'Artist 2', src: track2 },
    { id: 3, title: 'Track 3', artist: 'Artist 3', src: track3 },
    { id: 4, title: 'Track 4', artist: 'Artist 4', src: track4 },
    { id: 5, title: 'Track 5', artist: 'Artist 5', src: track5 },
    { id: 6, title: 'Track 6', artist: 'Artist 6', src: track6 },
  ];
  
export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: Index,
    },
    {
        path: WEATHER_ROUTE,
        Component: WeatherPage,
    },
    {
        path: LETTER_ROUTE,
        Component: LetterPage,
    },
    {
        path: PYATNASHKU_ROUTE,
        Component: Pyatnashki,
    },
    {
        path: KEYBOARDTRAINER_ROUTE,
        Component: KeyboardTrainer,
    },
    {
        path: MUSIC_ROUTE,
        Component: MusicPlayer,
        tracks: initialTracks
    },
    {
        path: STARMAP_ROUTE,
        Component: StarMap,
    },
    {
        path: ABOUTME_ROUTE,
        Component: AboutMe,
    },
]
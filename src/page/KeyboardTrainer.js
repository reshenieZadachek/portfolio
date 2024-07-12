import React, { useState, useEffect, useRef } from 'react';
import '../components/KeyboardTrainer/KeyboardTrainer.css';

const KeyboardTrainer = () => {
  const [before, setBefore] = useState('');
  const [current, setCurrent] = useState('');
  const [after, setAfter] = useState('');
  const [startText, setStartText] = useState("Съешь еще этих мягких французских булок, да выпей чаю");
  const [starTraning, setStarTraning] = useState(false);
  const [timeStmp, setTimeStmp] = useState(0);
  const [tmrOn, setTmrOn] = useState(false);
  const [correctSimbols, setCorrectSimbols] = useState(0);
  const [incorrectSimbols, setIncorrectSimbols] = useState(0);
  const [textUploaded, setTextUploaded] = useState(0);
  const [allTime, setAllTime] = useState(0);
  const [allSimbols, setAllSimbols] = useState(0);
  const [allIncorrect, setAllIncorrect] = useState(0);
  const [allAccuracy, setAllAccuracy] = useState(0);
  const [allSpm, setAllSpm] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [showMenu, setShowMenu] = useState(true);
  const [showInterface, setShowInterface] = useState(false);
  const [showStat, setShowStat] = useState(false);
  const [interfaceHeight, setInterfaceHeight] = useState('45vh');
  const [showCustomText, setShowCustomText] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOverallStats, setShowOverallStats] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);

  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    placetext();
  }, []);

  useEffect(() => {
    if (tmrOn) {
      timerRef.current = setInterval(() => {
        setTimeStmp(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [tmrOn]);

  useEffect(() => {
    if (showInterface) {
      window.addEventListener('keydown', handleKeyPress);
      window.addEventListener('keyup', handleKeyUp);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [showInterface, current, shiftPressed]);

  useEffect(() => {
    if (after.length === 0 && current.length === 0 && starTraning) {
      console.log("Завершение тренировки");
      endtraning();
    }
  }, [after, current, starTraning]);
  const handleKeyUp = (event) => {
    if (event.key === 'Shift') {
      setShiftPressed(false);
    }
  };
  const placetext = () => {
    const cleanText = startText.replace(/(\r\n|\n|\r)/gm, " ");
    setBefore('');
    setCurrent(cleanText.charAt(0));
    setAfter(cleanText.substring(1, cleanText.length));
  };

  const startraning = () => {
    setCorrectSimbols(0);
    setIncorrectSimbols(0);
    setStarTraning(true);
    setTmrOn(true);
    setShowInterface(true);
    setShowMenu(false);
    setShowStat(false);
    setInterfaceHeight('45vh');
    setTimeStmp(0);
    placetext();
  };

  const endtraning = () => {
    console.log("Функция endtraning вызвана");
    setStarTraning(false);
    setTmrOn(false);
    setShowStat(true);
    setShowInterface(false);
    setShowMenu(false);
    setRounds(prev => prev + 1);
    setAllTime(prev => prev + timeStmp);
    setAllSimbols(prev => prev + correctSimbols);
    setAllIncorrect(prev => prev + incorrectSimbols);
    const accuracy = incorrectSimbols === 0 ? 100 : Math.floor((100 - ((incorrectSimbols / correctSimbols) * 100)) * 100) / 100;
    setAllAccuracy(prev => prev + accuracy);
    const spm = Math.floor(correctSimbols / (timeStmp / 60) * 100) / 100;
    setAllSpm(prev => prev + spm);
  };

  const handleKeyPress = (event) => {
    if (starTraning) {
      const pressedKey = event.key;
      if (pressedKey === 'Shift') {
        setShiftPressed(true);
      } else if (shiftPressed && (pressedKey === '.' || pressedKey === current.toLowerCase())) {
        if (pressedKey === '.' && current === ',') {
          nextChar();
          setCorrectSimbols(prev => prev + 1);
        } else if (pressedKey === current.toLowerCase()) {
          nextChar();
          setCorrectSimbols(prev => prev + 1);
        } else {
          setIncorrectSimbols(prev => prev + 1);
        }
        setShiftPressed(false);
      } else if (pressedKey === current) {
        nextChar();
        setCorrectSimbols(prev => prev + 1);
      } else {
        setIncorrectSimbols(prev => prev + 1);
      }
    }
  };

  const nextChar = () => {
    setBefore(prev => prev + current);
    if (after.length > 0) {
      setCurrent(after.charAt(0));
      setAfter(prev => prev.substring(1));
    } else {
      setCurrent('');
    }
  };

  const handleCustomText = () => {
    setShowMenu(false);
    setShowCustomText(true);
  };

  const handleSettings = () => {
    setShowMenu(false);
    setShowSettings(true);
  };

  const handleOverallStats = () => {
    setShowMenu(false);
    setShowOverallStats(true);
  };

  const handleBackToMenu = () => {
    setShowCustomText(false);
    setShowSettings(false);
    setShowOverallStats(false);
    setShowMenu(true);
  };
  const getHighlightedKeys = () => {
    if (!current) return [];
    
    const keys = [];
    
    const keyMap = {
      'ё': 'ё', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0', '-': '-', '=': '=',
      'й': 'й', 'ц': 'ц', 'у': 'у', 'к': 'к', 'е': 'е', 'н': 'н', 'г': 'г', 'ш': 'ш', 'щ': 'щ', 'з': 'з', 'х': 'х', 'ъ': 'ъ',
      'ф': 'ф', 'ы': 'ы', 'в': 'в', 'а': 'а', 'п': 'п', 'р': 'р', 'о': 'о', 'л': 'л', 'д': 'д', 'ж': 'ж', 'э': 'э',
      'я': 'я', 'ч': 'ч', 'с': 'с', 'м': 'м', 'и': 'и', 'т': 'т', 'ь': 'ь', 'б': 'б', 'ю': 'ю', '.': '.',
      ' ': 'пробел'
    };
  
    const shiftKeys = {
      'А': 'а', 'Б': 'б', 'В': 'в', 'Г': 'г', 'Д': 'д', 'Е': 'е', 'Ё': 'ё', 'Ж': 'ж', 'З': 'з', 'И': 'и',
      'Й': 'й', 'К': 'к', 'Л': 'л', 'М': 'м', 'Н': 'н', 'О': 'о', 'П': 'п', 'Р': 'р', 'С': 'с', 'Т': 'т',
      'У': 'у', 'Ф': 'ф', 'Х': 'х', 'Ц': 'ц', 'Ч': 'ч', 'Ш': 'ш', 'Щ': 'щ', 'Ъ': 'ъ', 'Ы': 'ы', 'Ь': 'ь',
      'Э': 'э', 'Ю': 'ю', 'Я': 'я', ',': '.'
    };
  
    if (shiftKeys[current]) {
      if (!shiftPressed) {
        keys.push('shift');
      } else {
        keys.push(shiftKeys[current]);
      }
    } else if (keyMap[current]) {
      keys.push(keyMap[current]);
    }
  
    return keys;
  };
  const renderKeyboard = () => {
    const highlightedKeys = getHighlightedKeys();
  
    return (
      <div className="keyboard">
        <div className="keyboard-row">
          <div className={`key ${highlightedKeys.includes('ё') ? 'highlighted' : ''}`}>ё</div>
          <div className={`key ${highlightedKeys.includes('1') ? 'highlighted' : ''}`}>1</div>
          <div className={`key ${highlightedKeys.includes('2') ? 'highlighted' : ''}`}>2</div>
          <div className={`key ${highlightedKeys.includes('3') ? 'highlighted' : ''}`}>3</div>
          <div className={`key ${highlightedKeys.includes('4') ? 'highlighted' : ''}`}>4</div>
          <div className={`key ${highlightedKeys.includes('5') ? 'highlighted' : ''}`}>5</div>
          <div className={`key ${highlightedKeys.includes('6') ? 'highlighted' : ''}`}>6</div>
          <div className={`key ${highlightedKeys.includes('7') ? 'highlighted' : ''}`}>7</div>
          <div className={`key ${highlightedKeys.includes('8') ? 'highlighted' : ''}`}>8</div>
          <div className={`key ${highlightedKeys.includes('9') ? 'highlighted' : ''}`}>9</div>
          <div className={`key ${highlightedKeys.includes('0') ? 'highlighted' : ''}`}>0</div>
          <div className={`key ${highlightedKeys.includes('-') ? 'highlighted' : ''}`}>-</div>
          <div className={`key ${highlightedKeys.includes('=') ? 'highlighted' : ''}`}>=</div>
        </div>
        <div className="keyboard-row">
          <div className="key wide">tab</div>
          <div className={`key ${highlightedKeys.includes('й') ? 'highlighted' : ''}`}>й</div>
          <div className={`key ${highlightedKeys.includes('ц') ? 'highlighted' : ''}`}>ц</div>
          <div className={`key ${highlightedKeys.includes('у') ? 'highlighted' : ''}`}>у</div>
          <div className={`key ${highlightedKeys.includes('к') ? 'highlighted' : ''}`}>к</div>
          <div className={`key ${highlightedKeys.includes('е') ? 'highlighted' : ''}`}>е</div>
          <div className={`key ${highlightedKeys.includes('н') ? 'highlighted' : ''}`}>н</div>
          <div className={`key ${highlightedKeys.includes('г') ? 'highlighted' : ''}`}>г</div>
          <div className={`key ${highlightedKeys.includes('ш') ? 'highlighted' : ''}`}>ш</div>
          <div className={`key ${highlightedKeys.includes('щ') ? 'highlighted' : ''}`}>щ</div>
          <div className={`key ${highlightedKeys.includes('з') ? 'highlighted' : ''}`}>з</div>
          <div className={`key ${highlightedKeys.includes('х') ? 'highlighted' : ''}`}>х</div>
          <div className={`key ${highlightedKeys.includes('ъ') ? 'highlighted' : ''}`}>ъ</div>
        </div>
        <div className="keyboard-row">
          <div className="key wider">capslock</div>
          <div className={`key ${highlightedKeys.includes('ф') ? 'highlighted' : ''}`}>ф</div>
          <div className={`key ${highlightedKeys.includes('ы') ? 'highlighted' : ''}`}>ы</div>
          <div className={`key ${highlightedKeys.includes('в') ? 'highlighted' : ''}`}>в</div>
          <div className={`key ${highlightedKeys.includes('а') ? 'highlighted' : ''}`}>а</div>
          <div className={`key ${highlightedKeys.includes('п') ? 'highlighted' : ''}`}>п</div>
          <div className={`key ${highlightedKeys.includes('р') ? 'highlighted' : ''}`}>р</div>
          <div className={`key ${highlightedKeys.includes('о') ? 'highlighted' : ''}`}>о</div>
          <div className={`key ${highlightedKeys.includes('л') ? 'highlighted' : ''}`}>л</div>
          <div className={`key ${highlightedKeys.includes('д') ? 'highlighted' : ''}`}>д</div>
          <div className={`key ${highlightedKeys.includes('ж') ? 'highlighted' : ''}`}>ж</div>
          <div className={`key ${highlightedKeys.includes('э') ? 'highlighted' : ''}`}>э</div>
        </div>
        <div className="keyboard-row">
          <div className={`key widest ${highlightedKeys.includes('shift') ? 'highlighted' : ''}`}>
            shift
            {(current === ',' || current.toUpperCase() === current) && !shiftPressed && 
              <span className="key-hint"></span>}
          </div>
          <div className={`key ${highlightedKeys.includes('я') ? 'highlighted' : ''}`}>я</div>
          <div className={`key ${highlightedKeys.includes('ч') ? 'highlighted' : ''}`}>ч</div>
          <div className={`key ${highlightedKeys.includes('с') ? 'highlighted' : ''}`}>с</div>
          <div className={`key ${highlightedKeys.includes('м') ? 'highlighted' : ''}`}>м</div>
          <div className={`key ${highlightedKeys.includes('и') ? 'highlighted' : ''}`}>и</div>
          <div className={`key ${highlightedKeys.includes('т') ? 'highlighted' : ''}`}>т</div>
          <div className={`key ${highlightedKeys.includes('ь') ? 'highlighted' : ''}`}>ь</div>
          <div className={`key ${highlightedKeys.includes('б') ? 'highlighted' : ''}`}>б</div>
          <div className={`key ${highlightedKeys.includes('ю') ? 'highlighted' : ''}`}>ю</div>
          <div className={`key ${highlightedKeys.includes('.') ? 'highlighted' : ''}`}>
            .
            {current === ',' && shiftPressed && <span className="key-hint"></span>}
          </div>
        </div>
        <div className="keyboard-row">
          <div className="key wide">ctrl</div>
          <div className="key wide">alt</div>
          <div className={`key widest ${highlightedKeys.includes('пробел') ? 'highlighted' : ''}`}>пробел</div>
        </div>
      </div>
    );
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="wrapper">
      {showMenu && (
        <div className="menu">
          <div className="menu-items" onClick={startraning}>Начать тренировку</div>
          <div className="menu-items" onClick={handleCustomText}>Задайте собственный текст</div>
          <div className="menu-items" onClick={handleSettings}>Настройки</div>
          <div className="menu-items" onClick={handleOverallStats}>Общая статистика</div>
        </div>
      )}

      {showInterface && (
        <div className="interface" style={{height: '100%', display: 'flex'}}>
          <div className="interface-wrapper">
            <div id="timer">{formatTime(timeStmp)}</div>
            <div 
              id="textarea-wrapper" 
              ref={textareaRef} 
              tabIndex="-1" 
              style={{display: 'block', height: '100%', overflow: 'hidden'}}
            >
              <div className="before-text">{before}</div>
              <div className="curent">{current}</div>
              <div className="after-text">{after}</div>
            </div>
          </div>
          <div id="keyboard-wrapper">
            {renderKeyboard()}
          </div>
        </div>
      )}

      {showStat && (
        <div id="stat" style={{display: 'flex'}}>
          <div className='keyboardContainer'>
            <div>Время: {formatTime(timeStmp)}</div>
            <div>Общее количество символов: {correctSimbols}</div>
            <div>Допущено ошибок: {incorrectSimbols}</div>
            <div>Аккуратность: {incorrectSimbols === 0 ? "100%" : `${Math.floor((100-((incorrectSimbols/correctSimbols)*100))*100)/100}%`}</div>
            <div>Символов в минуту: {Math.floor(correctSimbols/(timeStmp/60)*100)/100}</div>
          </div>
          <div className="back" onClick={() => { setShowStat(false); setShowMenu(true); }}>Выход в меню</div>
        </div>
      )}

      {showCustomText && (
        <div className="custom-text">
          <h3>Задайте собственный текст</h3>
          <textarea 
            value={startText} 
            onChange={(e) => setStartText(e.target.value)}
            rows="5" 
            cols="50"
          />
          <div className="back" onClick={handleBackToMenu}>Назад в меню</div>
        </div>
      )}

      {showSettings && (
        <div className="settings">
          <div className='keyboardContainer'>
            <h3>Настройки</h3>
          </div>
          {/* Здесь можно добавить настройки */}
          <div className="back" onClick={handleBackToMenu}>Назад в меню</div>
        </div>
      )}

      {showOverallStats && (
        <div className="overall-stats">
          <div className='keyboardContainer'>
            <h2>Общая статистика</h2>
            <div>Количество раундов: {rounds}</div>
            <div>Общее время: {formatTime(allTime)}</div>
            <div>Общее количество символов: {allSimbols}</div>
            <div>Общее количество ошибок: {allIncorrect}</div>
            <div>Средняя аккуратность: {(allAccuracy / rounds).toFixed(2)}%</div>
            <div>Среднее количество символов в минуту: {(allSpm / rounds).toFixed(2)}</div>
          </div>
          <div className="back" onClick={handleBackToMenu}>Назад в меню</div>
        </div>
      )}
    </div>
  );
};

export default KeyboardTrainer;
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
const image1 = require(`./img/1.jpg`);
const image2 = require(`./img/2.jpg`);
const image3 = require(`./img/3.jpg`);
const image4 = require(`./img/4.jpg`);
const image5 = require(`./img/5.jpg`);

const PaperSheet = styled.div`
  background: #fff;
  padding: 30px;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
  max-width: 500px;
  min-height: 100px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  position: relative;
  overflow-y: hidden;
  overflow-x: hidden;
  max-height: 300px;
  z-index: 10;
  
  &:before, &:after {
    content: "";
    position: absolute;
    height: 98%;
    width: 100%;
    background: #fff;
    left: -1px;
    z-index: 1;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  }
  
  &:before {
    top: 4px;
    transform: rotate(-1deg);
  }
  
  &:after {
    top: 2px;
    transform: rotate(1deg);
  }
`;

const LetterContent = styled.div`
  position: relative;
  z-index: 2;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  overflow-y: auto;
  color: #333;
  font-size: 1.2em;
  max-height: 300px;
  padding: 5px;
  white-space: pre-wrap;
`;

const Cursor = styled.span`
  display: inline-block;
  position: relative;
  z-index: 9;
  width: 10px;
  height: 1.2em;
  background-color: #333;
  margin-left: 2px;
  animation: blink 0.7s infinite;
  
  @keyframes blink {
    0% { opacity: 0 }
    50% { opacity: 1 }
    100% { opacity: 0 }
  }
`;
const RomanticMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: #000000a6;
  display: flex;
  color: #d81b60;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.5s ease-in;
  z-index: 10;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
const Window = styled.div`
    font-size: 16pt;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 30px;
    max-width: 500px;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    max-height: 300px;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
`;

const CarouselSlide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transition: opacity 0.5s ease-in-out;
  opacity: ${props => props.active ? 1 : 0};
  z-index: 10;
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const LeftButton = styled(CarouselButton)`
  left: 10px;
`;

const RightButton = styled(CarouselButton)`
  right: 10px;
`;

const IndicatorContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  z-index: 10;
`;

const Indicator = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const slides = [
  { image: `url('${image1}')`},
  { image: `url('${image2}')`},
  { image: `url('${image3}')`},
  { image: `url('${image4}')`},
  { image: `url('${image5}')`},
];

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <CarouselContainer>
      {slides.map((slide, index) => (
        <CarouselSlide 
          key={index} 
          active={index === currentSlide}
          style={{ backgroundImage: slide.image }}
        >
        </CarouselSlide>
      ))}
      <LeftButton onClick={goToPrevSlide}>❮</LeftButton>
      <RightButton onClick={goToNextSlide}>❯</RightButton>
      <IndicatorContainer>
        {slides.map((_, index) => (
          <Indicator 
            key={index} 
            active={index === currentSlide} 
            onClick={() => goToSlide(index)}
          />
        ))}
      </IndicatorContainer>
    </CarouselContainer>
  );
}

function LetterLink() {
  const [showMessage, setShowMessage] = useState(false);  
  const click = () => {
    setShowMessage(true);
  }
  const close = () => {
    setShowMessage(false);
  }

  return (
    <div style={{ display: 'inline-block', color: '#9191f7', textDecoration: 'none', fontSize: '18pt' }}>
      <b onClick={click} style={{cursor: 'pointer'}}>навсегда</b>
      {showMessage && (
        <RomanticMessage>
          <Window>
            <span onClick={close} style={{color: 'black', position: 'absolute', right: '10px', top: '3px', cursor: 'pointer'}}>X</span>
            Тут будет альбом ваших фото
            <Carousel />
          </Window>
        </RomanticMessage>
      )}
    </div>
  );
}
  
  const letterContent = [
    "Дорогая [Имя],|",
    "Я хочу сказать~признаться, что ты|",
    "Самая удивительная~прекрасная~восхитительная девушка, которую я когда-либо встречал.|",
    "Я никогда не испытывал такое желание быть с человеком, чувствовать такое спокойствие просто общаясь с ним и хотеть скорее увидеть его.|",
    "Я тебя люблю~очень~безумно люблю и с нетерпением жду, когда смогу тебя обнять.|",
    "Верю в то, что эти чувства останутся|",
    { type: 'component', component: <LetterLink /> },
  ];
  
  function Letter() {
    const scrollableRef = useRef(null);
    const [displayedText, setDisplayedText] = useState([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [wordToDelete, setWordToDelete] = useState('');
  
    useEffect(() => {
      if (currentLineIndex >= letterContent.length) return;
  
      const currentLine = letterContent[currentLineIndex];
      
      const timer = setTimeout(() => {
        if (typeof currentLine === 'object' && currentLine.type === 'component') {
          setDisplayedText(prevText => [...prevText, currentLine.component]);
          setCurrentLineIndex(currentLineIndex + 1);
          setCurrentCharIndex(0);
        } else if (isDeleting) {
          if (wordToDelete.length > 0) {
            setDisplayedText(prevText => {
              const newText = [...prevText];
              newText[newText.length - 1] = newText[newText.length - 1].slice(0, -1);
              return newText;
            });
            setWordToDelete(wordToDelete.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentCharIndex(currentCharIndex + 1);
          }
        } else if (currentCharIndex < currentLine.length) {
          const char = currentLine[currentCharIndex];
          if (char === '|') {
            setCurrentLineIndex(currentLineIndex + 1);
            setCurrentCharIndex(0);
            setDisplayedText(prevText => [...prevText, '\n']);
          } else if (char === '~') {
            const words = displayedText[displayedText.length - 1].split(' ');
            const lastWord = words[words.length - 1];
            setWordToDelete(lastWord);
            setIsDeleting(true);
          } else {
            setDisplayedText(prevText => {
              const newText = [...prevText];
              if (typeof newText[newText.length - 1] === 'string') {
                newText[newText.length - 1] += char;
              } else {
                newText.push(char);
              }
              return newText;
            });
            setCurrentCharIndex(currentCharIndex + 1);
          }
        } else {
          setCurrentLineIndex(currentLineIndex + 1);
          setCurrentCharIndex(0);
          setDisplayedText(prevText => [...prevText, '\n']);
        }
  
        if (scrollableRef.current) {
          scrollableRef.current.scrollTo({
            top: scrollableRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
  
      return () => clearTimeout(timer);
    }, [currentLineIndex, currentCharIndex, displayedText, isDeleting, wordToDelete]);
  
    return (
      <PaperSheet>
        <LetterContent ref={scrollableRef}>
          {displayedText.map((item, index) => 
            React.isValidElement(item) ? React.cloneElement(item, { key: index }) : item
          )}
          <Cursor />
        </LetterContent>
      </PaperSheet>
    );
  }
  
  export default Letter;
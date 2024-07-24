import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { S3_ROUTE } from '../utils/const';

const TimelineWrapper = styled.div`
  position: relative;
  overflow: hidden;
  user-select: none;
`;
const TimelineMarker = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #3498db;
  top: 21px;
  transform: translateX(-50%);
  transition: left 0.3s ease;
`;
const TimelineContainer = styled.div`
  position: relative;
  padding: 40px 0;
  width: 90vw;
max-width: 1200px;
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3498db;
  top: 25px;
`;

const ProjectsContainer = styled.div`

  position: relative;
  display: flex;
  align-items: flex-start;
  overflow-x: scroll;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  margin: 0 auto;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  padding: 0 20px;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const ProjectItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  flex-shrink: 0;
  margin-right: 20px;
`;

const ProjectCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  border: 2px solid #3498db;

  &:hover {
    transform: scale(1.1);
  }
`;

const ProjectLabel = styled.div`
  margin-top: 8px;
  font-size: 12px;
  text-align: center;
  word-wrap: break-word;
`;

const ProjectDate = styled.span`
  font-weight: bold;
  display: block;
`;

const ProjectName = styled.span`
  display: block;
`;

const ProjectDetails = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 100%;
  max-width: 600px;
  margin: 20px auto 0;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const ProjectTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  margin-bottom: 8px;
`;

const ProjectTechnologies = styled.p`
  font-size: 12px;
  color: #666;
`;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const ProjectTimeline = ({ petProjects, comProjects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(0);

  const allProjects = useMemo(() => {
    const combinedProjects = [
      ...petProjects.map(project => ({ ...project, type: 'pet' })),
      ...comProjects.map(project => ({ ...project, type: 'com' }))
    ];
    return combinedProjects
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((project, index) => ({
        ...project,
        uniqueId: `${project.type}-${project.id}-${index}`
      }));
  }, [petProjects, comProjects]);

  const handleProjectClick = (project, event) => {
    if (!isDragging) {
      setSelectedProject(selectedProject?.uniqueId === project.uniqueId ? null : project);
    }
    event.preventDefault();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.scrollBehavior = 'auto';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    containerRef.current.style.scrollBehavior = 'smooth';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    containerRef.current.style.scrollBehavior = 'smooth';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1; // Уменьшили чувствительность
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.scrollBehavior = 'auto';
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1; // Уменьшили чувствительность
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    containerRef.current.style.scrollBehavior = 'smooth';
  };
  useEffect(() => {
    const updateMarkerPosition = () => {
      if (containerRef.current) {
        const scrollPercentage = containerRef.current.scrollLeft / (containerRef.current.scrollWidth - containerRef.current.clientWidth);
        const newPosition = scrollPercentage * containerRef.current.clientWidth;
        setMarkerPosition(newPosition);
      }
    };

    const container = containerRef.current;
    container.addEventListener('scroll', updateMarkerPosition);
    updateMarkerPosition(); // Initial position

    return () => {
      container.removeEventListener('scroll', updateMarkerPosition);
    };
  }, []);
  return (
    <TimelineWrapper>
      <TimelineContainer>
        <TimelineLine />
        <TimelineMarker style={{ left: `${markerPosition}px` }} />
        <ProjectsContainer
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {allProjects.map((project) => (
            <ProjectItem key={project.uniqueId}>
              <ProjectCircle
                style={{ backgroundImage: `url(${S3_ROUTE}${project.img})` }}
                onClick={(e) => handleProjectClick(project, e)}
              />
              <ProjectLabel>
                <ProjectDate>{formatDate(project.date)}</ProjectDate>
                <ProjectName>{project.name}</ProjectName>
              </ProjectLabel>
            </ProjectItem>
          ))}
        </ProjectsContainer>
      </TimelineContainer>
      <ProjectDetails visible={selectedProject !== null}>
        {selectedProject && (
          <>
            <ProjectTitle>{selectedProject.name}</ProjectTitle>
            <ProjectDescription>{selectedProject.description}</ProjectDescription>
            <ProjectTechnologies>{selectedProject.technologies}</ProjectTechnologies>
          </>
        )}
      </ProjectDetails>
    </TimelineWrapper>
  );
};

export default ProjectTimeline;
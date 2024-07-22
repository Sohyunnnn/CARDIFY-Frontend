import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import styled from 'styled-components';
import StudyCard from './StudyCard'; 
const Container = styled.div`
  flex-shrink: 0;
  background: #fff;
  padding-left: 1.94rem;
  padding-right: 1.94rem;
  padding-top: 2rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CalendarTitle = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 0.9375rem;
  font-weight: 600;
  margin-right: auto; 
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavigationButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  background: #F1F1F1;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }

  rect {
    fill: #F1F1F1;
  }

  path {
    stroke: black;
    strokeLinecap: round;
    strokeLinejoin: round;
  }
`;

const TodayButton = styled.button`
  display: flex;
  width: var(--line-height-xl, 2.5rem);
  height: 1.5rem;
  padding: var(--UI-Component-xxxxxS, 0.25rem) 0.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  background: #F1F1F1;
  border: none;
  cursor: pointer;
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: normal;
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  border: none;
  .react-calendar__navigation {
    display: none;
  }
  .react-calendar__month-view__weekdays {
    display: flex;
    justify-content: space-between;
  }
  .react-calendar__month-view__weekdays__weekday {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2.75rem;
    height: 2.75rem;
    color: var(--Grays-Black, #1A1A1A);
    font-family: Pretendard;
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
  }
  .react-calendar__month-view__days__day {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 2.75rem;
    height: 2.75rem;
    color: var(--Grays-Black, #1A1A1A);
    font-family: Pretendard;
    font-size: 0.75rem;
    font-weight: 400;
    margin-top: 0.75rem;
  }
  .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none; 
    &:hover {
      background: none; 
    }
    &:focus {
      background: none; 
    }
  }
  .react-calendar__tile--now {
    background: none; 
  }
  .react-calendar__tile--hasCards {
    background: var(--Grays-Gray2, #B1B1B1);
    color: black;
    &:hover {
      background: var(--Grays-Gray2, #B1B1B1); 
    }
  }
  .react-calendar__tile--hasCards.react-calendar__tile--active {
    background: var(--Grays-Gray2, #B1B1B1);
    color: white;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    visibility: hidden;
  }
`;

const Divider = styled.div`
  width: 24.3125rem;
  height: 0.0625rem;
  flex-shrink: 0;
  background: #EBEBEB;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
`;

const CardsContainer = styled.div`
  max-height: 21rem; 
  overflow-y: auto; 
`;

const formatShortWeekday = (locale, date) => {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return weekdays[date.getDay()];
};

const formatDay = (locale, date) => {
  return date.getDate().toString();
};

const StudyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [cards, setCards] = useState([]);

  const studyCards = {
    '2024-07-03': [{ name: '노트 1', timeLeft: '3시간 20분 후' }],
    '2024-07-11': [{ name: '노트 2', timeLeft: '5일 2시간 후' }],
    '2024-07-13': [
      { name: '노트 3', timeLeft: '10분 후' },
      { name: '노트 4', timeLeft: '2시간 10분 후' },
      { name: '노트 4', timeLeft: '3시간 10분 후' },
      { name: '노트 4', timeLeft: '1시간 10분 후' },
      { name: '노트 4', timeLeft: '5시간 10분 후' }
    ]
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setDate(today);
    setCards([]);
  };

  const handleClickDay = (value) => {
    setDate(value);
    const formattedDate = formatDate(value);
    const sortedCards = (studyCards[formattedDate] || []).sort((a, b) => {
      const timeA = parseTimeLeft(a.timeLeft);
      const timeB = parseTimeLeft(b.timeLeft);
      return timeA - timeB;
    });
    setCards(sortedCards);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const parseTimeLeft = (timeLeft) => {
    const timeParts = timeLeft.match(/(\d+)(?=[년달일시간분])/g) || [];
    let totalMinutes = 0;

    if (timeParts.length === 4) {
      totalMinutes += parseInt(timeParts[0]) * 525600; // 년
      totalMinutes += parseInt(timeParts[1]) * 43800;  // 달
      totalMinutes += parseInt(timeParts[2]) * 1440;   // 일
      totalMinutes += parseInt(timeParts[3]);          // 시간
    } else if (timeParts.length === 3) {
      totalMinutes += parseInt(timeParts[0]) * 43800;  // 달
      totalMinutes += parseInt(timeParts[1]) * 1440;   // 일
      totalMinutes += parseInt(timeParts[2]);          // 시간
    } else if (timeParts.length === 2) {
      totalMinutes += parseInt(timeParts[0]) * 1440;   // 일
      totalMinutes += parseInt(timeParts[1]);          // 시간
    } else if (timeParts.length === 1) {
      totalMinutes += parseInt(timeParts[0]);          // 분
    }

    return totalMinutes;
  };

  return (
    <Container>
      <CalendarHeader>
        <CalendarTitle>{`${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`}</CalendarTitle>
        <NavigationContainer>
          <NavigationButton onClick={handlePrevMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" fill="#F1F1F1"/>
              <path d="M14 8L10 12L14 16" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </NavigationButton>
          <TodayButton onClick={handleToday}>오늘</TodayButton>
          <NavigationButton onClick={handleNextMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" fill="#F1F1F1"/>
              <path d="M10 8L14 12L10 16" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </NavigationButton>
        </NavigationContainer>
      </CalendarHeader>
      <StyledCalendar
        onChange={setDate}
        value={date}
        activeStartDate={viewDate}
        onActiveStartDateChange={({ activeStartDate }) => setViewDate(activeStartDate)}
        onClickDay={handleClickDay}
        tileContent={({ date }) => {
          const formattedDate = formatDate(date);
          return studyCards[formattedDate] ? (
            <div className="highlight" />
          ) : null;
        }}
        tileClassName={({ date }) => {
          const formattedDate = formatDate(date);
          return studyCards[formattedDate] ? 'react-calendar__tile--hasCards' : '';
        }}
        formatShortWeekday={formatShortWeekday}
        formatDay={formatDay}
        locale="ko-KR"
      />
      <Divider />
      <CardsContainer>
        {cards.map((card, index) => (
          <StudyCard key={index} card={card} />
        ))}
      </CardsContainer>
    </Container>
  );
};

export default StudyCalendar;

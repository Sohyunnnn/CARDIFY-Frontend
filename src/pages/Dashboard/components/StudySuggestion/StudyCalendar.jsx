import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import styled from 'styled-components';
import StudyCard from './StudyCard'; 
import { getStudySuggestions, getMonthlyStudyDates } from '../../../../api/dashboard/studySuggestions';

const Container = styled.div`
  flex-shrink: 0;
  background: #fff;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CalendarTitle = styled.div`
  color: var(--Grays-Black, #1A1A1A);
  font-family: Pretendard;
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-right: auto; 
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavigationButton = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TodayButton = styled.button`
  display: flex;
  width: var(--line-height-xl, 2.5rem);
  height: 1.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  background: #F1F1F1;
  border: none;
  cursor: pointer;
  color: var(--Grays-Black, #1A1A1A);
  text-align: center;
  font-family: Pretendard;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 1.3125rem;
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
    height: 2rem;
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
    margin-top: 0.5rem;
    padding: 0;
    width: 32px;
    height: 32px;
    color: var(--Grays-Black, #1A1A1A);
    font-family: Pretendard;
    font-size: 0.75rem;
    font-weight: 400;
  }
  .react-calendar__tile {
    aspect-ratio: 1 / 1;
    height: auto; 
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border-radius: 50%;

    &:hover {
      background: var(--Grays-Gray7, #F0F0F0);
     }

    &:focus {
      background: var(--Main-Primary, #0F62FE);
      color: #fff;
    }

    &:active {
      background: var(--Grays-Gray7, #F0F0F0);
      color: var(--Grays-Black, #1A1A1A);
    }
  

  }
  
  .react-calendar__tile--now {
    color: #0F62FE; 

    &:focus {
      background: #0F62FE;
      color: #fff;
    }
  }
  .react-calendar__tile--hasCards {
   color: var(--Grays-Black, #1A1A1A);
   font-family: Pretendard;
   font-size: 0.75rem;
   font-style: normal;
   font-weight: 300;
   line-height: normal;
   border-radius: 50%;
   background: var(--Main-PrimaryLight3, #DCE8FF);

   &:hover {
    background: #D8E6FF;
   }

   &:active {
    color: var(--Grays-Black, #1A1A1A); // 클릭을 유지할 때 글씨를 검은색으로
  }
  }
  .react-calendar__tile--hasCards.react-calendar__tile--active { 
    border-radius: 50%;
    background: var(--Main-Primary, #0F62FE);
    color: var(--Grays-White, #FFFFFF);
  }
  .react-calendar__tile--today-with-cards {
    border-radius: 50%;
    background: #DCE8FF;
    color: #0F62FE;

    &:hover {
      background: #D8E6FF;
      color: #0F62FE;
    }
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    visibility: hidden;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 0.0625rem;
  flex-shrink: 0;
  background: #EBEBEB;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
`;

const NoStudyMessage = styled.div`
  color: var(--Grays-Gray1, #646464);
  font-family: Pretendard;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: center;
`;

const CardsContainer = styled.div`
  max-height: 21rem;
  overflow-y: auto; 
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-bottom: 2rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: none;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #D9D9D9;
    border-radius: 0.25rem;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #D3D3D3; 
  }
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
  const [studyDates, setStudyDates] = useState([]); // 이번 달 학습 예정 일자를 저장
  const [studyCards, setStudyCards] = useState({}); // API 데이터를 저장할 상태

  useEffect(() => {
    // 이번 달 학습 예정 일자 불러오기
    const fetchStudyDates = async () => {
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth() + 1; // 0부터 시작하므로 +1
      try {
        const response = await getMonthlyStudyDates(year, month);
        setStudyDates(response.expectedDate); // 날짜 리스트를 설정
      } catch (error) {
        console.error('Error loading study dates:', error);
      }
    };

    fetchStudyDates();
  }, [viewDate]);

  useEffect(() => {
    // 오늘 날짜의 학습 제안 데이터를 불러옴
    const fetchStudySuggestionsData = async () => {
      try {
        const suggestions = await getStudySuggestions(new Date()); // 오늘 날짜의 현재 시간을 기반으로 요청
        setStudyCards(suggestions);

        // 오늘 날짜의 학습 제안 카드 설정
        const today = new Date();
        setDate(today);
        const formattedDate = formatDate(today);
        const sortedCards = suggestions
          .filter((card) => card.date === formattedDate)
          .sort((a, b) => {
            const timeA = parseRemainTime(a.remainTime);
            const timeB = parseRemainTime(b.remainTime);
            return timeA - timeB; // 남은 시간이 적은 순으로 정렬
          });

        setCards(sortedCards);
      } catch (error) {
        console.error('Error loading study suggestions:', error);
      }
    };

    fetchStudySuggestionsData();
  }, []);

  const parseRemainTime = (remainTime) => {
    const match = remainTime.match(/(\d+) 시간 (\d+) 분/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      return hours * 60 + minutes; // 시간을 분 단위로 변환
    }
    return parseInt(remainTime, 10); // "학습하기"일 경우 음수 값으로 처리
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
    const formattedDate = formatDate(today);
    const sortedCards = studyCards
      .filter((card) => card.date === formattedDate)
      .sort((a, b) => parseRemainTime(a.remainTime) - parseRemainTime(b.remainTime));

    setCards(sortedCards);
  };

  const handleClickDay = async (value) => {
    console.log("클릭한 날짜:", value);
    try {
      const suggestions = await getStudySuggestions(value); // 클릭된 날짜를 전달
      console.log("API에서 받아온 데이터:", suggestions);
  
      const formattedDate = formatDate(value); // "YYYY-MM-DD" 형식으로 변환
      console.log("포맷된 날짜:", formattedDate);
  
      // 응답 데이터를 필터링하여 클릭한 날짜의 카드만 남김
      const filteredCards = suggestions
        .filter((card) => card.date === formattedDate)
        .sort((a, b) => parseRemainTime(a.remainTime) - parseRemainTime(b.remainTime)); // 남은 시간이 적은 순으로 정렬
  
      console.log("필터링된 카드:", filteredCards);
  
      setCards(filteredCards);
    } catch (error) {
      console.error('Error fetching study suggestions:', error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const tileClassName = ({ date }) => {
    const day = date.getDate(); // 날짜만 확인
    const isToday = new Date().toDateString() === date.toDateString();
    const hasCards = studyDates.includes(day); // 날짜가 있는지 확인

    if (hasCards) {
      return isToday
        ? 'react-calendar__tile--today-with-cards'
        : 'react-calendar__tile--hasCards';
    } else if (isToday) {
      return 'react-calendar__tile--now';
    }
    return '';
  };

  const tileContent = ({ date }) => {
    const day = date.getDate();
    return studyDates.includes(day) ? (
      <div className="highlight" />
    ) : null;
  };

  return (
    <Container>
      <CalendarHeader>
        <CalendarTitle>{`${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`}</CalendarTitle>
        <NavigationContainer>
          <NavigationButton onClick={handlePrevMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="12" fill="#F1F1F1" />
              <path d="M14 8L10 12L14 16" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </NavigationButton>
          <TodayButton onClick={handleToday}>오늘</TodayButton>
          <NavigationButton onClick={handleNextMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="12" fill="#F1F1F1" />
              <path d="M10 8L14 12L10 16" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </NavigationButton>
        </NavigationContainer>
      </CalendarHeader>
      <StyledCalendar
        onChange={setDate}
        value={date}
        calendarType="gregory"
        activeStartDate={viewDate}
        onActiveStartDateChange={({ activeStartDate }) => setViewDate(activeStartDate)}
        onClickDay={handleClickDay}
        tileClassName={tileClassName}
        tileContent={tileContent}
        formatShortWeekday={formatShortWeekday}
        formatDay={formatDay}
        locale="ko-KR"
      />
      <Divider />
      <CardsContainer>
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <StudyCard key={index} card={card} />
          ))
        ) : (
          <NoStudyMessage>필요한 학습이 없습니다.</NoStudyMessage>
        )}
      </CardsContainer>
    </Container>
  );
};

export default StudyCalendar;

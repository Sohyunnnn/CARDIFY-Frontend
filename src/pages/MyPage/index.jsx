import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MyPageContainer, Header, ContentDiv, LeftSection, RightSection, AlarmSection,
  PointSection, AttendanceSection,AttendanceLeftSection,AttendanceRightSection,
  InfoSection, FlexRow, SectionText, PointText, InfoText, NotificationText,
  InstagramId, Divider
} from './styles/MyPageStyles'; 
import { getMyPageInfo } from '../../api/mypage/getMypage';
import { userCheck } from '../../api/mypage/userCheck';
import Switch from './components/Switch';
import ProfileSection from './components/ProfileSection';
import BackButton from './components/BackButton';
import LogoutButton from './components/LogoutButton';
import AttendanceButton from './components/AttendanceButton';
import TermsModal from '../../components/Modal/TermsModal';
import PrivacyModal from '../../components/Modal/PrivacyModal';
import AttendanceModal from './components/Modal/AttendanceModal';
import alarmIcon from '../../assets/alarmIcon.svg';
import instagramIcon from '../../assets/instagram.svg';
import pointIcon from '../../assets/pointIcon.svg';
import angleRight from '../../assets/angleRight.svg';

export const MyPage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [isAttendanceChecked, setIsAttendanceChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyPageInfo();
        setProfileData(data);
        setIsAttendanceChecked(data.todayCheck === 1);
      } catch (error) {
        console.error('Error fetching profile info:', error);
      }
    };

    fetchData();

    const interval = setInterval(async () => {
      const data = await getMyPageInfo();
      setIsAttendanceChecked(data.todayCheck === 1);
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 클리어
  }, []);

  const handleAttendanceClick = async () => {
    if (!isAttendanceChecked) {
      try {
        await userCheck(); // 출석 체크
        setIsAttendanceChecked(true);
        setShowAttendanceModal(true);
      } catch (error) {
        console.error('Error during attendance check:', error);
      }
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <MyPageContainer>
      <Header>
        <BackButton />
        마이페이지 
      </Header>
      <ContentDiv>
        <LeftSection>
          <ProfileSection nickname={profileData.name} email={profileData.email} />
          <LogoutButton />
        </LeftSection>
        <RightSection>
          <AlarmSection>
          <FlexRow>
            <img src={alarmIcon} alt="alarmIcon" style={{margin: '0 0.75rem 0 1.5rem'}} />
            <SectionText>알림</SectionText>
            </FlexRow>
            <FlexRow>
              <NotificationText>{isNotificationOn ? "ON" : "OFF" }</NotificationText>
              <Switch onChange={(checked) => setIsNotificationOn(checked)} />
            </FlexRow>
          </AlarmSection>

          <PointSection>
          <FlexRow>
            <img src={pointIcon} alt="pointIcon" style={{margin: '0 0.75rem 0 1.5rem'}} />
            <SectionText>내 포인트</SectionText>
            </FlexRow>
            <FlexRow>
             <PointText>{profileData.point}P</PointText>
             <img src={angleRight} alt="angleRight" style={{margin: '0 2rem 0 2.5rem'}} />
             </FlexRow>
          </PointSection>
          <AttendanceSection>
            <AttendanceLeftSection>
              <SectionText>출석해서 포인트 받고</SectionText>
              <SectionText style={{fontWeight: '600', fontSize:'1.3125rem'}}>학습 자료로 교환하기</SectionText>

            </AttendanceLeftSection>
            <AttendanceRightSection> 
              <AttendanceButton 
                onClick={handleAttendanceClick}
                disabled={isAttendanceChecked}              >
                {isAttendanceChecked ? '출석완료' : '출석체크'}
              </AttendanceButton>
              {/*<AttendanceImage />*/}
            </AttendanceRightSection>
          </AttendanceSection>
          <InfoSection>
          <FlexRow>
            <img src={instagramIcon} alt="instagramIcon" style={{margin: '0 0.75rem 0 1.5rem'}} />
            <InstagramId onClick={() => window.open('https://instagram.com/cardify_official', '_blank')}>
              @cardify_official
            </InstagramId>
            </FlexRow>
            <Divider />
            <FlexRow style={{ gap: '1rem', marginRight: '2rem'}}>
            <InfoText onClick={() => setShowTermsModal(true)} >이용약관</InfoText>
            <InfoText onClick={() => setShowPrivacyModal(true)}>개인정보취급방침</InfoText>
            </FlexRow>
          </InfoSection>
        </RightSection>

      </ContentDiv>
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
      {showAttendanceModal && <AttendanceModal onClose={() => setShowAttendanceModal(false)} />}
    </MyPageContainer>
  );
};

export default MyPage;
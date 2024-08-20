// NoteIcon.jsx
const NoteIcon = ({ color }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M10.4286 36C9.60959 36 8.92633 35.7262 8.37877 35.1787C7.83122 34.6311 7.55685 33.9479 7.55566 33.1289V6.87111C7.55566 6.05333 7.83003 5.37067 8.37877 4.82311C8.92752 4.27556 9.61078 4.00119 10.4286 4H24.0303C24.2956 4 24.5499 4.10536 24.7374 4.29289L32.1517 11.7071C32.3392 11.8946 32.4446 12.149 32.4446 12.4142V33.1289C32.4446 33.9467 32.1708 34.6299 31.6232 35.1787C31.0757 35.7274 30.3918 36.0012 29.5717 36H10.4286ZM23.5557 12.8889H30.4254C30.5144 12.8889 30.5591 12.7812 30.4961 12.7182L23.7264 5.94849C23.6634 5.88549 23.5557 5.93011 23.5557 6.0192V12.8889Z" 
        fill={color} // 여기에서 색상을 동적으로 설정합니다.
      />
    </svg>
  );
  
  export default NoteIcon;
  
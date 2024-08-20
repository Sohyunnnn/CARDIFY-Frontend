import { useState, useContext } from 'react';
import styled from 'styled-components';
import Editor from './components/Editor';
import Header from './components/Header/Header';
import MenuBar from './components/MenuBar';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getNote } from '../../api/noteeditor/getNote';
import { NoteContext } from '../../api/NoteContext';

const NoteEditorWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MenuBarWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCollapsed',
})`
  width: 15rem;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isCollapsed }) => (isCollapsed ? 'translateX(-15rem)' : 'translateX(0)')};
  z-index: 1000;
`;

const ContentWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isMenuCollapsed',
})`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  transition: margin-left 0.3s ease-in-out;
  margin-left: ${({ isMenuCollapsed }) => (isMenuCollapsed ? '-15rem' : '3rem')};
`;

const EditorWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const NoteEditor = () => {
  const location = useLocation();
  const { noteId: initialNoteId, folderId } = location.state || {}; // folderId를 가져옴
  const [noteId, setNoteId] = useState(initialNoteId);
  const { noteData, setNoteData } = useContext(NoteContext);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [editorView, setEditorView] = useState(null);

  const toggleMenuBar = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  useEffect(() => {
    if (noteId) {
      const fetchNoteData = async () => {
        try {
          const data = await getNote(noteId);
          // NoteContext에 데이터를 저장합니다.
          setNoteData(prevData => ({
            ...prevData,
            noteId: noteId,
            noteName: data.noteName,
            noteContent: data.noteContent,
            markState: data.markState,
            // 필요한 다른 데이터들 추가
          }));
          console.log('Fetched Note Data:', data);
        } catch (error) {
          console.error('노트 데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
      };
      fetchNoteData();
    }
  }, [noteId, setNoteData]);

  const handleNoteSelect = async (newNoteId) => {
    try {
      // 새로운 노트의 데이터를 가져옵니다.
      const data = await getNote(newNoteId);
  
      // 노트 ID 및 관련된 모든 데이터를 업데이트합니다.
      setNoteId(newNoteId);
      setNoteData(prevData => ({
        ...prevData,
        noteId: newNoteId,
        noteName: data.noteName,
        noteContent: data.noteContent,
        markState: data.markState,
      }));
    } catch (error) {
      console.error('노트를 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <NoteEditorWrapper>
      <MenuBarWrapper isCollapsed={isMenuCollapsed}>
        {/* MenuBar에 folderId를 전달 */}
        <MenuBar
          isCollapsed={isMenuCollapsed}
          toggleMenuBar={toggleMenuBar}
          selectedFolderId={folderId} // folderId를 MenuBar에 전달
          selectedNoteId={noteId} // 초기 선택된 노트를 MenuBar에 전달
          onSelectNote={handleNoteSelect} // MenuBar에서 노트를 선택할 때 호출될 함수
        />
      </MenuBarWrapper>
      <ContentWrapper isMenuCollapsed={isMenuCollapsed}>
        <Header isMenuCollapsed={isMenuCollapsed} toggleMenuBar={toggleMenuBar} editorView={editorView} selectedFolderId={folderId} currentNoteId={noteId}/>
        <EditorWrapper>
          <Editor setEditorView={setEditorView} />
        </EditorWrapper>
      </ContentWrapper>
    </NoteEditorWrapper>
  );
};

export default NoteEditor;

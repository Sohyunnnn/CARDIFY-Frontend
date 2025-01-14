import { useState, forwardRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DeleteMenu from './DeleteMenu';

const KebabMenuWrapper = styled.div`
  position: absolute;
  top: 4.25rem;
  left: 1.06rem;
  display: flex;
  width: 8.8125rem;
  flex-direction: column;
  border-radius: 0.25rem;
  border: 1px solid var(--grays-gray-5-divider, #E8E8E8);
  box-shadow: 0px 4px 26px 0px rgba(0, 0, 0, 0.02), 0px 10px 60px 0px rgba(0, 74, 162, 0.03);
  z-index: 10;
  background: var(--grays-white, #FFF);
  box-sizing: border-box;
`;

const KebabMenuItem = styled.div`
  display: flex;
  padding: 1rem 1.5rem;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--Grays-Black, #1A1A1A);
  font-family: Pretendard;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  &:hover {
    background: var(--Grays-Gray7, #F0F0F0);
  }

  &:active {
    background: var(--Main-PrimaryDull, #E3EAF6);
  }
`;

const ExportItem = styled(KebabMenuItem)`
border-top: 1px solid var(--grays-gray-5-divider, #E8E8E8);
`;

const DeleteItem = styled(ExportItem)`
   color: var(--Semantic-Alert, #EA1215);
`;

// eslint-disable-next-line react/display-name
const KebabMenu = forwardRef(({ onShare, noteId }, ref) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <KebabMenuWrapper ref={ref}>
        <KebabMenuItem onClick={onShare}>공유하기</KebabMenuItem>
        <DeleteItem onClick={() => setIsDeleteModalOpen(true)}>삭제</DeleteItem>
      </KebabMenuWrapper>
      {isDeleteModalOpen && (
        <DeleteMenu
          noteId={noteId}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
});

KebabMenu.propTypes = {
  onShare: PropTypes.func.isRequired,
  noteId: PropTypes.number.isRequired,
};

export default KebabMenu;
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-menu/style/menu.css';
import WordCard from '../Cards/WordCard';
import BlankCard from '../Cards/BlankCard';
import MultiCard from '../Cards/MultiCard';
import ImageCard from '../Cards/ImageCard';
import mySchema from './schema';
import { myInputRules } from './Markdown/inputRules';
import { splitListItem, liftListItem, sinkListItem, wrapInList } from 'prosemirror-schema-list';
import PropTypes from 'prop-types';

const ContentArea = styled.div`
  flex: 1;
  border: none;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  resize: none;
  height: auto;
  color: var(--Grays-Black, #1A1A1A);
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  .ProseMirror {
    border: none;
    outline: none;
    border-radius: 4px;
    min-height: 20rem;
    max-height: 33rem;
    ul {
      list-style-type: disc;
      padding-left: 20px;
    }
  }

  @media (max-width: 48rem) {
    height: calc(100vh - 6rem);
  }
`;

const TitleDiv = styled.div`
  display: flex;
  align-items: center;
`;

const TitleInput = styled.div`
  font-size: 1.5rem;
  width: 100%;
  border: none;
  outline: none;
  font-family: Pretendard;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  box-sizing: border-box;
  &:focus {
    border: none;
    outline: none;
  }
  &.empty::before {
    content: attr(data-placeholder);
    color: #aaa;
  }
`;

const TransformFlashcard = styled.div`
  display: flex;
  width: 4rem;
  padding: 1.25rem 1.0625rem 1.25rem 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  cursor: pointer;
`;

const Divider = styled.div`
  height: 1px;
  background: #B1B1B1;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const CombinedEditor = ({ cards, viewRef }) => {
  const contentRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const state = EditorState.create({
        schema: mySchema,
        doc: ProseMirrorDOMParser.fromSchema(mySchema).parse(contentRef.current),
        plugins: [
          keymap({
            'Enter': (state, dispatch) => {
              return splitListItem(mySchema.nodes.list_item)(state, dispatch);
            },
            'Tab': (state, dispatch) => {
              return sinkListItem(mySchema.nodes.list_item)(state, dispatch);
            },
            'Shift-Tab': (state, dispatch) => {
              return liftListItem(mySchema.nodes.list_item)(state, dispatch);
            },
            'Mod-l': (state, dispatch) => {
              return wrapInList(mySchema.nodes.bullet_list)(state, dispatch);
            }
          }),
          keymap(baseKeymap),
          history(),
          dropCursor(),
          gapCursor(),
          myInputRules(mySchema)
        ]
      });

      const view = new EditorView(contentRef.current, {
        state,
        dispatchTransaction(transaction) {
          const newState = view.state.apply(transaction);
          view.updateState(newState);
        }
      });
      viewRef.current = view;

      // 문서 전체를 불렛 리스트로 감싸기
      const tr = view.state.tr;
      tr.setSelection(view.state.selection);
      wrapInList(mySchema.nodes.bullet_list)(view.state, tr => view.dispatch(tr));

      return () => {
        view.destroy();
      };
    }
  }, [viewRef]);

  useEffect(() => {
    const node = titleRef.current;

    const handleInput = () => {
      if (node.innerText === '') {
        node.classList.add('empty');
      } else {
        node.classList.remove('empty');
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        contentRef.current.querySelector('.ProseMirror').focus();
      }
    };

    node.addEventListener('input', handleInput);
    node.addEventListener('keydown', handleKeyDown);
    handleInput();

    return () => {
      node.removeEventListener('input', handleInput);
      node.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <TitleDiv>
        <TitleInput
          contentEditable="true"
          data-placeholder="제목 없음"
          ref={titleRef}
          className="empty"
        ></TitleInput>
        <TransformFlashcard>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="26" viewBox="0 0 32 26" fill="none">
            <path d="M7.81846 6.2672L7.99227 5.35878L8.6875 1.7251L30.3901 5.65605L27.6092 20.1908L24.8964 19.6994L24.2182 19.5766" stroke="#B1B1B1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="1.61035" y="7.2749" width="22" height="17" stroke="#B1B1B1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="6.71035" y1="14.1749" x2="18.5104" y2="14.1749" stroke="#B1B1B1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="6.71035" y1="18.1749" x2="14.5104" y2="18.1749" stroke="#B1B1B1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </TransformFlashcard>
      </TitleDiv>
      <Divider />
      <ContentArea>
        <div ref={contentRef}></div>
        {cards.map((card, index) => {
          switch (card.type) {
            case 'word':
              return <WordCard key={index} />;
            case 'blank':
              return <BlankCard key={index} />;
            case 'multi':
              return <MultiCard key={index} />;
            case 'image':
              return <ImageCard key={index} />;
            default:
              return null;
          }
        })}
      </ContentArea>
    </>
  );
};

CombinedEditor.propTypes = {
  cards: PropTypes.array.isRequired,
  viewRef: PropTypes.object.isRequired,
};

export default CombinedEditor;
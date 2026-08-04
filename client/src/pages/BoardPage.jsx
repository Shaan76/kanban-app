import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Toaster } from 'react-hot-toast';
import useBoardStore from '../store/boardStore';
import api from '../lib/api';

// PASTE your real board ID from Thunder Client here
const REAL_BOARD_ID = '6a701dbf9de9295e3ac50390';

function BoardPage() {
  const { columns, cards, initBoard, moveCard, leaveBoard } = useBoardStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoard() {
      try {
        const columnsRes = await api.get('/boards/' + REAL_BOARD_ID + '/columns');
        const cardsRes = await api.get('/boards/' + REAL_BOARD_ID + '/cards');

        initBoard(REAL_BOARD_ID, columnsRes.data, cardsRes.data);
      } catch (error) {
        console.error('Failed to load board:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
    return () => leaveBoard();
  }, []);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const newColumnId = destination.droppableId;
    const newOrder = destination.index;

    moveCard(draggableId, newColumnId, newOrder);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading board...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Toaster position="top-right" />
      <h2>My Kanban Board</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {columns.map((col) => (
            <Droppable droppableId={col._id} key={col._id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: '#f4f4f4',
                    borderRadius: '8px',
                    padding: '1rem',
                    width: '250px',
                    minHeight: '300px',
                  }}
                >
                  <h3>{col.title}</h3>
                  {cards
                    .filter((c) => c.columnId === col._id)
                    .sort((a, b) => a.order - b.order)
                    .map((card, index) => (
                      <Draggable
                        draggableId={card._id}
                        index={index}
                        key={card._id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              background: 'white',
                              padding: '0.75rem',
                              borderRadius: '6px',
                              marginBottom: '0.5rem',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                              ...provided.draggableProps.style,
                            }}
                          >
                            {card.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default BoardPage;

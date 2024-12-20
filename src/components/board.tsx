import React, { useState, useEffect, useRef } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { bindAll, UnbindFn } from 'bind-event-listener';
import invariant from 'tiny-invariant';
import { Column } from './coloumn';
import { coloumn_data } from './dummyDara';
import {
  isCardData,
  isCardDropTargetData,
  isColumnData,
  isDraggingACard,
  isDraggingAColumn,
  TBoard,
  TCard,
  TColumn,
} from './data';

const defaultSettings = {
  isOverElementAutoScrollEnabled: true,
  boardScrollSpeed: 'fast',
  isBoardMoreObvious: false,
  isOverflowScrollingEnabled: true,
};

export function getInitialData(): TBoard {
  const columns: TColumn[] = coloumn_data.map((col) => ({
    id: col.id,
    title: col.title,
    cards: col.cards.map((card) => ({
      id: card.id,
      title: card.title,
      priorty: card.priority,
      description: card.description,
    })) as TCard[],
  }));
  return { columns };
}

export function Board({ initial }: { initial: TBoard }) {
  const [data, setData] = useState(initial);
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    return combine(
      monitorForElements({
        canMonitor: isDraggingACard,
        onDrop({ source, location }) {
          const dragging = source.data;
          if (!isCardData(dragging)) return;

          const innerMost = location.current.dropTargets[0];
          if (!innerMost) return;

          const dropTargetData = innerMost.data;
          const homeColumnIndex = data.columns.findIndex(
            (column) => column.id === dragging.columnId
          );
          const home = data.columns[homeColumnIndex];

          if (!home) return;

          const cardIndexInHome = home.cards.findIndex(
            (card) => card.id === dragging.card.id
          );

          // Reordering within the same column
          if (isCardDropTargetData(dropTargetData)) {
            const destinationColumnIndex = data.columns.findIndex(
              (column) => column.id === dropTargetData.columnId
            );
            const destination = data.columns[destinationColumnIndex];

            if (home === destination) {
              const cardFinishIndex = home.cards.findIndex(
                (card) => card.id === dropTargetData.card.id
              );
              const closestEdge = extractClosestEdge(dropTargetData);
              const reordered = reorderWithEdge({
                axis: 'vertical',
                list: home.cards,
                startIndex: cardIndexInHome,
                indexOfTarget: cardFinishIndex,
                closestEdgeOfTarget: closestEdge,
              });
              const updated: TColumn = { ...home, cards: reordered };
              const columns = [...data.columns];
              columns[homeColumnIndex] = updated;
              setData({ ...data, columns });
              return;
            }

            // Moving card to a different column
            const indexOfTarget = destination.cards.findIndex(
              (card) => card.id === dropTargetData.card.id
            );
            const closestEdge = extractClosestEdge(dropTargetData);
            const finalIndex =
              closestEdge === 'bottom' ? indexOfTarget + 1 : indexOfTarget;

            const homeCards = home.cards.filter(
              (card) => card.id !== dragging.card.id
            );
            const destinationCards = [...destination.cards];
            destinationCards.splice(finalIndex, 0, dragging.card);

            const columns = [...data.columns];
            columns[homeColumnIndex] = { ...home, cards: homeCards };
            columns[destinationColumnIndex] = {
              ...destination,
              cards: destinationCards,
            };
            setData({ ...data, columns });
            return;
          }

          // Dropping onto a column (reordering columns)
          if (isColumnData(dropTargetData)) {
            const destinationColumnIndex = data.columns.findIndex(
              (column) => column.id === dropTargetData.column.id
            );
            const destination = data.columns[destinationColumnIndex];

            if (home === destination) {
              const reordered = reorder({
                list: home.cards,
                startIndex: cardIndexInHome,
                finishIndex: home.cards.length - 1,
              });
              const updated: TColumn = { ...home, cards: reordered };
              const columns = [...data.columns];
              columns[homeColumnIndex] = updated;
              setData({ ...data, columns });
              return;
            }

            const homeCards = home.cards.filter(
              (card) => card.id !== dragging.card.id
            );
            const destinationCards = [...destination.cards, dragging.card];

            const columns = [...data.columns];
            columns[homeColumnIndex] = { ...home, cards: homeCards };
            columns[destinationColumnIndex] = {
              ...destination,
              cards: destinationCards,
            };
            setData({ ...data, columns });
          }
        },
      }),
      monitorForElements({
        canMonitor: isDraggingAColumn,
        onDrop({ source, location }) {
          const dragging = source.data;
          if (!isColumnData(dragging)) return;

          const innerMost = location.current.dropTargets[0];
          if (!innerMost) return;

          const dropTargetData = innerMost.data;
          if (!isColumnData(dropTargetData)) return;

          const homeIndex = data.columns.findIndex(
            (column) => column.id === dragging.column.id
          );
          const destinationIndex = data.columns.findIndex(
            (column) => column.id === dropTargetData.column.id
          );

          if (homeIndex === destinationIndex) return;

          const reordered = reorder({
            list: data.columns,
            startIndex: homeIndex,
            finishIndex: destinationIndex,
          });
          setData({ ...data, columns: reordered });
        },
      }),
      autoScrollForElements({
        canScroll({ source }) {
          return (
            defaultSettings.isOverElementAutoScrollEnabled &&
            (isDraggingACard({ source }) || isDraggingAColumn({ source }))
          );
        },
        element,
      })
    );
  }, [data]);

  useEffect(() => {
    let cleanupActive: UnbindFn | null = null;
    const scrollable = scrollableRef.current;
    invariant(scrollable);

    function begin({ startX }: { startX: number }) {
      let lastX = startX;
      const cleanupEvents = bindAll(
        window,
        [
          {
            type: 'pointermove',
            listener(event) {
              const currentX = event.clientX;
              const diffX = lastX - currentX;
              lastX = currentX;
              scrollable?.scrollBy({ left: diffX });
            },
          },
          ...[
            'pointercancel',
            'pointerup',
            'pointerdown',
            'keydown',
            'resize',
            'click',
            'visibilitychange',
          ].map((eventName) => ({
            type: eventName,
            listener: () => cleanupEvents(),
          })),
        ],
        { capture: true }
      );

      cleanupActive = cleanupEvents;
    }

    const cleanupStart = bindAll(scrollable, [
      {
        type: 'pointerdown',
        listener(event) {
          if (!(event.target instanceof HTMLElement)) return;
          if (event.target.closest(`[data-block-board-panning]`)) return;
          begin({ startX: event.clientX });
        },
      },
    ]);

    return () => {
      cleanupStart();
      cleanupActive?.();
    };
  }, []);

  return (
    <div className={`flex h-full flex-col`}>
      <div
        className={`flex h-full flex-col ${
          defaultSettings.isBoardMoreObvious ? 'px-32 py-20' : ''
        }`}
      >
        <div
          className={`flex h-full flex-row gap-3 overflow-x-auto p-3 [scrollbar-color:theme(colors.sky.600)_theme(colors.sky.800)] [scrollbar-width:thin] ${
            defaultSettings.isBoardMoreObvious
              ? 'rounded border-2 border-dashed'
              : ''
          }`}
          ref={scrollableRef}
        >
          {data.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </div>
      </div>
    </div>
  );
}

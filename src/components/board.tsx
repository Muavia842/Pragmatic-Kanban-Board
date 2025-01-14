import React, { useState, useEffect, useRef } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

import {
  TBoard,
  TColumn,
  isCardData,
  isColumnData,
  isCardDropTargetData,
  isDraggingACard,
} from '../data';
import { Column } from './coloumn';
import invariant from 'tiny-invariant';

const defaultSettings = {
  isOverElementAutoScrollEnabled: true,
};

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

      autoScrollForElements({
        canScroll({ source }) {
          return (
            defaultSettings.isOverElementAutoScrollEnabled &&
            isDraggingACard({ source })
          );
        },
        element,
      })
    );
  }, [data]);
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col">
        <div
          className={`flex h-full flex-row gap-3 overflow-x-auto [scrollbar-color:#374151_#1F2937] [scrollbar-width:thin]`}
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

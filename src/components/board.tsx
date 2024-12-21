// import React from 'react';
// import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
// import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
// import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
// import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
// import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
// import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
// import { useEffect, useRef, useState } from 'react';
// import invariant from 'tiny-invariant';
// import { Column } from './coloumn';
// import {
//   isCardData,
//   isCardDropTargetData,
//   isColumnData,
//   isDraggingACard,
//   isDraggingAColumn,
//   TBoard,
//   TCard,
//   TColumn,
// } from './data';
// // import { SettingsContext } from './settings-context';
// import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
// import { bindAll } from 'bind-event-listener';
// // import { blockBoardPanningAttr } from './data-attributes';
// import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
// // import { TSettings } from './settings';
// import { coloumn_data } from './dummyDara';
// const blockBoardPanningAttr = 'data-block-board-panning' as const;

// const defaultSettings = {
//   isBoardMoreObvious: false,
//   isOverElementAutoScrollEnabled: true,
//   boardScrollSpeed: 'fast',
//   columnScrollSpeed: 'standard',
//   isFPSPanelEnabled: false,
//   isCPUBurnEnabled: false,
//   isOverflowScrollingEnabled: true,
// };

// export function getInitialData(): TBoard {
//   const columns: TColumn[] = coloumn_data.map((col) => ({
//     id: col.id,
//     title: col.title,
//     cards: col.cards.map((card) => ({
//       id: card.id,
//       title: card.title,
//       description: card.description,
//     })) as TCard[],
//   }));

//   return { columns };
// }

// export function Board({ initial }: { initial: TBoard }) {
//   // export function Board({ initial }: { initial: TBoard }) {
//   const [data, setData] = useState(initial);

//   const scrollableRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const element = scrollableRef.current;
//     invariant(element);
//     return combine(
//       monitorForElements({
//         canMonitor: isDraggingACard,
//         onDrop({ source, location }) {
//           const dragging = source.data;
//           if (!isCardData(dragging)) {
//             return;
//           }

//           const innerMost = location.current.dropTargets[0];

//           if (!innerMost) {
//             return;
//           }
//           const dropTargetData = innerMost.data;
//           const homeColumnIndex = data.columns.findIndex(
//             (column) => column.id === dragging.columnId
//           );
//           const home: TColumn | undefined = data.columns[homeColumnIndex];

//           if (!home) {
//             return;
//           }
//           const cardIndexInHome = home.cards.findIndex(
//             (card) => card.id === dragging.card.id
//           );

//           // dropping on a card
//           if (isCardDropTargetData(dropTargetData)) {
//             const destinationColumnIndex = data.columns.findIndex(
//               (column) => column.id === dropTargetData.columnId
//             );
//             const destination = data.columns[destinationColumnIndex];
//             // reordering in home column
//             if (home === destination) {
//               const cardFinishIndex = home.cards.findIndex(
//                 (card) => card.id === dropTargetData.card.id
//               );

//               // could not find cards needed
//               if (cardIndexInHome === -1 || cardFinishIndex === -1) {
//                 return;
//               }

//               // no change needed
//               if (cardIndexInHome === cardFinishIndex) {
//                 return;
//               }

//               const closestEdge = extractClosestEdge(dropTargetData);

//               const reordered = reorderWithEdge({
//                 axis: 'vertical',
//                 list: home.cards,
//                 startIndex: cardIndexInHome,
//                 indexOfTarget: cardFinishIndex,
//                 closestEdgeOfTarget: closestEdge,
//               });

//               const updated: TColumn = {
//                 ...home,
//                 cards: reordered,
//               };
//               const columns = Array.from(data.columns);
//               columns[homeColumnIndex] = updated;
//               setData({ ...data, columns });
//               return;
//             }

//             // moving card from one column to another

//             // unable to find destination
//             if (!destination) {
//               return;
//             }

//             const indexOfTarget = destination.cards.findIndex(
//               (card) => card.id === dropTargetData.card.id
//             );

//             const closestEdge = extractClosestEdge(dropTargetData);
//             const finalIndex =
//               closestEdge === 'bottom' ? indexOfTarget + 1 : indexOfTarget;

//             // remove card from home list
//             const homeCards = Array.from(home.cards);
//             homeCards.splice(cardIndexInHome, 1);

//             // insert into destination list
//             const destinationCards = Array.from(destination.cards);
//             destinationCards.splice(finalIndex, 0, dragging.card);

//             const columns = Array.from(data.columns);
//             columns[homeColumnIndex] = {
//               ...home,
//               cards: homeCards,
//             };
//             columns[destinationColumnIndex] = {
//               ...destination,
//               cards: destinationCards,
//             };
//             setData({ ...data, columns });
//             return;
//           }

//           // dropping onto a column, but not onto a card
//           if (isColumnData(dropTargetData)) {
//             const destinationColumnIndex = data.columns.findIndex(
//               (column) => column.id === dropTargetData.column.id
//             );
//             const destination = data.columns[destinationColumnIndex];

//             if (!destination) {
//               return;
//             }

//             // dropping on home
//             if (home === destination) {
//               console.log('moving card to home column');

//               // move to last position
//               const reordered = reorder({
//                 list: home.cards,
//                 startIndex: cardIndexInHome,
//                 finishIndex: home.cards.length - 1,
//               });

//               const updated: TColumn = {
//                 ...home,
//                 cards: reordered,
//               };
//               const columns = Array.from(data.columns);
//               columns[homeColumnIndex] = updated;
//               setData({ ...data, columns });
//               return;
//             }

//             console.log('moving card to another column');

//             // remove card from home list

//             const homeCards = Array.from(home.cards);
//             homeCards.splice(cardIndexInHome, 1);

//             // insert into destination list
//             const destinationCards = Array.from(destination.cards);
//             destinationCards.splice(destination.cards.length, 0, dragging.card);

//             const columns = Array.from(data.columns);
//             columns[homeColumnIndex] = {
//               ...home,
//               cards: homeCards,
//             };
//             columns[destinationColumnIndex] = {
//               ...destination,
//               cards: destinationCards,
//             };
//             setData({ ...data, columns });
//             return;
//           }
//         },
//       }),
//       monitorForElements({
//         canMonitor: isDraggingAColumn,
//         onDrop({ source, location }) {
//           const dragging = source.data;
//           if (!isColumnData(dragging)) {
//             return;
//           }

//           const innerMost = location.current.dropTargets[0];

//           if (!innerMost) {
//             return;
//           }
//           const dropTargetData = innerMost.data;

//           if (!isColumnData(dropTargetData)) {
//             return;
//           }

//           const homeIndex = data.columns.findIndex(
//             (column) => column.id === dragging.column.id
//           );
//           const destinationIndex = data.columns.findIndex(
//             (column) => column.id === dropTargetData.column.id
//           );

//           if (homeIndex === -1 || destinationIndex === -1) {
//             return;
//           }

//           if (homeIndex === destinationIndex) {
//             return;
//           }

//           const reordered = reorder({
//             list: data.columns,
//             startIndex: homeIndex,
//             finishIndex: destinationIndex,
//           });
//           setData({ ...data, columns: reordered });
//         },
//       }),
//       autoScrollForElements({
//         canScroll({ source }) {
//           if (!defaultSettings.isOverElementAutoScrollEnabled) {
//             return false;
//           }

//           return isDraggingACard({ source }) || isDraggingAColumn({ source });
//         },
//         getConfiguration: () => ({
//           maxScrollSpeed: defaultSettings.boardScrollSpeed,
//         }),
//         element,
//       }),
//       unsafeOverflowAutoScrollForElements({
//         element,
//         getConfiguration: () => ({
//           maxScrollSpeed: defaultSettings.boardScrollSpeed,
//         }),
//         canScroll({ source }) {
//           if (!defaultSettings.isOverElementAutoScrollEnabled) {
//             return false;
//           }

//           if (!defaultSettings.isOverflowScrollingEnabled) {
//             return false;
//           }

//           return isDraggingACard({ source }) || isDraggingAColumn({ source });
//         },
//         getOverflow() {
//           return {
//             forLeftEdge: {
//               top: 1000,
//               left: 1000,
//               bottom: 1000,
//             },
//             forRightEdge: {
//               top: 1000,
//               right: 1000,
//               bottom: 1000,
//             },
//           };
//         },
//       })
//     );
//   }, [data, defaultSettings]);

//   // Panning the board
//   useEffect(() => {
//     let cleanupActive: CleanupFn | null = null;
//     const scrollable = scrollableRef.current;
//     invariant(scrollable);

//     function begin({ startX }: { startX: number }) {
//       let lastX = startX;

//       const cleanupEvents = bindAll(
//         window,
//         [
//           {
//             type: 'pointermove',
//             listener(event) {
//               const currentX = event.clientX;
//               const diffX = lastX - currentX;

//               lastX = currentX;
//               scrollable?.scrollBy({ left: diffX });
//             },
//           },
//           // stop panning if we see any of these events
//           ...(
//             [
//               'pointercancel',
//               'pointerup',
//               'pointerdown',
//               'keydown',
//               'resize',
//               'click',
//               'visibilitychange',
//             ] as const
//           ).map((eventName) => ({
//             type: eventName,
//             listener: () => cleanupEvents(),
//           })),
//         ],
//         // need to make sure we are not after the "pointerdown" on the scrollable
//         // Also this is helpful to make sure we always hear about events from this point
//         { capture: true }
//       );

//       cleanupActive = cleanupEvents;
//     }

//     const cleanupStart = bindAll(scrollable, [
//       {
//         type: 'pointerdown',
//         listener(event) {
//           if (!(event.target instanceof HTMLElement)) {
//             return;
//           }
//           // ignore interactive elements
//           if (event.target.closest(`[${blockBoardPanningAttr}]`)) {
//             return;
//           }

//           begin({ startX: event.clientX });
//         },
//       },
//     ]);

//     return function cleanupAll() {
//       cleanupStart();
//       cleanupActive?.();
//     };
//   }, []);

//   return (
//     <div className={`flex h-full flex-col`}>
//       <div
//         className={`flex h-full flex-col ${
//           defaultSettings.isBoardMoreObvious ? 'px-32 py-20' : ''
//         }`}
//       >
//         <div
//           className={`flex h-full flex-row gap-3 overflow-x-auto p-3 [scrollbar-color:theme(colors.sky.600)_theme(colors.sky.800)] [scrollbar-width:thin] ${
//             defaultSettings.isBoardMoreObvious
//               ? 'rounded border-2 border-dashed'
//               : ''
//           }`}
//           ref={scrollableRef}
//         >
//           {data.columns.map((column) => (
//             <Column key={column.id} column={column} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

//////////////////// good start
// import React, { useEffect, useRef, useState } from 'react';
// import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
// import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
// import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
// import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
// import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
// import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
// import { bindAll } from 'bind-event-listener';
// import invariant from 'tiny-invariant';
// import { Column } from './coloumn';
// import {
//   isCardData,
//   isCardDropTargetData,
//   isColumnData,
//   isDraggingACard,
//   isDraggingAColumn,
//   TBoard,
//   TCard,
//   TColumn,
// } from './data';
// import { coloumn_data } from './dummyDara';
// import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

// const defaultSettings = {
//   isBoardMoreObvious: false,
//   isOverElementAutoScrollEnabled: true,
//   boardScrollSpeed: 'fast',
//   columnScrollSpeed: 'standard',
//   isOverflowScrollingEnabled: true,
// };

// const blockBoardPanningAttr = 'data-block-board-panning' as const;

// export function getInitialData(): TBoard {
//   return {
//     columns: coloumn_data.map((col) => ({
//       id: col.id,
//       title: col.title,
//       cards: col.cards.map(({ id, title, description }) => ({
//         id,
//         title,
//         description,
//       })),
//     })),
//   };
// }

// export function Board({ initial }: { initial: TBoard }) {
//   const [data, setData] = useState(initial);
//   const scrollableRef = useRef<HTMLDivElement | null>(null);

//   const handleCardDrop = ({ source, location }) => {
//     const dragging = source.data;
//     if (!isCardData(dragging)) return;

//     const innerMost = location.current.dropTargets[0];
//     if (!innerMost) return;

//     const dropTargetData = innerMost.data;
//     const homeColumn = data.columns.find((col) => col.id === dragging.columnId);
//     if (!homeColumn) return;

//     const cardIndex = homeColumn.cards.findIndex(
//       (card) => card.id === dragging.card.id
//     );
//     if (cardIndex === -1) return;

//     if (isCardDropTargetData(dropTargetData)) {
//       const destinationColumn = data.columns.find(
//         (col) => col.id === dropTargetData.columnId
//       );
//       if (!destinationColumn) return;

//       const targetIndex = destinationColumn.cards.findIndex(
//         (card) => card.id === dropTargetData.card.id
//       );
//       const closestEdge = extractClosestEdge(dropTargetData);

//       if (homeColumn === destinationColumn) {
//         const reordered = reorderWithEdge({
//           axis: 'vertical',
//           list: homeColumn.cards,
//           startIndex: cardIndex,
//           indexOfTarget: targetIndex,
//           closestEdgeOfTarget: closestEdge,
//         });

//         updateColumn(homeColumn.id, reordered);
//       } else {
//         const finalIndex =
//           closestEdge === 'bottom' ? targetIndex + 1 : targetIndex;
//         moveCardBetweenColumns(
//           homeColumn,
//           destinationColumn,
//           cardIndex,
//           finalIndex
//         );
//       }
//     } else if (isColumnData(dropTargetData)) {
//       const destinationColumn = data.columns.find(
//         (col) => col.id === dropTargetData.column.id
//       );
//       if (!destinationColumn) return;

//       homeColumn === destinationColumn
//         ? reorderInColumn(homeColumn, cardIndex)
//         : moveCardBetweenColumns(
//             homeColumn,
//             destinationColumn,
//             cardIndex,
//             destinationColumn.cards.length
//           );
//     }
//   };

//   // const handleColumnDrop = ({ source, location }) => {
//   //   const dragging = source.data;
//   //   if (!isColumnData(dragging)) return;

//   //   const dropTargetData = location.current.dropTargets[0]?.data;
//   //   if (!dropTargetData || !isColumnData(dropTargetData)) return;

//   //   const homeIndex = data.columns.findIndex(
//   //     (col) => col.id === dragging.column.id
//   //   );
//   //   const destinationIndex = data.columns.findIndex(
//   //     (col) => col.id === dropTargetData.column.id
//   //   );

//   //   if (
//   //     homeIndex === -1 ||
//   //     destinationIndex === -1 ||
//   //     homeIndex === destinationIndex
//   //   )
//   //     return;

//   //   const reordered = reorder({
//   //     list: data.columns,
//   //     startIndex: homeIndex,
//   //     finishIndex: destinationIndex,
//   //   });
//   //   setData({ ...data, columns: reordered });
//   // };

//   const updateColumn = (columnId: string, updatedCards: TCard[]) => {
//     const updatedColumns = data.columns.map((col) =>
//       col.id === columnId ? { ...col, cards: updatedCards } : col
//     );
//     setData({ ...data, columns: updatedColumns });
//   };

//   const moveCardBetweenColumns = (
//     home: TColumn,
//     destination: TColumn,
//     homeIndex: number,
//     destinationIndex: number
//   ) => {
//     const homeCards = [...home.cards];
//     const destinationCards = [...destination.cards];
//     homeCards.splice(homeIndex, 1);
//     destinationCards.splice(destinationIndex, 0, home.cards[homeIndex]);

//     updateColumn(home.id, homeCards);
//     updateColumn(destination.id, destinationCards);
//   };

//   const reorderInColumn = (home: TColumn, cardIndex: number) => {
//     const reordered = reorder({
//       list: home.cards,
//       startIndex: cardIndex,
//       finishIndex: home.cards.length - 1,
//     });
//     updateColumn(home.id, reordered);
//   };

//   useEffect(() => {
//     const element = scrollableRef.current;
//     invariant(element);
//     return combine(
//       monitorForElements({
//         canMonitor: isDraggingACard,
//         onDrop: handleCardDrop,
//       }),
//       monitorForElements({
//         canMonitor: isDraggingAColumn,
//         // onDrop: handleColumnDrop,
//       }),
//       autoScrollForElements({
//         canScroll: ({ source }) =>
//           defaultSettings.isOverElementAutoScrollEnabled &&
//           (isDraggingACard({ source }) || isDraggingAColumn({ source })),
//         getConfiguration: () => ({
//           maxScrollSpeed: defaultSettings.boardScrollSpeed,
//         }),
//         element,
//       })
//     );
//   }, [data]);

//   useEffect(() => {
//     let cleanupActive: CleanupFn | null = null;
//     const scrollable = scrollableRef.current;
//     invariant(scrollable);

//     const begin = ({ startX }: { startX: number }) => {
//       let lastX = startX;
//       const cleanupEvents = bindAll(
//         window,
//         [
//           {
//             type: 'pointermove',
//             listener: (event) =>
//               scrollable?.scrollBy({ left: lastX - event.clientX }),
//           },
//           ...[
//             'pointercancel',
//             'pointerup',
//             'pointerdown',
//             'keydown',
//             'resize',
//             'click',
//             'visibilitychange',
//           ].map((eventName) => ({
//             type: eventName,
//             listener: () => cleanupEvents(),
//           })),
//         ],
//         { capture: true }
//       );
//       cleanupActive = cleanupEvents;
//     };

//     const cleanupStart = bindAll(scrollable, [
//       {
//         type: 'pointerdown',
//         listener: (event) =>
//           event.target.closest(`[${blockBoardPanningAttr}]`) ||
//           begin({ startX: event.clientX }),
//       },
//     ]);

//     return () => {
//       cleanupStart();
//       cleanupActive?.();
//     };
//   }, []);

//   return (
//     <div className={`flex h-full flex-col`}>
//       <div
//         className={`flex h-full flex-col ${
//           defaultSettings.isBoardMoreObvious ? 'px-32 py-20' : ''
//         }`}
//       >
//         <div
//           ref={scrollableRef}
//           className={`flex h-full flex-row gap-3 overflow-x-auto p-3 [scrollbar-color:theme(colors.sky.600)_theme(colors.sky.800)] [scrollbar-width:thin] ${
//             defaultSettings.isBoardMoreObvious
//               ? 'rounded border-2 border-dashed'
//               : ''
//           }`}
//         >
//           {data.columns.map((column) => (
//             <Column key={column.id} column={column} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
//////////////// goood end
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

///////////implement new
// import React, { useEffect, useRef, useState } from 'react';
// import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
// import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
// import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
// import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
// import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
// import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
// import { bindAll } from 'bind-event-listener';
// import invariant from 'tiny-invariant';
// import { Column } from './coloumn';
// import {
//   isCardData,
//   isCardDropTargetData,
//   isColumnData,
//   isDraggingACard,
//   isDraggingAColumn,
//   TBoard,
//   TCard,
//   TColumn,
// } from './data';
// import { coloumn_data } from './dummyDara';
// import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

// const defaultSettings = {
//   isBoardMoreObvious: false,
//   isOverElementAutoScrollEnabled: true,
//   boardScrollSpeed: 'fast',
//   columnScrollSpeed: 'standard',
//   isOverflowScrollingEnabled: true,
// };

// const blockBoardPanningAttr = 'data-block-board-panning' as const;

// export function getInitialData(): TBoard {
//   return {
//     columns: coloumn_data.map((col) => ({
//       id: col.id,
//       title: col.title,
//       cards: col.cards.map(({ id, title, description }) => ({
//         id,
//         title,
//         description,
//       })),
//     })),
//   };
// }

// export function Board({ initial }: { initial: TBoard }) {
//   const [data, setData] = useState(initial);
//   const scrollableRef = useRef<HTMLDivElement | null>(null);

//   const handleCardDrop = ({ source, location }) => {
//     const dragging = source.data;
//     if (!isCardData(dragging)) return;

//     const innerMost = location.current.dropTargets[0];
//     if (!innerMost) return;

//     const dropTargetData = innerMost.data;
//     const homeColumn = data.columns.find((col) => col.id === dragging.columnId);
//     if (!homeColumn) return;

//     const cardIndex = homeColumn.cards.findIndex(
//       (card) => card.id === dragging.card.id
//     );
//     if (cardIndex === -1) return;

//     if (isCardDropTargetData(dropTargetData)) {
//       const destinationColumn = data.columns.find(
//         (col) => col.id === dropTargetData.columnId
//       );
//       if (!destinationColumn) return;

//       const targetIndex = destinationColumn.cards.findIndex(
//         (card) => card.id === dropTargetData.card.id
//       );
//       const closestEdge = extractClosestEdge(dropTargetData);

//       if (homeColumn === destinationColumn) {
//         const reordered = reorderWithEdge({
//           axis: 'vertical',
//           list: homeColumn.cards,
//           startIndex: cardIndex,
//           indexOfTarget: targetIndex,
//           closestEdgeOfTarget: closestEdge,
//         });

//         updateColumn(homeColumn.id, reordered);
//       } else {
//         const finalIndex =
//           closestEdge === 'bottom' ? targetIndex + 1 : targetIndex;
//         moveCardBetweenColumns(
//           homeColumn,
//           destinationColumn,
//           cardIndex,
//           finalIndex
//         );
//       }
//     } else if (isColumnData(dropTargetData)) {
//       const destinationColumn = data.columns.find(
//         (col) => col.id === dropTargetData.column.id
//       );
//       if (!destinationColumn) return;

//       homeColumn === destinationColumn
//         ? reorderInColumn(homeColumn, cardIndex)
//         : moveCardBetweenColumns(
//             homeColumn,
//             destinationColumn,
//             cardIndex,
//             destinationColumn.cards.length
//           );
//     }
//   };

//   const updateColumn = (columnId: string, updatedCards: TCard[]) => {
//     const updatedColumns = data.columns.map((col) =>
//       col.id === columnId ? { ...col, cards: updatedCards } : col
//     );
//     setData({ ...data, columns: updatedColumns });
//   };

//   const moveCardBetweenColumns = (
//     home: TColumn,
//     destination: TColumn,
//     homeIndex: number,
//     destinationIndex: number
//   ) => {
//     const homeCards = [...home.cards];
//     const destinationCards = [...destination.cards];
//     homeCards.splice(homeIndex, 1);
//     destinationCards.splice(destinationIndex, 0, home.cards[homeIndex]);

//     updateColumn(home.id, homeCards);
//     updateColumn(destination.id, destinationCards);
//   };

//   const reorderInColumn = (home: TColumn, cardIndex: number) => {
//     const reordered = reorder({
//       list: home.cards,
//       startIndex: cardIndex,
//       finishIndex: home.cards.length - 1,
//     });
//     updateColumn(home.id, reordered);
//   };

//   useEffect(() => {
//     const element = scrollableRef.current;
//     invariant(element);
//     return combine(
//       monitorForElements({
//         canMonitor: isDraggingACard,
//         onDrop: handleCardDrop,
//       }),
//       autoScrollForElements({
//         canScroll: ({ source }) =>
//           defaultSettings.isOverElementAutoScrollEnabled &&
//           (isDraggingACard({ source }) || isDraggingAColumn({ source })),
//         getConfiguration: () => ({
//           maxScrollSpeed: defaultSettings.boardScrollSpeed,
//         }),
//         element,
//       })
//     );
//   }, [data]);

//   useEffect(() => {
//     let cleanupActive: CleanupFn | null = null;
//     const scrollable = scrollableRef.current;
//     invariant(scrollable);

//     const begin = ({ startX }: { startX: number }) => {
//       let lastX = startX;
//       const cleanupEvents = bindAll(
//         window,
//         [
//           {
//             type: 'pointermove',
//             listener: (event) =>
//               scrollable?.scrollBy({ left: lastX - event.clientX }),
//           },
//           ...[
//             'pointercancel',
//             'pointerup',
//             'pointerdown',
//             'keydown',
//             'resize',
//             'click',
//             'visibilitychange',
//           ].map((eventName) => ({
//             type: eventName,
//             listener: () => cleanupEvents(),
//           })),
//         ],
//         { capture: true }
//       );
//       cleanupActive = cleanupEvents;
//     };

//     const cleanupStart = bindAll(scrollable, [
//       {
//         type: 'pointerdown',
//         listener: (event) =>
//           event.target.closest(`[${blockBoardPanningAttr}]`) ||
//           begin({ startX: event.clientX }),
//       },
//     ]);

//     return () => {
//       cleanupStart();
//       cleanupActive?.();
//     };
//   }, []);

//   return (
//     <div className={`flex h-full flex-col`}>
//       <div
//         className={`flex h-full flex-col ${
//           defaultSettings.isBoardMoreObvious ? 'px-32 py-20' : ''
//         }`}
//       >
//         <div
//           ref={scrollableRef}
//           className={`flex h-full flex-row gap-3 overflow-x-auto p-3 [scrollbar-color:theme(colors.sky.600)_theme(colors.sky.800)] [scrollbar-width:thin] ${
//             defaultSettings.isBoardMoreObvious
//               ? 'rounded border-2 border-dashed'
//               : ''
//           }`}
//         >
//           {data.columns.map((column) => (
//             <Column key={column.id} column={column} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

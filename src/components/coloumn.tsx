import React, { memo, useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import invariant from 'tiny-invariant';
import { Copy, Ellipsis, Plus } from 'lucide-react';

import { Card, CardShadow } from './card';
import {
  getColumnData,
  isCardData,
  isCardDropTargetData,
  isDraggingACard,
  isDraggingAColumn,
  TCardData,
  TColumn,
} from './data';
import { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

const defaultSettings = {
  isOverElementAutoScrollEnabled: true,
  columnScrollSpeed: 'standard',
  isOverflowScrollingEnabled: true,
};

const idleState = { type: 'idle' };

/**
 * A memoized component for rendering out the card.
 *
 * Created so that state changes to the column don't require all cards to be rendered
 */
const CardList = memo(function CardList({ column }: { column: TColumn }) {
  return column.cards.map((card) => (
    <Card key={card.id} card={card} columnId={column.id} />
  ));
});

export function Column({ column }: { column: TColumn }) {
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const outerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState(idleState);

  useEffect(() => {
    const outer = outerRef.current;
    const scrollable = scrollableRef.current;
    const header = headerRef.current;
    const inner = innerRef.current;

    invariant(outer && scrollable && header && inner);

    const columnData = getColumnData({ column });

    const handleCardDrag = ({
      data,
      location,
    }: {
      data: TCardData;
      location: DragLocationHistory;
    }) => {
      const isOverChildCard = Boolean(
        location.current.dropTargets[0]?.data &&
          isCardDropTargetData(location.current.dropTargets[0].data)
      );
      const proposed = {
        type: 'is-card-over',
        dragging: data.rect,
        isOverChildCard,
      };

      setState((prev) =>
        JSON.stringify(prev) === JSON.stringify(proposed) ? prev : proposed
      );
    };

    return combine(
      dropTargetForElements({
        element: outer,
        getData: () => columnData,
        canDrop: ({ source }) =>
          isDraggingACard({ source }) || isDraggingAColumn({ source }),
        getIsSticky: () => true,
        onDragStart: ({ source, location }) => {
          if (isCardData(source.data))
            handleCardDrag({ data: source.data, location });
        },
        onDragEnter: ({ source, location }) => {
          if (isCardData(source.data))
            handleCardDrag({ data: source.data, location });
        },
        onDropTargetChange: ({ source, location }) => {
          if (isCardData(source.data))
            handleCardDrag({ data: source.data, location });
        },
        onDragLeave: ({ source }) => {
          if (
            isDraggingAColumn({ source }) &&
            source.data.column.id === column.id
          )
            return;
          setState(idleState);
        },
        onDrop: () => setState(idleState),
      }),
      autoScrollForElements({
        canScroll: ({ source }) =>
          defaultSettings.isOverElementAutoScrollEnabled &&
          isDraggingACard({ source }),
        getConfiguration: () => ({
          maxScrollSpeed: defaultSettings.columnScrollSpeed,
        }),
        element: scrollable,
      }),
      unsafeOverflowAutoScrollForElements({
        element: scrollable,
        getConfiguration: () => ({
          maxScrollSpeed: defaultSettings.columnScrollSpeed,
        }),
        canScroll({ source }) {
          if (!defaultSettings.isOverElementAutoScrollEnabled) {
            return false;
          }

          if (!defaultSettings.isOverflowScrollingEnabled) {
            return false;
          }

          return isDraggingACard({ source });
        },
        getOverflow() {
          return {
            forTopEdge: {
              top: 1000,
            },
            forBottomEdge: {
              bottom: 1000,
            },
          };
        },
      })
    );
  }, [column]);

  return (
    <div
      className="flex w-72 flex-shrink-0 select-none flex-col"
      ref={outerRef}
    >
      <div
        className="flex max-h-full flex-col rounded-lg bg-slate-800 text-neutral-50"
        ref={innerRef}
      >
        <div className="flex max-h-full flex-col">
          <div
            className="flex flex-row items-center justify-between p-3 pb-2"
            ref={headerRef}
          >
            <div className="pl-2 font-bold">{column.title}</div>
            <button
              className="rounded p-2 hover:bg-slate-700 active:bg-slate-600"
              aria-label="More actions"
            >
              <Ellipsis size={16} />
            </button>
          </div>
          <div
            className="flex flex-col overflow-y-auto [scrollbar-color:theme(colors.slate.600)_theme(colors.slate.700)] [scrollbar-width:thin]"
            ref={scrollableRef}
          >
            <CardList column={column} />
            {state.type === 'is-card-over' && !state.isOverChildCard && (
              <div className="flex-shrink-0 px-3 py-1">
                <CardShadow dragging={state.dragging} />
              </div>
            )}
          </div>
          <div className="flex gap-2 p-3">
            <button className="flex flex-grow gap-1 rounded p-2 hover:bg-slate-700 active:bg-slate-600">
              <Plus size={16} />
              <span>Add a card</span>
            </button>
            <button
              className="rounded p-2 hover:bg-slate-700 active:bg-slate-600"
              aria-label="Create card from template"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

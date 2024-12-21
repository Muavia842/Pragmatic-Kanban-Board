// import React from 'react';
// import {
//   draggable,
//   dropTargetForElements,
// } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
// import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
// import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
// import { MutableRefObject, useEffect, useRef, useState } from 'react';
// import { createPortal } from 'react-dom';
// import invariant from 'tiny-invariant';

// import {
//   type Edge,
//   attachClosestEdge,
//   extractClosestEdge,
// } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
// import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
// import {
//   getCardData,
//   getCardDropTargetData,
//   isCardData,
//   isDraggingACard,
//   TCard,
// } from './data';
// // import { isShallowEqual } from './is-shallow-equal';

// type TCardState =
//   | {
//       type: 'idle';
//     }
//   | {
//       type: 'is-dragging';
//     }
//   | {
//       type: 'is-dragging-and-left-self';
//     }
//   | {
//       type: 'is-over';
//       dragging: DOMRect;
//       closestEdge: Edge;
//     }
//   | {
//       type: 'preview';
//       container: HTMLElement;
//       dragging: DOMRect;
//     };

// const idle: TCardState = { type: 'idle' };

// const innerStyles: { [Key in TCardState['type']]?: string } = {
//   idle: 'hover:outline outline-2 outline-neutral-50 cursor-grab',
//   'is-dragging': 'opacity-40',
// };

// const outerStyles: { [Key in TCardState['type']]?: string } = {
//   // We no longer render the draggable item after we have left it
//   // as it's space will be taken up by a shadow on adjacent items.
//   // Using `display:none` rather than returning `null` so we can always
//   // return refs from this component.
//   // Keeping the refs allows us to continue to receive events during the drag.
//   'is-dragging-and-left-self': 'hidden',
// };

// export function CardShadow({ dragging }: { dragging: DOMRect }) {
//   return (
//     <div
//       className="flex-shrink-0 rounded bg-slate-900"
//       style={{ height: dragging.height }}
//     />
//   );
// }

// export function CardDisplay({
//   card,
//   state,
//   outerRef,
//   innerRef,
// }: {
//   card: TCard;
//   state: TCardState;
//   outerRef?: React.MutableRefObject<HTMLDivElement | null>;
//   innerRef?: MutableRefObject<HTMLDivElement | null>;
// }) {
//   return (
//     <div
//       ref={outerRef}
//       className={`flex flex-shrink-0 flex-col gap-2 px-3 py-1 ${
//         outerStyles[state.type]
//       }`}
//     >
//       {/* Put a shadow before the item if closer to the top edge */}
//       {state.type === 'is-over' && state.closestEdge === 'top' ? (
//         <CardShadow dragging={state.dragging} />
//       ) : null}
//       <div
//         className={`rounded bg-slate-700 p-2 text-slate-300 ${
//           innerStyles[state.type]
//         }`}
//         ref={innerRef}
//         style={
//           state.type === 'preview'
//             ? {
//                 width: state.dragging.width,
//                 height: state.dragging.height,
//                 transform: 'rotate(4deg)',
//               }
//             : undefined
//         }
//       >
//         <div>{card.description}</div>
//       </div>
//       {/* Put a shadow after the item if closer to the bottom edge */}
//       {state.type === 'is-over' && state.closestEdge === 'bottom' ? (
//         <CardShadow dragging={state.dragging} />
//       ) : null}
//     </div>
//   );
// }

// export function Card({ card, columnId }: { card: TCard; columnId: string }) {
//   const outerRef = useRef<HTMLDivElement | null>(null);
//   const innerRef = useRef<HTMLDivElement | null>(null);
//   const [state, setState] = useState<TCardState>(idle);

//   useEffect(() => {
//     const outer = outerRef.current;
//     const inner = innerRef.current;
//     invariant(outer && inner);

//     return combine(
//       draggable({
//         element: inner,
//         getInitialData: ({ element }) =>
//           getCardData({
//             card,
//             columnId,
//             rect: element.getBoundingClientRect(),
//           }),
//         onGenerateDragPreview({ nativeSetDragImage, location, source }) {
//           const data = source.data;
//           invariant(isCardData(data));
//           setCustomNativeDragPreview({
//             nativeSetDragImage,
//             getOffset: preserveOffsetOnSource({
//               element: inner,
//               input: location.current.input,
//             }),
//             render({ container }) {
//               // Demonstrating using a react portal to generate a preview
//               setState({
//                 type: 'preview',
//                 container,
//                 dragging: inner.getBoundingClientRect(),
//               });
//             },
//           });
//         },
//         onDragStart() {
//           setState({ type: 'is-dragging' });
//         },
//         onDrop() {
//           setState(idle);
//         },
//       }),
//       dropTargetForElements({
//         element: outer,
//         getIsSticky: () => true,
//         canDrop: isDraggingACard,
//         getData: ({ element, input }) => {
//           const data = getCardDropTargetData({ card, columnId });
//           return attachClosestEdge(data, {
//             element,
//             input,
//             allowedEdges: ['top', 'bottom'],
//           });
//         },
//         onDragEnter({ source, self }) {
//           if (!isCardData(source.data)) {
//             return;
//           }
//           if (source.data.card.id === card.id) {
//             return;
//           }
//           const closestEdge = extractClosestEdge(self.data);
//           if (!closestEdge) {
//             return;
//           }

//           setState({
//             type: 'is-over',
//             dragging: source.data.rect,
//             closestEdge,
//           });
//         },
//         onDrag({ source, self }) {
//           if (!isCardData(source.data)) {
//             return;
//           }
//           if (source.data.card.id === card.id) {
//             return;
//           }
//           const closestEdge = extractClosestEdge(self.data);
//           if (!closestEdge) {
//             return;
//           }
//           // optimization - Don't update react state if we don't need to.
//           const proposed: TCardState = {
//             type: 'is-over',
//             dragging: source.data.rect,
//             closestEdge,
//           };
//           setState((current) => {
//             // Compare proposed and current to decide if state should be updated
//             if (JSON.stringify(proposed) === JSON.stringify(current)) {
//               return current; // No update needed
//             }
//             return proposed; // Update state
//           });
//         },
//         onDragLeave({ source }) {
//           if (!isCardData(source.data)) {
//             return;
//           }
//           if (source.data.card.id === card.id) {
//             setState({ type: 'is-dragging-and-left-self' });
//             return;
//           }
//           setState(idle);
//         },
//         onDrop() {
//           setState(idle);
//         },
//       })
//     );
//   }, [card, columnId]);
//   return (
//     <>
//       <CardDisplay
//         outerRef={outerRef}
//         innerRef={innerRef}
//         state={state}
//         card={card}
//       />
//       {state.type === 'preview'
//         ? createPortal(
//             <CardDisplay state={state} card={card} />,
//             state.container
//           )
//         : null}
//     </>
//   );
// }

import React, { useEffect, useRef, useState, MutableRefObject } from 'react';
import { createPortal } from 'react-dom';
import invariant from 'tiny-invariant';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  getCardData,
  getCardDropTargetData,
  isCardData,
  isDraggingACard,
  TCard,
} from './data';
import {
  Edge,
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import clsx from 'clsx';
import {
  EllipsisVertical,
  MessageCircle,
  MoveVertical,
  Paperclip,
  Plus,
} from 'lucide-react';

import user1 from '../assets/user1.jpg';
import user2 from '../assets/user2.jpg';
import user3 from '../assets/user3.jpg';
const userdata = [
  { id: 1, profile: user1 },
  { id: 2, profile: user2 },
  { id: 3, profile: user3 },
];
type TCardState =
  | { type: 'idle' }
  | { type: 'is-dragging' }
  | { type: 'is-dragging-and-left-self' }
  | { type: 'is-over'; dragging: DOMRect; closestEdge: Edge }
  | { type: 'preview'; container: HTMLElement; dragging: DOMRect };

const idle: TCardState = { type: 'idle' };

const innerStyles: { [Key in TCardState['type']]?: string } = {
  idle: 'hover:outline outline-2  outline-neutral-50 cursor-grab',
  'is-dragging': 'opacity-40 ',
};

const outerStyles: { [Key in TCardState['type']]?: string } = {
  'is-dragging-and-left-self': 'hidden',
};
const priorityColors = {
  Heigh: 'bg-red-400', // High priority
  Meduim: 'bg-yellow-700', // Medium priority
  low: 'bg-green-500', // Low priority
  default: 'bg-green-400', // Default if no match
};
export const CardShadow = ({ dragging }: { dragging: DOMRect }) => (
  <div
    className="flex-shrink-0 rounded bg-slate-900"
    style={{ height: dragging.height }}
  />
);

const CardDisplay = ({
  card,
  state,
  outerRef,
  innerRef,
}: {
  card: TCard;
  state: TCardState;
  outerRef?: React.MutableRefObject<HTMLDivElement | null>;
  innerRef?: MutableRefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={outerRef}
    className={clsx(
      `flex flex-shrink-0 flex-col gap-2 px-3 py-1 `,
      outerStyles[state.type]
    )}
  >
    {state.type === 'is-over' && state.closestEdge === 'top' && (
      <CardShadow dragging={state.dragging} />
    )}
    <div
      ref={innerRef}
      className={clsx(
        'rounded bg-slate-700 p-2 text-slate-200 ',
        innerStyles[state.type],
        state.type === 'is-dragging'
          ? 'animate-jump-out outline-2  outline-neutral-50'
          : 'animate-jump-in outline-2  outline-neutral-50'
      )}
      style={
        state.type === 'preview'
          ? {
              width: state.dragging.width,
              height: state.dragging.height,
              transform: 'rotate(4deg)',
              transition: 'transition-all duration-500ms ease-in',
              border: '2px solid  white',
            }
          : undefined
      }
    >
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between">
          <h1
            className={clsx(
              'w-[60px] h-[25px] rounded flex justify-center items-center text-sm',
              priorityColors[card.priorty] || priorityColors.default // Use card.priority
            )}
          >
            {card.priorty}
          </h1>
        </div>

        <h1 className="text-base font-medium">{card.title}</h1>
        <p className=" truncate text-sm mt-[-5px]">{card.description}</p>
        <div className="flex justify-between items-center pt-4">
          <div className="flex">
            {userdata.map((data, i) => (
              <img
                key={i}
                src={data.profile}
                alt="user"
                className="h-7 w-7  rounded-full border-2 border-gray-400"
              />
            ))}
          </div>
          <div className="flex gap-4">
            <div className="text-sm flex items-center gap-1 text-gray-400">
              <span>
                <Paperclip className="h-4 w-4" />
              </span>
              {/* {task.files} */}
            </div>
            <div className="text-sm flex items-center gap-1 text-gray-400">
              <span>
                <MessageCircle className="h-4 w-4" />
              </span>
              {/* {task.comments} */}
            </div>
          </div>
        </div>
      </div>
    </div>
    {state.type === 'is-over' && state.closestEdge === 'bottom' && (
      <CardShadow dragging={state.dragging} />
    )}
  </div>
);

export function Card({ card, columnId }: { card: TCard; columnId: string }) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TCardState>(idle);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    invariant(outer && inner);

    return combine(
      draggable({
        element: inner,
        getInitialData: ({ element }) =>
          getCardData({
            card,
            columnId,
            rect: element.getBoundingClientRect(),
          }),
        onGenerateDragPreview({ nativeSetDragImage, location, source }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: inner,
              input: location.current.input,
            }),
            render({ container }) {
              setState({
                type: 'preview',
                container,
                dragging: inner.getBoundingClientRect(),
              });
            },
          });
        },
        onDragStart() {
          setState({ type: 'is-dragging' });
        },
        onDrop() {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element: outer,
        getIsSticky: () => true,
        canDrop: isDraggingACard,
        getData: ({ element, input }) =>
          attachClosestEdge(getCardDropTargetData({ card, columnId }), {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          }),
        onDragEnter({ source, self }) {
          if (!isCardData(source.data) || source.data.card.id === card.id)
            return;

          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) return;

          const draggingRect = source.data.rect as DOMRect; // Explicit type assertion
          setState({
            type: 'is-over',
            dragging: draggingRect,
            closestEdge,
          });
        },
        onDrag({ source, self }) {
          if (!isCardData(source.data) || source.data.card.id === card.id)
            return;

          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) return;

          const draggingRect = source.data.rect as DOMRect; // Explicit type assertion
          setState((current) =>
            JSON.stringify({
              type: 'is-over',
              dragging: draggingRect,
              closestEdge,
            }) === JSON.stringify(current)
              ? current
              : { type: 'is-over', dragging: draggingRect, closestEdge }
          );
        },

        onDragLeave({ source }) {
          if (!isCardData(source.data) || source.data.card.id === card.id)
            return setState({ type: 'is-dragging-and-left-self' });
          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      })
    );
  }, [card, columnId]);

  return (
    <>
      <CardDisplay
        outerRef={outerRef}
        innerRef={innerRef}
        state={state}
        card={card}
      />
      {state.type === 'preview' &&
        createPortal(
          <CardDisplay state={state} card={card} />,
          state.container
        )}
    </>
  );
}

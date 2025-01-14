// import { v4 as uuidv4 } from 'uuid';

// export const coloumn_data = [
//   {
//     id: uuidv4(),
//     title: 'Todo',
//     cards: [
//       {
//         id: uuidv4(),
//         title: 'front end card',
//         priority: 'High',
//         description: 'description for Todo card 1',
//       },
//       {
//         id: uuidv4(),
//         title: 'backend card',
//         priority: 'Meduim',
//         description: 'description for Todo card 2',
//       },
//       {
//         id: uuidv4(),
//         title: 'fullstack developer card',
//         priority: 'High',
//         description: 'description for Todo card 3',
//       },
//       {
//         id: uuidv4(),
//         title: 'backend developer card',
//         priority: 'High',
//         description: 'description for Todo card 4',
//       },
//       {
//         id: uuidv4(),
//         title: 'tasklyics app ',
//         priority: 'Meduim',
//         description: 'description for Todo card 5',
//       },
//       {
//         id: uuidv4(),
//         title: 'comrex private limited',
//         priority: 'High',
//         description: 'description for Todo card 6',
//       },
//     ],
//   },
//   {
//     id: uuidv4(),
//     title: 'InProgress',
//     cards: [
//       {
//         id: uuidv4(),
//         priority: 'low',
//         title: 'this card assigne to Mubashir',
//         description: 'description for InProgress card 7',
//       },
//       {
//         id: uuidv4(),
//         priority: 'High',
//         title: 'this card assigne to Sunny',
//         description: 'description for InProgress card 8',
//       },
//       {
//         id: uuidv4(),
//         title: 'this card assigne to Muavia',
//         priority: 'Meduim',

//         description: 'description for InProgress card 9',
//       },
//     ],
//   },
//   {
//     id: uuidv4(),
//     title: 'Testing',
//     cards: [
//       {
//         id: uuidv4(),
//         priority: 'Meduim',
//         title: 'Atta ul Mustafa ',
//         description: 'description for Testing card 10',
//       },
//       {
//         id: uuidv4(),
//         title: 'Testing card 11',
//         priority: 'low',
//         description: 'description for Testing card 11',
//       },
//       {
//         id: uuidv4(),
//         title: 'Testing',
//         priority: 'High',
//         description: 'description for Testing card 12',
//       },
//       {
//         id: uuidv4(),
//         priority: 'Meduim',
//         title: 'haris card 13',
//         description: 'description for Testing card 13',
//       },
//     ],
//   },
//   {
//     id: uuidv4(),
//     title: 'Done',
//     cards: [
//       {
//         id: uuidv4(),
//         title: 'dev card 14',
//         priority: 'low',
//         description: 'description for Done card 14',
//       },
//       {
//         id: uuidv4(),
//         title: 'Done card 15',
//         priority: 'High',
//         description: 'description for Done card 15',
//       },
//       {
//         id: uuidv4(),
//         title: 'tasklytics card 16',
//         priority: 'low',
//         description: 'description for Done card 16',
//       },
//     ],
//   },
//   {
//     id: uuidv4(),
//     title: 'Assigne',
//     cards: [
//       {
//         id: uuidv4(),
//         priority: 'Meduim',
//         title: 'Assigne card 17',
//         description: ' frontend team card description for Assigne card 17',
//       },
//       {
//         id: uuidv4(),
//         title: 'purelify Assigne ',
//         priority: 'low',
//         description: 'description for Assigne card 18',
//       },
//       {
//         id: uuidv4(),
//         title: 'frontend team card 19',
//         priority: 'High',
//         description: 'description for Assigne card 19',
//       },
//       {
//         id: uuidv4(),
//         title: 'Assigne card 20',
//         priority: 'low',
//         description: 'description for Assigne card 20',
//       },
//       {
//         id: uuidv4(),
//         priority: 'low',
//         title: 'this card assigne to Mubashir',
//         description: 'description for InProgress card 7',
//       },
//       {
//         id: uuidv4(),
//         priority: 'High',
//         title: 'this card assigne to Sunny',
//         description: 'description for InProgress card 8',
//       },
//       {
//         id: uuidv4(),
//         title: 'this card assigne to Muavia',
//         priority: 'Meduim',

//         description: 'description for InProgress card 9',
//       },
//     ],
//   },
//   {
//     id: uuidv4(),
//     title: 'Done',
//     cards: [
//       {
//         id: uuidv4(),
//         title: 'Done card 21',
//         priority: 'low',
//         description: 'description for Done card 21',
//       },
//       {
//         id: uuidv4(),
//         title: 'Done card 22',
//         priority: 'High',
//         description: 'description for Done card 22',
//       },
//       {
//         id: uuidv4(),
//         title: 'Done card 23',
//         priority: 'low',
//         description: 'description for Done card 23',
//       },
//     ],
//   },
// ];

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

//////huge data for testing purpose only
import { v4 as uuidv4 } from 'uuid';
import { TBoard, TCard, TColumn } from '../data';

export const coloumn_data = [
  {
    id: uuidv4(),
    title: 'Todo',
    cards: [
      {
        id: uuidv4(),
        title: 'front end card',
        priority: 'High',
        description: 'description for Todo card 1',
      },
      {
        id: uuidv4(),
        title: 'backend card',
        priority: 'Meduim',
        description: 'description for Todo card 2',
      },
      {
        id: uuidv4(),
        title: 'fullstack developer card',
        priority: 'High',
        description: 'description for Todo card 3',
      },
      {
        id: uuidv4(),
        title: 'backend developer card',
        priority: 'High',
        description: 'description for Todo card 4',
      },
      {
        id: uuidv4(),
        title: 'tasklyics app ',
        priority: 'Meduim',
        description: 'description for Todo card 5',
      },
      {
        id: uuidv4(),
        title: 'comrex private limited',
        priority: 'High',
        description: 'description for Todo card 6',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'InProgress',
    cards: [
      {
        id: uuidv4(),
        priority: 'low',
        title: 'muavia Haidri',
        description: 'description for InProgress card 7',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Testing',
    cards: [
      {
        id: uuidv4(),
        priority: 'Meduim',
        title: 'Atta ul Mustafa ',
        description: 'description for Testing card 10',
      },
      {
        id: uuidv4(),
        title: 'Testing card 11',
        priority: 'low',
        description: 'description for Testing card 11',
      },
      {
        id: uuidv4(),
        title: 'Testing',
        priority: 'High',
        description: 'description for Testing card 12',
      },
      {
        id: uuidv4(),
        priority: 'Meduim',
        title: 'haris card 13',
        description: 'description for Testing card 13',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Done',
    cards: [
      {
        id: uuidv4(),
        priority: 'High',
        title: 'this card assigne to Sunny',
        description: 'description for InProgress card 8',
      },
      {
        id: uuidv4(),
        title: 'Done card 15',
        priority: 'High',
        description: 'description for Done card 15',
      },
      {
        id: uuidv4(),
        title: 'tasklytics card 16',
        priority: 'low',
        description: 'description for Done card 16',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Assigne',
    cards: [
      {
        id: uuidv4(),
        priority: 'low',
        title: 'this card assigne to Mubashir',
        description: 'description for InProgress card 7',
      },
      {
        id: uuidv4(),
        title: 'purelify Assigne ',
        priority: 'low',
        description: 'description for Assigne card 18',
      },
      {
        id: uuidv4(),
        title: 'frontend team card 19',
        priority: 'High',
        description: 'description for Assigne card 19',
      },
      {
        id: uuidv4(),
        title: 'Assigne card 20',
        priority: 'low',
        description: 'description for Assigne card 20',
      },
      {
        id: uuidv4(),
        priority: 'low',
        title: 'this card assigne to Mubashir',
        description: 'description for InProgress card 7',
      },
      {
        id: uuidv4(),
        priority: 'High',
        title: 'this card assigne to Sunny',
        description: 'description for InProgress card 8',
      },
      {
        id: uuidv4(),
        title: 'this card assigne to Muavia',
        priority: 'Meduim',

        description: 'description for InProgress card 9',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Done',
    cards: [
      {
        id: uuidv4(),
        title: 'Done card 21',
        priority: 'low',
        description: 'description for Done card 21',
      },
      {
        id: uuidv4(),
        title: 'Done card 22',
        priority: 'High',
        description: 'description for Done card 22',
      },
      {
        id: uuidv4(),
        title: 'Done card 23',
        priority: 'low',
        description: 'description for Done card 23',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Todo',
    cards: [
      {
        id: uuidv4(),
        title: 'front end card',
        priority: 'High',
        description: 'description for Todo card 1',
      },
      {
        id: uuidv4(),
        title: 'backend card',
        priority: 'Meduim',
        description: 'description for Todo card 2',
      },
      {
        id: uuidv4(),
        title: 'fullstack developer card',
        priority: 'High',
        description: 'description for Todo card 3',
      },
      {
        id: uuidv4(),
        title: 'backend developer card',
        priority: 'High',
        description: 'description for Todo card 4',
      },
      {
        id: uuidv4(),
        title: 'tasklyics app ',
        priority: 'Meduim',
        description: 'description for Todo card 5',
      },
      {
        id: uuidv4(),
        title: 'comrex private limited',
        priority: 'High',
        description: 'description for Todo card 6',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'InProgress',
    cards: [
      {
        id: uuidv4(),
        priority: 'low',
        title: 'this card assigne to Mubashir',
        description: 'description for InProgress card 7',
      },
      {
        id: uuidv4(),
        priority: 'High',
        title: 'this card assigne to Sunny',
        description: 'description for InProgress card 8',
      },
      {
        id: uuidv4(),
        title: 'this card assigne to Muavia',
        priority: 'Meduim',

        description: 'description for InProgress card 9',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Testing',
    cards: [
      {
        id: uuidv4(),
        priority: 'Meduim',
        title: 'Atta ul Mustafa ',
        description: 'description for Testing card 10',
      },
      {
        id: uuidv4(),
        title: 'Testing card 11',
        priority: 'low',
        description: 'description for Testing card 11',
      },
      {
        id: uuidv4(),
        title: 'Testing',
        priority: 'High',
        description: 'description for Testing card 12',
      },
      {
        id: uuidv4(),
        priority: 'Meduim',
        title: 'haris card 13',
        description: 'description for Testing card 13',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Done',
    cards: [
      {
        id: uuidv4(),
        title: 'dev card 14',
        priority: 'low',
        description: 'description for Done card 14',
      },
      {
        id: uuidv4(),
        title: 'Done card 15',
        priority: 'High',
        description: 'description for Done card 15',
      },
      {
        id: uuidv4(),
        title: 'tasklytics card 16',
        priority: 'low',
        description: 'description for Done card 16',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Assigne',
    cards: [
      {
        id: uuidv4(),
        priority: 'Meduim',
        title: 'Assigne card 17',
        description: ' frontend team card description for Assigne card 17',
      },
      {
        id: uuidv4(),
        title: 'purelify Assigne ',
        priority: 'low',
        description: 'description for Assigne card 18',
      },
      {
        id: uuidv4(),
        title: 'frontend team card 19',
        priority: 'High',
        description: 'description for Assigne card 19',
      },
      {
        id: uuidv4(),
        title: 'Assigne card 20',
        priority: 'low',
        description: 'description for Assigne card 20',
      },
      {
        id: uuidv4(),
        priority: 'low',
        title: 'this card assigne to Mubashir',
        description: 'description for InProgress card 7',
      },
      {
        id: uuidv4(),
        priority: 'High',
        title: 'this card assigne to Sunny',
        description: 'description for InProgress card 8',
      },
      {
        id: uuidv4(),
        title: 'this card assigne to Muavia',
        priority: 'Meduim',

        description: 'description for InProgress card 9',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Done',
    cards: [
      {
        id: uuidv4(),
        title: 'dev card 14',
        priority: 'low',
        description: 'description for Done card 14',
      },
      {
        id: uuidv4(),
        title: 'Done card 15',
        priority: 'High',
        description: 'description for Done card 15',
      },
      {
        id: uuidv4(),
        title: 'tasklytics card 16',
        priority: 'low',
        description: 'description for Done card 16',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Assigne',
    cards: [
      {
        id: uuidv4(),
        priority: 'Meduim',
        title: 'Assigne card 17',
        description: ' frontend team card description for Assigne card 17',
      },
      {
        id: uuidv4(),
        title: 'purelify Assigne ',
        priority: 'low',
        description: 'description for Assigne card 18',
      },
      {
        id: uuidv4(),
        title: 'frontend team card 19',
        priority: 'High',
        description: 'description for Assigne card 19',
      },
      {
        id: uuidv4(),
        title: 'Assigne card 20',
        priority: 'low',
        description: 'description for Assigne card 20',
      },
      {
        id: uuidv4(),
        priority: 'low',
        title: 'this card assigne to Mubashir',
        description: 'description for InProgress card 7',
      },
      {
        id: uuidv4(),
        priority: 'High',
        title: 'this card assigne to Sunny',
        description: 'description for InProgress card 8',
      },
      {
        id: uuidv4(),
        title: 'this card assigne to Muavia',
        priority: 'Meduim',

        description: 'description for InProgress card 9',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Done',
    cards: [
      {
        id: uuidv4(),
        title: 'Done card 21',
        priority: 'low',
        description: 'description for Done card 21',
      },
      {
        id: uuidv4(),
        title: 'Done card 22',
        priority: 'High',
        description: 'description for Done card 22',
      },
      {
        id: uuidv4(),
        title: 'Done card 23',
        priority: 'low',
        description: 'description for Done card 23',
      },
    ],
  },
];

import type { TriviaDeck } from '../types'

export const starterDeck = {
  id: 'core-starter-deck',
  name: 'Core Starter Deck',
  description: 'A small local deck for MVP development and interface testing.',
  cards: [
    {
      id: 'card-0001',
      difficulty: 'easy',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'Which river runs through London?',
          answer: 'The Thames',
        },
        {
          category: 'entertainment',
          question: 'Which singer released the album 21?',
          answer: 'Adele',
        },
        {
          category: 'history',
          question: 'Which wall fell in 1989, symbolizing the end of the Cold War in Europe?',
          answer: 'The Berlin Wall',
        },
        {
          category: 'arts',
          question: 'Who painted Girl with a Pearl Earring?',
          answer: 'Johannes Vermeer',
        },
        {
          category: 'science',
          question: 'What planet is known as the Red Planet?',
          answer: 'Mars',
        },
        {
          category: 'sports',
          question: 'How many players from one team are on the court in basketball at a time?',
          answer: 'Five',
        },
      ],
    },
    {
      id: 'card-0002',
      difficulty: 'medium',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'What is the capital city of New Zealand?',
          answer: 'Wellington',
        },
        {
          category: 'entertainment',
          question: 'Which TV series follows the Roy family and their media empire?',
          answer: 'Succession',
        },
        {
          category: 'history',
          question: 'Who was the first woman to fly solo across the Atlantic Ocean?',
          answer: 'Amelia Earhart',
        },
        {
          category: 'arts',
          question: 'Which novelist wrote Beloved?',
          answer: 'Toni Morrison',
        },
        {
          category: 'science',
          question: 'What gas do plants absorb from the atmosphere during photosynthesis?',
          answer: 'Carbon dioxide',
        },
        {
          category: 'sports',
          question: 'In baseball, how many strikes make an out?',
          answer: 'Three',
        },
      ],
    },
    {
      id: 'card-0003',
      difficulty: 'medium',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'Mount Kilimanjaro is located in which country?',
          answer: 'Tanzania',
        },
        {
          category: 'entertainment',
          question: 'Which movie won the Academy Award for Best Picture in 2020 for its 2019 release?',
          answer: 'Parasite',
        },
        {
          category: 'history',
          question: 'Which ship famously sank on its maiden voyage in 1912?',
          answer: 'The Titanic',
        },
        {
          category: 'arts',
          question: 'Which playwright wrote Hamlet?',
          answer: 'William Shakespeare',
        },
        {
          category: 'science',
          question: 'What is the hardest natural substance on Earth?',
          answer: 'Diamond',
        },
        {
          category: 'sports',
          question: 'What color jersey is awarded to the Tour de France leader?',
          answer: 'Yellow',
        },
      ],
    },
    {
      id: 'card-0004',
      difficulty: 'easy',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'Which desert covers much of northern Africa?',
          answer: 'The Sahara',
        },
        {
          category: 'entertainment',
          question: 'Which pop star is known as the Material Girl?',
          answer: 'Madonna',
        },
        {
          category: 'history',
          question: 'Which ancient civilization built Machu Picchu?',
          answer: 'The Inca',
        },
        {
          category: 'arts',
          question: 'Who composed The Four Seasons?',
          answer: 'Antonio Vivaldi',
        },
        {
          category: 'science',
          question: 'What part of the cell contains the genetic material in eukaryotes?',
          answer: 'The nucleus',
        },
        {
          category: 'sports',
          question: 'In soccer, what is it called when a player scores three goals in one game?',
          answer: 'A hat trick',
        },
      ],
    },
    {
      id: 'card-0005',
      difficulty: 'medium',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'Which US state is known as the Aloha State?',
          answer: 'Hawaii',
        },
        {
          category: 'entertainment',
          question: 'Which musician is nicknamed The Boss?',
          answer: 'Bruce Springsteen',
        },
        {
          category: 'history',
          question: 'Which document begins with the words "We the People"?',
          answer: 'The United States Constitution',
        },
        {
          category: 'arts',
          question: 'The Persistence of Memory is a famous painting by which artist?',
          answer: 'Salvador Dali',
        },
        {
          category: 'science',
          question: 'What force keeps planets in orbit around the Sun?',
          answer: 'Gravity',
        },
        {
          category: 'sports',
          question: 'How long is an Olympic swimming pool?',
          answer: '50 meters',
        },
      ],
    },
  ],
} satisfies TriviaDeck

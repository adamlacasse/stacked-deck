import type { TriviaDeck } from '../types'
import { assertValidDeck } from './validateDeck'

const deckData = {
  id: 'core-starter-deck',
  name: 'Core Starter Deck',
  description: 'A general-knowledge starter deck for game-night play.',
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
    {
      id: 'card-0006',
      difficulty: 'medium',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'What river flows through Budapest?',
          answer: 'The Danube',
        },
        {
          category: 'entertainment',
          question: 'Which 1994 film features Vincent Vega and Jules Winnfield?',
          answer: 'Pulp Fiction',
        },
        {
          category: 'history',
          question: 'Which treaty ended World War I in 1919?',
          answer: 'The Treaty of Versailles',
        },
        {
          category: 'arts',
          question: 'Who wrote The Name of the Rose?',
          answer: 'Umberto Eco',
        },
        {
          category: 'science',
          question: 'What element has the symbol Ne?',
          answer: 'Neon',
        },
        {
          category: 'sports',
          question: 'What term in tennis means a score of zero?',
          answer: 'Love',
        },
      ],
    },
    {
      id: 'card-0007',
      difficulty: 'easy',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'What is the longest river in the world?',
          answer: 'The Nile',
        },
        {
          category: 'entertainment',
          question: 'Which band performed the song Bohemian Rhapsody?',
          answer: 'Queen',
        },
        {
          category: 'history',
          question: 'In which century did Christopher Columbus first reach the Americas?',
          answer: 'The 15th century (1492)',
        },
        {
          category: 'arts',
          question: 'In which museum does the Mona Lisa hang?',
          answer: 'The Louvre',
        },
        {
          category: 'science',
          question: 'How many bones are in the adult human body?',
          answer: '206',
        },
        {
          category: 'sports',
          question: 'How many holes are played in a standard round of golf?',
          answer: '18',
        },
      ],
    },
    {
      id: 'card-0008',
      difficulty: 'medium',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'Which ocean is the largest by surface area?',
          answer: 'The Pacific Ocean',
        },
        {
          category: 'entertainment',
          question: 'Which actress played Katniss Everdeen in The Hunger Games films?',
          answer: 'Jennifer Lawrence',
        },
        {
          category: 'history',
          question: 'Who was the first President of the United States?',
          answer: 'George Washington',
        },
        {
          category: 'arts',
          question: 'Who sculpted the statue of David?',
          answer: 'Michelangelo',
        },
        {
          category: 'science',
          question: 'What is the chemical symbol for gold?',
          answer: 'Au',
        },
        {
          category: 'sports',
          question: 'In which sport would you perform a slam dunk?',
          answer: 'Basketball',
        },
      ],
    },
    {
      id: 'card-0009',
      difficulty: 'hard',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'Which country contains the most natural freshwater lakes?',
          answer: 'Canada',
        },
        {
          category: 'entertainment',
          question: 'Which director made the film 2001: A Space Odyssey?',
          answer: 'Stanley Kubrick',
        },
        {
          category: 'history',
          question: 'Which empire was ruled by Suleiman the Magnificent?',
          answer: 'The Ottoman Empire',
        },
        {
          category: 'arts',
          question: 'What nationality was the composer Frédéric Chopin?',
          answer: 'Polish',
        },
        {
          category: 'science',
          question: 'What is the speed of light in a vacuum, approximately in km/s?',
          answer: '300,000 km/s',
        },
        {
          category: 'sports',
          question: 'Which country has won the most FIFA World Cup titles?',
          answer: 'Brazil',
        },
      ],
    },
    {
      id: 'card-0010',
      difficulty: 'easy',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'What is the capital of France?',
          answer: 'Paris',
        },
        {
          category: 'entertainment',
          question: 'What is the name of the lion in The Lion, the Witch and the Wardrobe?',
          answer: 'Aslan',
        },
        {
          category: 'history',
          question: 'On which date did the United States declare independence?',
          answer: 'July 4, 1776',
        },
        {
          category: 'arts',
          question: 'Which Shakespeare play features the characters Romeo and Juliet?',
          answer: 'Romeo and Juliet',
        },
        {
          category: 'science',
          question: 'What is the closest planet to the Sun?',
          answer: 'Mercury',
        },
        {
          category: 'sports',
          question: 'How many players are on a standard soccer team on the field?',
          answer: 'Eleven',
        },
      ],
    },
    {
      id: 'card-0011',
      difficulty: 'medium',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'Which African country is home to the pyramids of Giza?',
          answer: 'Egypt',
        },
        {
          category: 'entertainment',
          question: 'Which actor played Tony Stark in the Marvel Cinematic Universe?',
          answer: 'Robert Downey Jr.',
        },
        {
          category: 'history',
          question: 'Which scientist developed the theory of general relativity?',
          answer: 'Albert Einstein',
        },
        {
          category: 'arts',
          question: 'In ballet, what is the term for spinning on one foot?',
          answer: 'A pirouette',
        },
        {
          category: 'science',
          question: 'What is the most abundant gas in Earth\'s atmosphere?',
          answer: 'Nitrogen',
        },
        {
          category: 'sports',
          question: 'What shape is a standard boxing ring?',
          answer: 'Square',
        },
      ],
    },
    {
      id: 'card-0012',
      difficulty: 'medium',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'Which city is known as the City of Canals?',
          answer: 'Venice',
        },
        {
          category: 'entertainment',
          question: 'Which British TV show features the fictional agency Wernham Hogg?',
          answer: 'The Office',
        },
        {
          category: 'history',
          question: 'Who led the Cuban Revolution that brought him to power in 1959?',
          answer: 'Fidel Castro',
        },
        {
          category: 'arts',
          question: 'Which Russian composer wrote Swan Lake?',
          answer: 'Pyotr Ilyich Tchaikovsky',
        },
        {
          category: 'science',
          question: 'What is the powerhouse of the cell?',
          answer: 'The mitochondria',
        },
        {
          category: 'sports',
          question: 'Which sport uses a puck?',
          answer: 'Ice hockey',
        },
      ],
    },
    {
      id: 'card-0013',
      difficulty: 'hard',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'What is the name of the strait between Spain and Morocco?',
          answer: 'The Strait of Gibraltar',
        },
        {
          category: 'entertainment',
          question: 'Which author created the fictional detective Hercule Poirot?',
          answer: 'Agatha Christie',
        },
        {
          category: 'history',
          question: 'Which Roman emperor declared Christianity the official religion of the Roman Empire?',
          answer: 'Theodosius I',
        },
        {
          category: 'arts',
          question: 'Who wrote the opera La Traviata?',
          answer: 'Giuseppe Verdi',
        },
        {
          category: 'science',
          question: 'What is the term for the boundary around a black hole beyond which nothing can escape?',
          answer: 'The event horizon',
        },
        {
          category: 'sports',
          question: 'How many points is a try worth in rugby union?',
          answer: 'Five',
        },
      ],
    },
    {
      id: 'card-0014',
      difficulty: 'easy',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'Which mountain range runs along the border of France and Spain?',
          answer: 'The Pyrenees',
        },
        {
          category: 'entertainment',
          question: 'What is the name of the toy cowboy in Toy Story?',
          answer: 'Woody',
        },
        {
          category: 'history',
          question: 'Who painted the Sistine Chapel ceiling?',
          answer: 'Michelangelo',
        },
        {
          category: 'arts',
          question: 'Which author wrote the Harry Potter series?',
          answer: 'J.K. Rowling',
        },
        {
          category: 'science',
          question: 'What are the three states of matter?',
          answer: 'Solid, liquid, and gas',
        },
        {
          category: 'sports',
          question: 'In which sport do competitors perform a triple axel?',
          answer: 'Figure skating',
        },
      ],
    },
    {
      id: 'card-0015',
      difficulty: 'medium',
      tags: ['starter', 'general'],
      entries: [
        {
          category: 'geography',
          question: 'Which country has the largest land area in the world?',
          answer: 'Russia',
        },
        {
          category: 'entertainment',
          question: 'Which band released the album Abbey Road?',
          answer: 'The Beatles',
        },
        {
          category: 'history',
          question: 'In what year did the first moon landing take place?',
          answer: '1969',
        },
        {
          category: 'arts',
          question: 'Which Dutch post-impressionist painter is known for cutting off part of his ear?',
          answer: 'Vincent van Gogh',
        },
        {
          category: 'science',
          question: 'What vitamin does the human body produce when exposed to sunlight?',
          answer: 'Vitamin D',
        },
        {
          category: 'sports',
          question: 'What is the maximum score in a single game of ten-pin bowling?',
          answer: '300',
        },
      ],
    },
  ],
} satisfies TriviaDeck

assertValidDeck(deckData)

export const starterDeck = deckData

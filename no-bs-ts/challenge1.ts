const houses = [
  { name: 'Atreides', planets: 'Calladan' },
  { name: 'Corrino', planets: ['Kaitan', 'Salusa Secundus'] },
  { name: 'Harkonnen', planets: ['Giedi Prime', 'Arrakis'] },
];

interface House {
  name: string;
  planets: string | string[];
}

interface HouseWithID extends House {
  id: number;
}

// function findHouses(houses: string): HouseWithID[];
// function findHouses(houses: House[]): HouseWithID[];
// function findHouses(
//   houses: string,
//   filter: (house: House) => boolean
// ): HouseWithID[];
// function findHouses(
//   houses: House[],
//   filter: (house: House) => boolean
// ): HouseWithID[];

function findHouses(
  houses: string | House[],
  filter?: (house: House) => boolean
): HouseWithID[] {
  if (typeof houses === 'string') houses = JSON.parse(houses) as House[];
  let housesWithID: HouseWithID[] = houses.map((house, idx) => ({
    id: idx,
    ...house,
  }));
  if (filter) housesWithID = housesWithID.filter(filter);

  return housesWithID;
}

// Test
console.log(
  findHouses(JSON.stringify(houses), ({ name }) => name === 'Atreides')
);

console.log(findHouses(houses, ({ name }) => name === 'Harkonnen'));

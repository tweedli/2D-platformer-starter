module.exports = {
  map1: {
    map: "map1",
    leftNeighbor: "",
    rightNeighbor: "map2",
    enemies: {
      goomba: 3,
      turtle: 1
    }
  },
  map2: {
    map: "map2",
    leftNeighbor: "map1",
    rightNeighbor: "map3",
    enemies: {
      goomba: 4,
      turtle: 2
    }
  },
  map3: {
    map: "map3",
    leftNeighbor: "map2",
    rightNeighbor: "",
      enemies: {
      goomba: 8,
      turtle: 4
    }
  },
  world1: {
    map: "world1",
    leftNeighbor: "",
    rightNeighbor: "map2",
    enemies: {
      goomba: 30,
      turtle: 16
    },
  },
}
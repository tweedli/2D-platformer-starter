module.exports = {
  // map1: {
  //   map: "map1",
  //   leftNeighbor: "",
  //   rightNeighbor: "map2",
  //   enemies: {
  //     goomba: 3,
  //     turtle: 1
  //   }
  // },
  // map2: {
  //   map: "map2",
  //   leftNeighbor: "map1",
  //   rightNeighbor: "map3",
  //   enemies: {
  //     goomba: 4,
  //     turtle: 2
  //   }
  // },
  // map3: {
  //   map: "map3",
  //   leftNeighbor: "map2",
  //   rightNeighbor: "",
  //     enemies: {
  //     goomba: 8,
  //     turtle: 4
  //   }
  // },
  world1: {
    map: "world1",
    leftNeighbor: "",
    rightNeighbor: "world2",
    leftEntry: "",
    rightEntry: "",
    enemies: {
      goomba: 30,
      turtle: 16
    },
    entryPoint: "",
    farBackground: true,
    middleBackground: true,
    groundLayer: true,
    exitLayer: false,
    backgroundColor: '2471A3'
  },
  world2: {
    map: "world2",
    leftNeighbor: "world1",
    interiorNeighbor1: "interior1",
    fromInside: {
      interior1: "151x38"
    },
    rightNeighbor: "",
    leftEntry: "",
    rightEntry: "",
    enemies: {
      goomba: 12,
      turtle: 6
    },
    farBackground: true,
    middleBackground: true,
    groundLayer: true,
    exitLayer: true,
    backgroundColor: '2471A3'
  },
  interior1: {
    map: "interior1",
    leftNeighbor: "world2",
    rightNeighbor: "",
    leftEntry: {x:8, y:344},
    leftToOutside:true,
    leftExit: {x:2416, y:600},
    rightEntry: "",
    enemies: {
      goomba: 12,
      turtle: 6
    },
    farBackground: false,
    middleBackground: false,
    exitLayer: false,
    backgroundColor: '000000',
    leftToOutside: true
  },
}
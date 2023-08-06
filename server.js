const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require("graphql");
const app = express();
const PORT = process.env.PORT || 3000;

// Sample data
const hotels = [
  {
    id: 1,
    name: "Superior Room",
    location: "City A",
    rooms: [101, 102],
    title: "Premium Room with Balcony or Terrace",
    info: "These Superior Rooms come with one king or two double beds, elegant linens, and comfortable armchairs. In the mornings, brew yourself a cup of coffee with the coffeemaker as you get ready for the day. If you need to, set up your laptop at the work desk, and check email using free Wi-Fi. At the end of the day, you can relax with the soothing rain shower in the spacious bathroom, and then stream your favorite show on the TV with mirror casting before heading to bed. Other amenities include a wardrobe, double-glazed windows, and an in-room safe to secure your valuables.",
  },
  {
    id: 2,
    name: "Deluxe Room    ",
    location: "City A",
    rooms: [101, 102],
    title: "Premium Room with Balcony or Terrace",
    info: "Our Deluxe Room comes with either two double beds or one king bed, depending on your needs, and offers more space than the standard rooms. Unwind from your travels with a spacious bathroom with a rain shower. In the mornings, you can brew coffee in your room and check email or make ticket reservations with free Wi-Fi. After a long day of work or sightseeing, grab a drink from the minibar, relax in the plush armchair, and stream your favorite show on the smart TV. These rooms also include a wardrobe, double-glazed windows, and all other standard amenities.    ",
  },
  {
    id: 3,
    name: "Business Class Room",
    location: "City A",
    rooms: [101, 102],
    title: "Premium Room with Balcony or Terrace",
    info: "Corporate travelers love our Business Class Rooms, which come with two twin beds, perfect for traveling with colleagues, or one king bed. Enjoy plush bedding, a spacious bathroom, and all standard amenities. Additionally, take advantage of the following complimentary upgrades: a bathrobe and slippers, daily turndown service, four pieces of complimentary laundry, a daily breakfast at the Business Class lounge or Water Garden Brasserie, and complimentary airport transfers.    ",
  },
  {
    id: 4,
    name: "Suite",
    location: "City A",
    rooms: [101, 102],
    title: "Premium Room with Balcony or Terrace",
    info: "For an extended stay or for extra space, choose one of our Suites. These spacious surroundings include a separate living area and a bedroom with either two double beds or  one king bed  for ultimate comfort and privacy. You can chat with friends or colleagues in the living area and then retire to the separate bedroom for a quiet night’s sleep. In addition to all standard amenities, our Suites include a free deep sleep pillow spray and turndown service every evening.",
  },

  // ... add more hotels
];

const roomsData = [
  { id: 101, type: "Single", price: 100 },
  { id: 102, type: "Double", price: 150 },
  { id: 201, type: "Single", price: 120 },
  { id: 202, type: "Double", price: 180 },
  { id: 203, type: "Suite", price: 250 },
  // ... add more rooms
];

const RoomType = new GraphQLObjectType({
  name: "Room",
  fields: {
    id: { type: GraphQLInt },
    type: { type: GraphQLString },
    price: { type: GraphQLInt },
    title: { type: GraphQLString },
    info: { type: GraphQLString },
  },
});

const HotelType = new GraphQLObjectType({
  name: "Hotel",
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    location: { type: GraphQLString },
    title: { type: GraphQLString },
    info: { type: GraphQLString },
    rooms: {
      type: new GraphQLList(RoomType),
      resolve(parent, args) {
        return roomsData.filter((room) => parent.rooms.includes(room.id));
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    hotels: {
      type: new GraphQLList(HotelType),
      resolve(parent, args) {
        return hotels;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

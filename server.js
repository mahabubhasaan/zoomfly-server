const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require("graphql");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
// Sample data
const hotels = [
  {
    id: 1,
    name: "Superior Room",
    img: "https://mdbcdn.b-cdn.net/img/new/standard/city/029.webp",
    location: "City A",
    rooms: [101, 102],
    opportunity:
      'price:"max. guests:2 adults bed type: 2 double or 1 king size: 28 m²Free Wi-Fi TV with mirror casting Work desk Coffee and tea facilities Minibar or fridge In-room safe Iron and ironing board Professional hair dryer Magnifying mirror Individual room climate control Rain shower',
    title: "Premium Room with Balcony or Terrace",
    info: "These Superior Rooms come with one king or two double beds, elegant linens, and comfortable armchairs. In the mornings, brew yourself a cup of coffee with the coffeemaker as you get ready for the day. If you need to, set up your laptop at the work desk, and check email using free Wi-Fi. At the end of the day, you can relax with the soothing rain shower in the spacious bathroom, and then stream your favorite show on the TV with mirror casting before heading to bed. Other amenities include a wardrobe, double-glazed windows, and an in-room safe to secure your valuables.",
  },
  {
    id: 2,
    name: "Deluxe Room",
    img: "https://mdbcdn.b-cdn.net/img/new/standard/city/035.webp",
    location: "City A",
    rooms: [101, 102],
    title: "Premium Room with Balcony or Terrace",
    info: "Our Deluxe Room comes with either two double beds or one king bed, depending on your needs, and offers more space than the standard rooms. Unwind from your travels with a spacious bathroom with a rain shower. In the mornings, you can brew coffee in your room and check email or make ticket reservations with free Wi-Fi. After a long day of work or sightseeing, grab a drink from the minibar, relax in the plush armchair, and stream your favorite show on the smart TV. These rooms also include a wardrobe, double-glazed windows, and all other standard amenities.    ",
  },
  {
    id: 3,
    name: "Business Class Room",
    img: "https://mdbcdn.b-cdn.net/img/new/standard/city/038.webp",
    location: "City A",
    rooms: [101, 102],
    title: "Premium Room with Balcony or Terrace",
    info: "Corporate travelers love our Business Class Rooms, which come with two twin beds, perfect for traveling with colleagues, or one king bed. Enjoy plush bedding, a spacious bathroom, and all standard amenities. Additionally, take advantage of the following complimentary upgrades: a bathrobe and slippers, daily turndown service, four pieces of complimentary laundry, a daily breakfast at the Business Class lounge or Water Garden Brasserie, and complimentary airport transfers.    ",
  },
  {
    id: 4,
    name: "Suite",
    img: "https://mdbcdn.b-cdn.net/img/new/standard/city/039.webp",
    location: "City A",
    rooms: [101, 102],
    title: "Premium Room with Balcony or Terrace",
    info: "For an extended stay or for extra space, choose one of our Suites. These spacious surroundings include a separate living area and a bedroom with either two double beds or  one king bed  for ultimate comfort and privacy. You can chat with friends or colleagues in the living area and then retire to the separate bedroom for a quiet night’s sleep. In addition to all standard amenities, our Suites include a free deep sleep pillow spray and turndown service every evening.",
  },

  // ... add more hotels
];

const roomsData = [
  {
    id: 101,
    type: "Single",
    price: 100,
    opportunity:
      "Deal of the day Breakfast included Free cancellation before August 06, 2023, 6pm Pay on arrival Pay with Points",
  },
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
    opportunity: { type: GraphQLString },
    images: { type: GraphQLList(GraphQLString) }, // Add this field for multiple images

    info: { type: GraphQLString },
  },
});

const HotelType = new GraphQLObjectType({
  name: "Hotel",
  fields: {
    id: { type: GraphQLInt },
    img: { type: GraphQLString },
    name: { type: GraphQLString },
    location: { type: GraphQLString },
    title: { type: GraphQLString },
    info: { type: GraphQLString },
    opportunity: { type: GraphQLString },
    images: { type: GraphQLList(GraphQLString) }, // Add this field for multiple images

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

mongoose.connect("mongodb://localhost:27017/zoomfly", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createHotel: {
      type: HotelType,
      args: {
        id: { type: GraphQLInt },
        img: { type: GraphQLString },
        name: { type: GraphQLString },
        location: { type: GraphQLString },
        title: { type: GraphQLString },
        info: { type: GraphQLString },
        opportunity: { type: GraphQLString },
        images: { type: GraphQLList(GraphQLString) },
      },
      async resolve(parent, args) {
        const newHotel = new HotelModel({
          name: args.name,
          img: args.img,
          name: args.name,
          location: args.location,
          title: args.title,
          info: args.info,
          opportunity: args.opportunity,
          // ... initialize other fields
        });

        try {
          const savedHotel = await newHotel.save();
          return savedHotel;
        } catch (error) {
          throw new Error("Error creating hotel");
        }
      },
    },

    updateHotel: {
      type: HotelType,
      args: {
        id: { type: GraphQLInt },
        img: { type: GraphQLString },
        name: { type: GraphQLString },
        location: { type: GraphQLString },
        title: { type: GraphQLString },
        info: { type: GraphQLString },
        opportunity: { type: GraphQLString },
        images: { type: GraphQLList(GraphQLString) },
        // ... add more fields as needed
      },
      async resolve(parent, args) {
        try {
          const updatedHotel = await HotelModel.findByIdAndUpdate(
            args.id,
            {
              $set: {
                id: { type: GraphQLInt },
                img: { type: GraphQLString },
                name: { type: GraphQLString },
                location: { type: GraphQLString },
                title: { type: GraphQLString },
                info: { type: GraphQLString },
                opportunity: { type: GraphQLString },
                images: { type: GraphQLList(GraphQLString) },
                // ... update other fields
              },
            },
            { new: true }
          );
          return updatedHotel;
        } catch (error) {
          throw new Error("Error updating hotel");
        }
      },
    },

    deleteHotel: {
      type: GraphQLString,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          await HotelModel.findByIdAndDelete(args.id);
          return "Hotel deleted";
        } catch (error) {
          throw new Error("Error deleting hotel");
        }
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
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

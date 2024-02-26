import { useGlobalContext } from "../Context/PreviewContext";
import { useQuery } from "react-query";
import FetchCategories from "../data/fetchCategories";
import PropTypes from "prop-types";

export default function Category({ loading }) {
  const { inputData, setInputData } = useGlobalContext();

  // const {data:category_data} = useQuery({
  //     queryFn: async ()=> FetchCategories(api_key=""),
  //     queryKey: "categories"
  // })

  const data = {
    categories: [
      "Airport",
      "Amusement Park",
      "Apartment",
      "Aquarium",
      "Art Gallery",
      "Bakery",
      "Bar",
      "Basketball Court",
      "Beach",
      "Beachvolleyball Court",
      "Bed And Breakfast",
      "Bike Path",
      "Brewery",
      "Bus Station",
      "Business",
      "Cafe",
      "Camping Ground",
      "Car Rental Agency",
      "Chambers Of Commerce",
      "Chiropractor",
      "Church",
      "Clinic",
      "Clothing Store",
      "Coffee Shop",
      "College And University",
      "Comedy Club",
      "Community Center",
      "Concert Hall",
      "Dance Studio",
      "Deli",
      "Dentist",
      "Department Store",
      "Distillery",
      "Doctor",
      "Electronics Store",
      "Farmers Market",
      "Fast Food Restaurant",
      "Ferry Terminal",
      "Food Truck",
      "Football Field",
      "Furniture Store",
      "Garden",
      "Gas Station",
      "Golf Course",
      "Government Office",
      "Grocery Store",
      "Guesthouse",
      "Gym",
      "Hiking Trail",
      "Home Improvement Store",
      "Hostel",
      "Hotel",
      "Ice Cream Shop",
      "Inn",
      "Jewelry Store",
      "Librarie",
      "Mall",
      "Martial Arts Studio",
      "Massagetherapist",
      "Mosque",
      "Motel",
      "Movie Theater",
      "Museum",
      "Music Venue",
      "Nightclub",
      "Optometrist",
      "Outlet Mall",
      "Park",
      "Parking Garage",
      "Performing Arts Center",
      "Pharmacy",
      "Professional Organizationhospital",
      "Restaurant",
      "Retreat",
      "Rv Park",
      "School",
      "Shoe Store",
      "Ski Resort",
      "Snowboarding Resort",
      "Soccer Field",
      "Spa Resort",
      "Sporting Good Store",
      "Store",
      "Synagogue",
      "Taxi Stand",
      "Tea Shop",
      "Temple",
      "Tennis Court",
      "Theater",
      "Theme Park",
      "Timeshare",
      "Tow Truck Company",
      "Trade Association",
      "Train Station",
      "Vacation Rental",
      "Water Park",
      "Wine Bar",
      "Yoga Studio",
      "Zoo",
    ],
  };
  const categories = data?.categories;
  return (
    <input
      disabled={loading}
      name="category"
      id="category"
      onChange={(e) =>
        setInputData({ ...inputData, query_string: e.target.value })
      }
      className="select w-[200px] h-[33px] bg-[#D9D9D9] px-3"
      autoComplete="category-name"
      value={inputData.query_string}
      placeholder="..e.g School"
    />
     

  );
}

Category.propTypes = {
  loading: PropTypes.bool.isRequired,
};

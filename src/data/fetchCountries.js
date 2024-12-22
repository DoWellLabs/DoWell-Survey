// import axios from "axios";

// export default async function FetchCountries(api_key) {
//     try {
//         const response = await axios.post(
//             `https://100074.pythonanywhere.com/get-countries-v3/?api_key=${api_key}`
//         );

//         const countries = response?.data?.data[0]?.countries || []; // Safely access countries array

//         // Transform the countries into the desired format
//         const transformedCountries = countries.map((country) => ({
//             label: country.charAt(0).toUpperCase() + country.slice(1), // Capitalize the first letter
//             value: country,
//         }));
//         // console.log("Successfully fetching transformedCountries:", transformedCountries);

//         return transformedCountries;
//     } catch (error) {
//         console.error("Error fetching countries:", error);
//         return []; // Return an empty array in case of an error
//     }
// }

import axios from "axios";

export default async function FetchCountries(api_key) {
    return (
        await axios.post(`https://100074.pythonanywhere.com/get-countries-v3/?api_key=${api_key}`)
    );
}
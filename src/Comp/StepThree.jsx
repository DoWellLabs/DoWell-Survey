import  { useState } from 'react';

const StepThree = () => {
  const [formData, setFormData] = useState({
    picture: null,
    inputField1: '',
    dropdown1: '',
    inputField2: '',
    dropdown2: '',
    textArea: '',
    disclaimerChecked: false,
    qrCodeUrl: null, // To store the QR code URL
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, picture: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = {
      location: "abuja",
      promotional: formData.textArea,
      survey_link: formData.inputField2,
      product: formData.dropdown1,
      brandname: formData.inputField1,
    };

    fetch('https://dowell-surveys-qr-2.onrender.com/qr-code/codes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data);

        // Check if the API response contains a QR code URL
        if (data.qr_link          ) {
          setFormData({ ...formData, qrCodeUrl: data.qr_link  });
        } else {
          console.error('No QR code URL found in the API response');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        {/* ...  ... */}


       {/* Picture Upload */}
       <div className="mb-4 relative py-10  flex justify-center items-center text-center mx-10   ">
          <label
            className="w-16 h-16 bg-gray-500 hover:bg-blue-700 text-white rounded-full cursor-pointer flex flex-col items-center justify-center"
            htmlFor="picture"
          >
            Upload Picture
         
            <input
              type="file"
              id="picture"
              name="picture"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden "
            />
          </label>
        </div>
          

          

        {/* Input Field 1 */}
        <div className="mb-4">
          {/* <label className="block text-red-700 text-sm font-bold mb-2">
          </label> */}
          <input 
          required
            type="text"
            name="inputField1"
            value={formData.inputField1}
            placeholder='Enter Your Brand Name'
            onChange={handleInputChange}
            className=" border rounded w-full py-2 px-3 bg-gray-300  border-r-10 "

          />
        </div>

        {/* Dropdown 1 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
          </label>
          <select
            name="dropdown1"
            value={formData.dropdown1}
            onChange={handleInputChange}
            className="appearance-none border rounded w-full py-2 px-3 bg-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Your Product/Service</option>
            <option value="option1">resturant</option>
            <option value="option2">Option 2</option>
          </select>
        </div>

        {/* Input Field 2 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
          </label>
          <input
            type="text"
            name="inputField2"
            placeholder='Enter Link To Survey Form'
            value={formData.inputField2}
            onChange={handleInputChange}
            className="appearance-none border rounded w-full py-2 px-3 bg-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Dropdown 2 */}
        <div className="mb-4">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2">
            Dropdown 2
          </label> */}
          <select
            name="dropdown2"
            value={formData.dropdown2}
            onChange={handleInputChange}
            className="appearance-none border rounded w-full py-2 px-3 bg-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Survey Location</option>
            <option value="option1">London</option>
            <option value="option2">India</option>
            <option value="option3">abuja</option>
          </select>
        </div>

        {/* Text Area */}
        <div className="mb-6 ">
          
          <textarea
            name="textArea"
            value={formData.textArea}
            onChange={handleInputChange}
            placeholder='Enter a promotional Sentence To Attract participants(15 words)  '

            className="appearance-none border rounded w-full py-2 px-3 bg-gray-300 text-black leading-tight focus:outline-none focus:shadow-outline h-32"
          ></textarea>
        </div>

         {/* Disclaimer Checkbox */}
         <div className="mb-4">
          <label className="flex items-end gap-60">
          <span className="ml-2 text-gray-700 text-sm">
               Disclaimer
            </span>
            <input
              type="checkbox"
              name="disclaimerChecked"
              checked={formData.disclaimerChecked}
              onChange={handleInputChange}
              className="form-checkbox h-4 w-4 text-blue-500"
            />
         
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-blue-700 text-white font-bold py-5 px-10 rounded focus:outline-none focus:shadow-outline"
          >
            create survey campaign
          </button>
        </div>

        
        {/* Display the QR code if URL is available */}
        {formData.qrCodeUrl && (
          <div className="mb-4 flex justify-center items-center">
            <img src={formData.qrCodeUrl} alt="QR Code" />
          </div>
        )}


         {/* Display the QR code URL */}
         {formData.qrCodeUrl && (
          <div className="mb-4">
            <p className="text-lg font-semibold">QR Code URL:</p>
            <a
              href={formData.qrCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {formData.qrCodeUrl}
            </a>
          </div>
        )}

       
      </form>
    </div>
  );
};

export default StepThree;

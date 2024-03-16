/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const UploadFile = ({ setImage }) => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Upload file
      </label>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];

          console.log(URL.createObjectURL(file));
        }}
      />
    </div>
  );
};

export default UploadFile;

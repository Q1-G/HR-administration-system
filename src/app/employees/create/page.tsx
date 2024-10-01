"use client";

import { api } from 'src/trpc/react'; 
import { useState } from 'react';

const CreateEmployee = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [isManager, setIsManager] = useState('No'); 
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [showSuccess, setShowSuccess] = useState(false); 
  const [telephoneError, setTelephoneError] = useState('');

  // Correct usage of mutation hook
  const createEmployeeMutation = api.employee.create.useMutation();

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName || !lastName || !telephone || !email) {
      alert("All fields are required!");
      return;
    }

    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(telephone)) {
      setTelephoneError("Telephone number can only contain numbers.");
      return;
    } else {
      setTelephoneError('');
    }

    setShowConfirmation(true); 
  };

  // Save button confirmation
  const handleSave = async () => {
    try {
      // Mutation to save employee data
      await createEmployeeMutation.mutateAsync({
        firstName,
        lastName,
        telephone,
        email,
        status: 'Active', 
        username: email, 
        departments: [], 
        managerId: isManager === 'Yes' ? 1 : undefined, 
      });
  
      // Reset form fields after saving
      setFirstName('');
      setLastName('');
      setTelephone('');
      setEmail('');
      setIsManager('No');
      setShowConfirmation(false); 
      setShowSuccess(true); 
  
      // Hide success message after 4 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Failed to create employee. Please try again.");
    }
  };

  const handleCancel = () => {
    setFirstName('');
    setLastName('');
    setTelephone('');
    setEmail('');
    setIsManager('No');
  };

  return (
    <div className="min-h-screen bg-white p-8 xl:px-64 lg:px-48">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Create New Employee</h1>
      
      <form onSubmit={handleFormSubmit} className="bg-white border border-blue-600 p-8 rounded shadow-lg space-y-6">
        {/* First Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Name</label>
          <input
            type="text"
            className="bg-white border border-blue-600 text-black p-2 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        {/* Surname */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Surname</label>
          <input
            type="text"
            className="bg-white border border-blue-600 text-black p-2 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* Telephone */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Telephone Number</label>
          <input
            type="text"
            className="bg-white border border-blue-600 text-black p-2 rounded"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
          />
          {telephoneError && <p className="text-red-500">{telephoneError}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Email Address</label>
          <input
            type="email"
            className="bg-white border border-blue-600 text-black p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Manager */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Manager</label>
          <select
            className="bg-white border border-blue-600 text-black p-2 rounded"
            value={isManager}
            onChange={(e) => setIsManager(e.target.value)}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
          Employee created successfully!
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black mb-4">Are you sure you want to save this employee information?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleSave}
              >
                Yes
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowConfirmation(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEmployee;
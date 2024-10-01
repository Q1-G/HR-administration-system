"use client";

import { api } from 'src/trpc/react';
import { useState } from 'react';

const CreateDepartment = () => {
  const [name, setName] = useState('');
  const [managerId, setManagerId] = useState<number | null>(null); 
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch all employees to populate the manager dropdown
  const { data: employees } = api.employee.getAll.useQuery();

  // Correct usage of mutation hook to create a department
  const createDepartmentMutation = api.department.create.useMutation();

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      alert("Department name is required!");
      return;
    }

    try {
      // Mutation to save department data
      await createDepartmentMutation.mutateAsync({
        name,
        managerId: managerId || undefined, 
      });

      // Reset form fields after saving
      setName('');
      setManagerId(null);
      setShowSuccess(true);

      // Hide success message after 4 seconds
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error("Error creating department:", error);
      alert("Failed to create department. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 xl:px-64 lg:px-48">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Create New Department</h1>

      <form onSubmit={handleFormSubmit} className="bg-white border border-blue-600 p-8 rounded shadow-lg space-y-6">
      
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Department Name</label>
          <input
            type="text"
            className="bg-white border border-blue-600 text-black p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Manager</label>
          <select
            className="bg-white border border-blue-600 text-black p-2 rounded"
            value={managerId ?? ""}
            onChange={(e) => setManagerId(Number(e.target.value) || null)}
          >
            <option value="">No Manager</option>
            {employees?.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
        </div>

        
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </form>

    
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
          Department created successfully!
        </div>
      )}
    </div>
  );
};

export default CreateDepartment;
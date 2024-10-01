"use client";

import { api } from 'src/trpc/react'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EditDepartment = () => {
  const router = useRouter();
  const { id } = router.query; 
  const departmentId = typeof id === 'string' ? parseInt(id, 10) : null;

  // Fetch department data
  const { data: departmentData, isLoading, error } = departmentId ? api.department.getById.useQuery(departmentId) : { data: null, isLoading: false, error: null };
  
  // Fetch managers list for dropdown
  const { data: managers } = api.employee.getAll.useQuery(); 

  const [name, setName] = useState('');
  const [managerId, setManagerId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState('Active'); 

  useEffect(() => {
    if (departmentData) {
      setName(departmentData.name);
      setManagerId(departmentData.managerId);
      setStatus(departmentData.status);
    }
  }, [departmentData]);

  const updateDepartmentMutation = api.department.update.useMutation();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Call mutation to update the department
      await updateDepartmentMutation.mutateAsync({
        id: departmentId,
        name,
        managerId,
        status,
      });
      
      router.push('/departments'); // Redirect to department list after saving
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Failed to update department. Please try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading department: {error.message}</div>;

  return (
    <div className="min-h-screen bg-white p-8 xl:px-64 lg:px-48">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Edit Department</h1>

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
            value={managerId}
            onChange={(e) => setManagerId(parseInt(e.target.value))}
          >
            <option value="">No Manager</option>
            {managers?.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.firstName} {manager.lastName}
              </option>
            ))}
          </select>
        </div>

      
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Status</label>
          <select
            className="bg-white border border-blue-600 text-black p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

    
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditDepartment;
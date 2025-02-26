"use client";

import { api } from 'src/trpc/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';


const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  managerId: z.number().nullable(),
});

type FormData = z.infer<typeof departmentSchema>;

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

const CreateDepartment = () => {
  const createDepartmentMutation = api.department.create.useMutation();
  const [showSuccess, setShowSuccess] = useState(false); 
  const [showCancelDialog, setShowCancelDialog] = useState(false); 
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      managerId: null,
    },
  });

  const { data: employees } = api.employee.getAll.useQuery<Employee[]>();

  const onSubmit = async (data: FormData) => {
    setShowSaveDialog(false); 

    try {
      await createDepartmentMutation.mutateAsync({
        name: data.name,
        managerId: data.managerId || undefined,
      });

      reset(); 
      setShowSuccess(true); 

      
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Failed to create department. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true); 
  };

  const handleConfirmCancel = () => {
    reset(); 
    
    window.location.href = '/departments'; 
  };

  const handleConfirmSave = () => {
    setShowSaveDialog(true); 
  };

  return (
    <div className="min-h-screen bg-white p-8 xl:px-64 lg:px-48">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Create New Department</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-blue-600 p-8 rounded shadow-lg space-y-6">
        {/* Department Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Department Name</label>
          <input
            type="text"
            className={`bg-white border border-blue-600 text-black p-2 rounded ${errors.name ? 'border-red-500' : ''}`}
            {...register('name')}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Manager Dropdown */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Manager</label>
          <select
            className="bg-white border border-blue-600 text-black p-2 rounded"
            {...register('managerId', { valueAsNumber: true })}
          >
            <option value="">No Manager</option>
            {employees?.map((employee: Employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleConfirmSave}
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

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black mb-4">Unsaved changes will be lost. Are you sure you want to cancel?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleConfirmCancel}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowCancelDialog(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black mb-4">Are you sure you want to create this department?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleSubmit(onSubmit)} // Confirm save
              >
                Yes
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowSaveDialog(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
          Department created successfully!
        </div>
      )}
    </div>
  );
};

export default CreateDepartment;



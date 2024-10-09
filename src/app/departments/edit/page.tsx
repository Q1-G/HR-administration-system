"use client";

import { useRouter, useSearchParams } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import { api } from 'src/trpc/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  managerId: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

const EditDepartment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const departmentId = Number(searchParams.get('departmentId')); 

  const { data: departmentData, isLoading, error } = api.department.getById.useQuery(departmentId);
  const { data: employees } = api.employee.getAll.useQuery();

  const [showSuccess, setShowSuccess] = useState(false); 
  const [showCancelDialog, setShowCancelDialog] = useState(false); 
  const [showSaveDialog, setShowSaveDialog] = useState(false); 

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
  });

  useEffect(() => {
    if (departmentData) {
      reset({
        name: departmentData.name,
        managerId: departmentData.manager?.id.toString() ?? '',
        status: departmentData.status,
      });
    }
  }, [departmentData, reset]);

  const updateDepartmentMutation = api.department.update.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload(); 
      }, 4000);
    },
    onError: (error: any) => {
      console.error('Error updating department:', error);
    },
  });

  const onSubmit = (data: DepartmentFormData) => {
    setShowSaveDialog(false); 
    updateDepartmentMutation.mutate({
      id: departmentId,
      ...data,
      managerId: data.managerId ? Number(data.managerId) : null, 
    });
  };

  const handleConfirmSave = () => {
    setShowSaveDialog(true); 
  };

  const handleCancel = () => {
    setShowCancelDialog(true); 
  };

  const handleConfirmCancel = () => {
    reset(); // Reset the form
    router.push('/departments'); 
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading department: {error.message}</div>;

  return (
    <div className="min-h-screen bg-white p-8 xl:px-64 lg:px-48">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Edit Department</h1>

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
            {...register('managerId')}
          >
            <option value="">No Manager</option>
            {employees?.map((employee: Employee) => (
              <option key={employee.id} value={employee.id.toString()}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
          {errors.managerId && <p className="text-red-500">{errors.managerId.message}</p>}
        </div>

        {/* Status */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Status</label>
          <select
            className="bg-white border border-blue-600 text-black p-2 rounded"
            {...register('status')}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && <p className="text-red-500">{errors.status.message}</p>}
        </div>

        {/* Buttons: Save and Cancel */}
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
            <p className="text-black mb-4">Confirm you agree with the changes made to this department's information?</p>
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
          Department edited successfully!
        </div>
      )}
    </div>
  );
};

export default EditDepartment;


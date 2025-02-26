"use client";

import { api } from 'src/trpc/react'; 
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import bcrypt from 'bcryptjs'; 


const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  telephone: z.string().regex(/^[0-9]+$/, 'Telephone number must contain only numbers'),
  email: z.string().email('Invalid email format'),
  isManager: z.enum(['Yes', 'No']).optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

const CreateEmployee = () => {
  const createEmployeeMutation = api.employee.create.useMutation();
  const [showSuccess, setShowSuccess] = useState(false); 
  const [showCancelDialog, setShowCancelDialog] = useState(false); 
  const [showSaveDialog, setShowSaveDialog] = useState(false); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    setShowSaveDialog(false); 

    try {
      
      const hashedPassword = await bcrypt.hash('Password123#', 10);

      await createEmployeeMutation.mutateAsync({
        ...data,
        status: 'Active', 
        username: data.email, 
        managerId: data.isManager === 'Yes' ? 1 : undefined, 
        departments: [],
        user: {
          create: {
            email: data.email,
            hashedPassword, 
            role: data.isManager === 'Yes' ? 'manager' : 'employee',
          },
        },
      });

      reset(); 
      setShowSuccess(true); 

      
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Failed to create employee. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true); 
  };

  const handleConfirmCancel = () => {
    reset(); // Reset the form
    window.location.href = '/home'; 
  };

  const handleConfirmSave = () => {
    setShowSaveDialog(true); 
  };

  return (
    <div className="min-h-screen bg-white p-8 xl:px-64 lg:px-48">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Create New Employee</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-blue-600 p-8 rounded shadow-lg space-y-6">
        {/* First Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">First Name</label>
          <input
            type="text"
            className={`bg-white border border-blue-600 text-black p-2 rounded ${errors.firstName ? 'border-red-500' : ''}`}
            {...register('firstName')}
          />
          {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Last Name</label>
          <input
            type="text"
            className={`bg-white border border-blue-600 text-black p-2 rounded ${errors.lastName ? 'border-red-500' : ''}`}
            {...register('lastName')}
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
        </div>

        {/* Telephone */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Telephone Number</label>
          <input
            type="text"
            className={`bg-white border border-blue-600 text-black p-2 rounded ${errors.telephone ? 'border-red-500' : ''}`}
            {...register('telephone')}
          />
          {errors.telephone && <p className="text-red-500">{errors.telephone.message}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Email Address</label>
          <input
            type="email"
            className={`bg-white border border-blue-600 text-black p-2 rounded ${errors.email ? 'border-red-500' : ''}`}
            {...register('email')}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        {/* Manager */}
        <div className="flex flex-col space-y-2">
          <label className="text-black font-bold">Manager</label>
          <select
            className="bg-white border border-blue-600 text-black p-2 rounded"
            {...register('isManager')}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
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
            <p className="text-black mb-4">Are you sure you want to create this employee?</p>
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
          Employee created successfully!
        </div>
      )}
    </div>
  );
};

export default CreateEmployee;




"use client";


import { useForm } from 'react-hook-form';
import { api } from 'src/trpc/react'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';

const EditEmployee = () => {
  const router = useRouter();
  const { id } = router.query; 
  const employeeId = typeof id === 'string' ? parseInt(id, 10) : null;

  const { data: employeeData, isLoading, error } = employeeId ? api.employee.getById.useQuery(employeeId) : { data: null, isLoading: false, error: null };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [isManager, setIsManager] = useState('No');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (employeeData) {
      setFirstName(employeeData.firstName);
      setLastName(employeeData.lastName);
      setTelephone(employeeData.telephone);
      setEmail(employeeData.email);
      setIsManager(employeeData.managerId ? 'Yes' : 'No');
      setStatus(employeeData.status);
    }
  }, [employeeData]);

  // Correct usage of useMutation
  const updateEmployeeMutation = useMutation(async (variables) => {
    return api.employee.update.mutateAsync(variables); 
  }, {
    onSuccess: () => {
      router.push('/employees'); 
    },
    onError: (error) => {
      console.error('Error updating employee:', error);
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const managerId = isManager === 'Yes' ? employeeId : undefined; 
  
    if (employeeId) {
      updateEmployeeMutation.mutate({
        id: employeeId,
        firstName,
        lastName,
        telephone,
        email,
        status,
        managerId, 
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading employee: {error.message}</div>;

  return (
    <div>
      <h1>Edit Employee</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>First Name</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </div>
        <div>
          <label>Last Name</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
          />
        </div>
        <div>
          <label>Telephone</label>
          <input 
            type="text" 
            value={telephone} 
            onChange={(e) => setTelephone(e.target.value)} 
          />
        </div>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label>Manager</label>
          <select 
            value={isManager} 
            onChange={(e) => setIsManager(e.target.value)} 
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div>
          <label>Status</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditEmployee;
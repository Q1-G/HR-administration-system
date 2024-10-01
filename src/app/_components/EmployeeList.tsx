import { api } from 'src/trpc/react'; 
import React from 'react';
import { useSession } from 'next-auth/react';

const EmployeeList = () => {
  
  const { data, error, isLoading } = api.employee.getAll.useQuery();

  
  if (isLoading) return <div>Loading employees...</div>;

  
  if (error) return <div>Error loading employees: {error.message}</div>;

  if (!data || data.length === 0) {
    return <div>No employees found.</div>;
}

  
  return (
    <div>
      <h1>Employee List</h1>
      {data?.map((employee) => (
        <div key={employee.id}>
          <p>{employee.firstName} {employee.lastName}</p>
          <p>Email: {employee.email}</p>
          <p>Status: {employee.status}</p>
        
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;
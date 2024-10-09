"use client";

import { api } from '../../trpc/react'; 
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const departmentSchema = z.object({
  search: z.string().optional(),
  statusFilter: z.enum(['All', 'Active', 'Inactive']).default('All'),
});

interface Department {
  id: number;
  name: string;
  manager?: {
    firstName: string;
    lastName: string;
  } | null;
  status: string;
}

const DepartmentListView = () => {
  const { data: departments, isLoading, error } = api.department.getAll.useQuery();
  const updateDepartmentMutation = api.department.update.useMutation();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      search: '',
      statusFilter: 'All',
    },
  });

  const search = watch('search');
  const statusFilter = watch('statusFilter');

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error loading departments: {error.message}</div>;

  const toggleDepartmentStatus = async (department: Department) => {
    const newStatus = department.status === 'Active' ? 'Inactive' : 'Active';

    try {
      await updateDepartmentMutation.mutateAsync({
        id: department.id,
        status: newStatus,
      });

      
      window.location.reload();  
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredDepartments = departments?.filter((department: Department) => {
    const matchesSearch = department.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || department.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDepartments?.length / rowsPerPage);
  const paginatedDepartments = filteredDepartments?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="min-h-screen bg-white p-8 xl:px-64 lg:px-48">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-blue-600">Departments</h1>
      </div>

      {/* Filters Container */}
      <form onSubmit={handleSubmit(() => {})} className="bg-white border border-blue-600 p-4 rounded shadow-lg mb-4">
        <h2 className="text-xl font-bold mb-2 text-black">Filters</h2>
        <div className="flex items-center">
          <label className="text-black font-bold w-32">Status</label>
          <select
            className="bg-white border border-blue-600 text-black p-2 rounded w-full"
            {...register('statusFilter')}
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </form>

      {/* Search bar and Show per page dropdown */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <label className="text-black">Show per page:</label>
          <select
            className="bg-white border border-blue-600 text-black p-2 rounded"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="All">All</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search departments..."
          className="bg-white border border-blue-600 text-black p-2 rounded"
          {...register('search')}
        />
      </div>

      {/* Department Table */}
      <table className="table-auto bg-white border border-blue-600 text-black w-full rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4">Actions</th>
            <th className="p-4">Department Name</th>
            <th className="p-4">Manager</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDepartments?.map((department: Department) => (
            <tr key={department.id} className="border-t border-gray-300">
              <td className="p-4">
                <Link href={`/departments/edit?departmentId=${department.id}`}>
                  <button className="bg-blue-600 text-white p-2 rounded mr-2">Edit</button>
                </Link>
                {/* Toggle Activate/Deactivate Button */}
                <button
                  className={`p-2 rounded ${department.status === 'Active' ? 'bg-red-500' : 'bg-green-500'} text-white`}
                  onClick={() => toggleDepartmentStatus(department)}
                >
                  {department.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
              <td className="p-4">{department.name}</td>
              <td className="p-4">{department.manager ? `${department.manager.firstName} ${department.manager.lastName}` : "None"}</td>
              <td className="p-4">{department.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between">
        <div className="text-black">
          Showing {paginatedDepartments?.length} of {filteredDepartments?.length} departments
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-4 py-2 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentListView;





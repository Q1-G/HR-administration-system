"use client";

import { api } from '../../trpc/react'; 
import { useState } from 'react';
import Link from 'next/link';

const DepartmentListView = () => {
  const { data: departments, isLoading, error } = api.department.getAll.useQuery();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterClicked, setIsFilterClicked] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading departments: {error.message}</div>;

  // Filter departments based on the search input and status filter
  const filteredDepartments = departments?.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || department.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDepartments?.length / rowsPerPage);
  const paginatedDepartments = filteredDepartments?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleFilter = () => {
    setIsFilterClicked(true);
    setTimeout(() => setIsFilterClicked(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white p-8 xl:px-64 lg:px-48">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-blue-600">Departments</h1>
      </div>

      {/* Filters Container */}
      <div className="bg-white border border-blue-600 p-4 rounded shadow-lg mb-4">
        <h2 className="text-xl font-bold mb-2 text-black">Filters</h2>
        <div className="flex items-center">
          <label className="text-black font-bold w-32">Status</label>
          <select
            className="bg-white border border-blue-600 text-black p-2 rounded w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {/* Filter Button */}
        <button
          className={`mt-4 px-4 py-2 font-bold text-white rounded ${isFilterClicked ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={handleFilter}
        >
          Filter
        </button>
      </div>

      {/* Search and Show per page */}
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          {paginatedDepartments?.map((department) => (
            <tr key={department.id} className="border-t border-gray-300">
              <td className="p-4">
                <Link href={`/departments/edit/${department.id}`}>
                  <button className="bg-blue-600 text-white p-2 rounded mr-2">Edit</button>
                </Link>
                <Link href={`/departments/view/${department.id}`}>
                  <button className="bg-green-500 text-white p-2 rounded">View Employees</button>
                </Link>
              </td>
              <td className="p-4">{department.name}</td>
              <td className="p-4">{department.manager ? department.manager.firstName + ' ' + department.manager.lastName : "None"}</td>
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